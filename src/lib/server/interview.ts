import {
  getCoachResponse,
  streamCoachResponse,
  extractStarSections,
  generateStoryReport,
  trackUsageToDb,
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

// In-memory cache (fast path — may be empty on serverless cold start)
const sessions = new Map<string, Session>();

// ── Load session: memory first, then Supabase ──
async function loadSession(sessionId: string, supabase: any): Promise<Session | null> {
  // Fast path: in-memory
  const cached = sessions.get(sessionId);
  if (cached) return cached;

  // Slow path: load from Supabase
  const { data, error } = await supabase
    .from('session_logs')
    .select('session_id, created_at, status, conversation_history, star_sections, extracted_question, extracted_flags')
    .eq('session_id', sessionId)
    .single();

  if (error || !data) return null;

  const session: Session = {
    id: data.session_id,
    status: data.status === 'started' ? 'active' : data.status,
    conversationHistory: data.conversation_history || [],
    starSections: data.star_sections || { situation: null, task: null, action: null, result: null },
    extractedQuestion: data.extracted_question || null,
    extractedFlags: data.extracted_flags || null,
    startedAt: data.created_at,
    completedAt: null,
    report: null,
  };

  // Cache it for this instance
  sessions.set(sessionId, session);
  return session;
}

// ── Persist session state to Supabase (fire-and-forget) ──
function persistSession(sessionId: string, session: Session, supabase: any) {
  supabase
    .from('session_logs')
    .update({
      conversation_history: session.conversationHistory,
      star_sections: session.starSections,
      extracted_question: session.extractedQuestion,
      extracted_flags: session.extractedFlags,
    })
    .eq('session_id', sessionId)
    .then(({ error }: any) => {
      if (error) console.error('Failed to persist session state:', error.message);
    });
}

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

export async function startSession(sessionId: string, supabase: any): Promise<string> {
  const session = await loadSession(sessionId, supabase);
  if (!session) throw new Error('Session not found');

  const shuffled = [...STARTER_PROMPTS].sort(() => Math.random() - 0.5);
  const suggestions = shuffled.slice(0, 3);

  const openingMessage = `Hey! We've got 20 minutes, plenty of time to turn a real experience into a remarkable answer to impress your interviewer.

You can start by telling me which interview question you want to prepare for, or just describe a work experience you think could make a good story. If you're not sure where to begin, here are a few ideas: ${suggestions[0]}, ${suggestions[1]}, or ${suggestions[2]}.

What would you like to work on?`;

  session.conversationHistory.push({
    role: 'assistant',
    content: openingMessage,
  });

  // Persist opening message to Supabase
  persistSession(sessionId, session, supabase);

  return openingMessage;
}

// ── Streaming handler (writes SSE to a writable controller) ──
export async function handleUserMessageStream(
  sessionId: string,
  userMessage: string,
  writer: { write: (data: string) => void; end: () => void },
  supabase: any
) {
  const session = await loadSession(sessionId, supabase);
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
    persistSession(sessionId, session, supabase);
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
    session.starSections,
    supabase
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

  // Persist after coach reply (fire-and-forget)
  persistSession(sessionId, session, supabase);

  // Fire STAR extraction in parallel — don't block the conversation
  const userMsgCount = session.conversationHistory.filter(m => m.role === 'user').length;
  if (userMsgCount >= 2) {
    extractStarSections(session.conversationHistory, sessionId, supabase)
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
          // Persist updated STAR sections
          persistSession(sessionId, session, supabase);
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
export async function handleUserMessage(sessionId: string, userMessage: string, supabase: any) {
  const session = await loadSession(sessionId, supabase);
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
    persistSession(sessionId, session, supabase);
    return { message: closingMessage, done: true, remainingMs: 0 };
  }

  const elapsedMinutes = elapsed / 60000;
  const coachResponse = await getCoachResponse(session.conversationHistory, elapsedMinutes, sessionId, session.starSections, supabase);

  session.conversationHistory.push({
    role: 'assistant',
    content: coachResponse,
  });

  const remainingMs = Math.max(0, SESSION_LIMIT_MS - (Date.now() - new Date(session.startedAt).getTime()));

  // Persist after coach reply
  persistSession(sessionId, session, supabase);

  // Extract STAR sections in parallel
  const userMsgCount = session.conversationHistory.filter(m => m.role === 'user').length;
  let starUpdates: { section: string; content: string }[] | undefined;
  if (userMsgCount >= 2) {
    const sections = await extractStarSections(session.conversationHistory, sessionId, supabase);
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
      // Persist updated STAR sections
      persistSession(sessionId, session, supabase);
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

export async function endSession(sessionId: string, supabase: any, { generateReport = false } = {}) {
  const session = await loadSession(sessionId, supabase);
  if (!session) throw new Error('Session not found');

  session.status = 'completed';
  session.completedAt = new Date().toISOString();

  const durationMs = session.completedAt && session.startedAt
    ? new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()
    : null;

  // Fallback: generate report from full transcript when STAR extractor didn't capture sections
  if (generateReport) {
    const userMessages = session.conversationHistory.filter(m => m.role === 'user');
    if (userMessages.length < 2) {
      return { error: 'too_short', message: 'Not enough conversation to build a story.' };
    }
    const report = await generateStoryReport(session.conversationHistory, sessionId, supabase);
    return { completed: true, report, durationMs };
  }

  return { completed: true, durationMs };
}
