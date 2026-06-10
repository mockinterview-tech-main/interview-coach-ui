import {
  getCoachResponse,
  streamCoachResponse,
  extractStarSections,
  generateStoryReport,
  getSessionCost,
  type ConversationMessage
} from './claude';

const SESSION_LIMIT_MS = 20 * 60 * 1000; // 20 minutes

const STARTER_PROMPTS = [
  'conflict with a teammate',
  'a project that failed or went off track',
  'leading without authority',
  'making a tough decision with incomplete info',
  'delivering under a tight deadline',
  'learning something new quickly',
  'mentoring or helping a colleague',
  'pushing back on a stakeholder',
  'going above and beyond for a user',
  'receiving and acting on critical feedback',
];

export interface StarSections {
  situation: string | null;
  task: string | null;
  action: string | null;
  result: string | null;
}

export interface Session {
  id: string;
  status: 'active' | 'completed' | 'story_ready';
  conversationHistory: ConversationMessage[];
  starSections: StarSections;
  extractedQuestion: string | null;
  extractedFlags: Array<{ flag: string; suggestion: string }> | null;
  startedAt: string;
  completedAt: string | null;
  report: any;
}

// In-memory session store (per server process)
const sessions = new Map<string, Session>();

export function createSession(): Session {
  const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const session: Session = {
    id,
    status: 'active',
    conversationHistory: [],
    starSections: { situation: null, task: null, action: null, result: null },
    extractedQuestion: null,
    extractedFlags: null,
    startedAt: new Date().toISOString(),
    completedAt: null,
    report: null,
  };

  sessions.set(id, session);
  return session;
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export async function startSession(sessionId: string): Promise<string> {
  const session = sessions.get(sessionId);
  if (!session) throw new Error('Session not found');

  const shuffled = [...STARTER_PROMPTS].sort(() => Math.random() - 0.5);
  const suggestions = shuffled.slice(0, 3);

  const openingMessage = `Hey! I'm here to help you build a strong STAR story for behavioral interviews. We've got 20 minutes, plenty of time to turn a real experience into a polished answer.

You can start by telling me which interview question you want to prepare for, or just describe a work experience you think could make a good story. If you're not sure where to begin, here are a few ideas: ${suggestions[0]}, ${suggestions[1]}, or ${suggestions[2]}.

What would you like to work on?`;

  session.conversationHistory.push({
    role: 'assistant',
    content: openingMessage,
  });

  return openingMessage;
}

// ── Streaming handler (writes SSE to a writable controller) ──
export async function handleUserMessageStream(
  sessionId: string,
  userMessage: string,
  writer: { write: (data: string) => void; end: () => void }
) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error('Session not found');
  if (session.status === 'completed') throw new Error('Session already completed');

  session.conversationHistory.push({
    role: 'user',
    content: userMessage,
  });

  const elapsed = Date.now() - new Date(session.startedAt).getTime();
  if (elapsed >= SESSION_LIMIT_MS) {
    const closingMessage = "We're at the 20-minute mark! Let me wrap up what we have and put together your story report.";
    session.conversationHistory.push({ role: 'assistant', content: closingMessage });
    session.status = 'completed';
    session.completedAt = new Date().toISOString();
    writer.write(`data: ${JSON.stringify({ type: 'chunk', text: closingMessage })}\n\n`);
    writer.write(`data: ${JSON.stringify({ type: 'done', message: closingMessage, done: true, remainingMs: 0 })}\n\n`);
    writer.end();
    return;
  }

  const elapsedMinutes = elapsed / 60000;

  const coachResponse = await streamCoachResponse(
    session.conversationHistory,
    elapsedMinutes,
    sessionId,
    (chunk) => {
      writer.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
    },
    session.starSections
  );

  session.conversationHistory.push({
    role: 'assistant',
    content: coachResponse,
  });

  const remainingMs = Math.max(0, SESSION_LIMIT_MS - (Date.now() - new Date(session.startedAt).getTime()));

  // Send the coach's conversational reply immediately
  writer.write(`data: ${JSON.stringify({
    type: 'done',
    message: coachResponse,
    done: false,
    remainingMs,
  })}\n\n`);

  // Fire STAR extraction in parallel — don't block the conversation
  const userMsgCount = session.conversationHistory.filter(m => m.role === 'user').length;
  if (userMsgCount >= 2) {
    extractStarSections(session.conversationHistory, sessionId)
      .then((sections) => {
        if (!sections) return;
        // Update server-side session with extracted sections
        const updates: { section: string; content: string }[] = [];
        if (sections.question) {
          session.extractedQuestion = sections.question;
        }
        if (sections.flags) {
          session.extractedFlags = sections.flags;
        }
        for (const key of ['situation', 'task', 'action', 'result'] as const) {
          if (sections[key] && sections[key] !== session.starSections[key]) {
            session.starSections[key] = sections[key];
            updates.push({ section: key, content: sections[key]! });
          }
        }
        if (updates.length > 0 || sections.question || sections.flags) {
          writer.write(`data: ${JSON.stringify({ type: 'star_update', updates, question: sections.question || null, flags: sections.flags || null })}\n\n`);
        }
        writer.end();
      })
      .catch((err) => {
        console.warn('STAR extraction failed:', err.message);
        writer.end();
      });
  } else {
    writer.end();
  }
}

// ── Non-streaming fallback ──
export async function handleUserMessage(sessionId: string, userMessage: string) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error('Session not found');
  if (session.status === 'completed') throw new Error('Session already completed');

  session.conversationHistory.push({
    role: 'user',
    content: userMessage,
  });

  const elapsed = Date.now() - new Date(session.startedAt).getTime();
  if (elapsed >= SESSION_LIMIT_MS) {
    const closingMessage = "We're at the 20-minute mark! Let me wrap up what we have and put together your story report.";
    session.conversationHistory.push({ role: 'assistant', content: closingMessage });
    session.status = 'completed';
    session.completedAt = new Date().toISOString();
    return { message: closingMessage, done: true, remainingMs: 0 };
  }

  const elapsedMinutes = elapsed / 60000;
  const coachResponse = await getCoachResponse(session.conversationHistory, elapsedMinutes, sessionId, session.starSections);

  session.conversationHistory.push({
    role: 'assistant',
    content: coachResponse,
  });

  const remainingMs = Math.max(0, SESSION_LIMIT_MS - (Date.now() - new Date(session.startedAt).getTime()));

  // Extract STAR sections in parallel
  const userMsgCount = session.conversationHistory.filter(m => m.role === 'user').length;
  let starUpdates: { section: string; content: string }[] | undefined;
  if (userMsgCount >= 2) {
    const sections = await extractStarSections(session.conversationHistory, sessionId);
    if (sections) {
      starUpdates = [];
      if (sections.question) {
        session.extractedQuestion = sections.question;
      }
      if (sections.flags) {
        session.extractedFlags = sections.flags;
      }
      for (const key of ['situation', 'task', 'action', 'result'] as const) {
        if (sections[key] && sections[key] !== session.starSections[key]) {
          session.starSections[key] = sections[key];
          starUpdates.push({ section: key, content: sections[key]! });
        }
      }
    }
  }

  return {
    message: coachResponse,
    done: false,
    starUpdates,
    flags: session.extractedFlags,
    remainingMs,
  };
}

export async function endSession(sessionId: string, { generateReport = false } = {}) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error('Session not found');

  session.status = 'completed';
  session.completedAt = new Date().toISOString();

  const cost = getSessionCost(sessionId);

  const durationMs = session.completedAt && session.startedAt
    ? new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()
    : null;

  const costData = cost ? {
    api_calls: cost.api_calls,
    input_tokens: cost.input_tokens,
    output_tokens: cost.output_tokens,
    total_tokens: cost.total_tokens,
    total_cost: cost.total_cost,
    total_cost_numeric: cost.total_cost_numeric,
  } : null;

  // Fallback: generate report from full transcript when STAR extractor didn't capture sections
  if (generateReport) {
    const userMessages = session.conversationHistory.filter(m => m.role === 'user');
    if (userMessages.length < 2) {
      return { error: 'too_short', message: 'Not enough conversation to build a story.' };
    }
    const report = await generateStoryReport(session.conversationHistory, sessionId);
    return { completed: true, report, cost: costData, durationMs };
  }

  return { completed: true, cost: costData, durationMs };
}

export function getSessionUsage(sessionId: string) {
  return getSessionCost(sessionId);
}
