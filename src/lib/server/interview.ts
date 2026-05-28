import {
  getCoachResponse,
  streamCoachResponse,
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

export interface StarUpdate {
  section: string;
  content: string;
}

export interface ParsedResponse {
  chatMessage: string;
  starUpdate: StarUpdate | null;
  storyReady: boolean;
}

function parseCoachResponse(coachResponse: string): ParsedResponse {
  let starUpdate: StarUpdate | null = null;
  let chatMessage = coachResponse;

  const sectionMatch = coachResponse.match(
    /---UPDATE_STAR---\s*\n?section:\s*(situation|task|action|result)\s*\n?content:\s*([\s\S]*?)\s*---END_UPDATE---/i
  );
  if (sectionMatch) {
    starUpdate = {
      section: sectionMatch[1].toLowerCase(),
      content: sectionMatch[2].trim(),
    };
    chatMessage = coachResponse.replace(/---UPDATE_STAR---[\s\S]*?---END_UPDATE---/, '').trim();
  }

  const storyReady = coachResponse.includes('---STORY_READY---');
  if (storyReady) {
    chatMessage = chatMessage.replace(/---STORY_READY---/, '').trim();
  }

  return { chatMessage, starUpdate, storyReady };
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
    }
  );

  session.conversationHistory.push({
    role: 'assistant',
    content: coachResponse,
  });

  const { chatMessage, starUpdate, storyReady } = parseCoachResponse(coachResponse);

  if (starUpdate) {
    session.starSections[starUpdate.section as keyof StarSections] = starUpdate.content;
  }
  if (storyReady) {
    session.status = 'story_ready';
  }

  const remainingMs = Math.max(0, SESSION_LIMIT_MS - (Date.now() - new Date(session.startedAt).getTime()));

  writer.write(`data: ${JSON.stringify({
    type: 'done',
    message: chatMessage,
    done: storyReady,
    storyReady,
    starUpdate,
    remainingMs,
  })}\n\n`);
  writer.end();
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
  const coachResponse = await getCoachResponse(session.conversationHistory, elapsedMinutes, sessionId);

  session.conversationHistory.push({
    role: 'assistant',
    content: coachResponse,
  });

  const { chatMessage, starUpdate, storyReady } = parseCoachResponse(coachResponse);

  if (starUpdate) {
    session.starSections[starUpdate.section as keyof StarSections] = starUpdate.content;
  }
  if (storyReady) {
    session.status = 'story_ready';
  }

  const remainingMs = Math.max(0, SESSION_LIMIT_MS - (Date.now() - new Date(session.startedAt).getTime()));

  return {
    message: chatMessage,
    done: storyReady,
    storyReady,
    starUpdate,
    remainingMs,
  };
}

export async function endSession(sessionId: string, { skipReport = false } = {}) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error('Session not found');

  session.status = 'completed';
  session.completedAt = new Date().toISOString();

  if (skipReport) {
    const cost = getSessionCost(sessionId);
    if (cost) {
      console.log(`\n══ SESSION COMPLETE: ${sessionId} (report skipped) ══`);
      console.log(`  API calls: ${cost.api_calls} | TOTAL: ${cost.total_tokens.toLocaleString()} tokens → ${cost.total_cost}`);
    }
    return { skipped: true };
  }

  const userMessages = session.conversationHistory.filter(m => m.role === 'user');
  if (userMessages.length < 2) {
    session.status = 'active';
    return { error: 'too_short', message: 'Not enough conversation to build a story.' };
  }

  const report = await generateStoryReport(session.conversationHistory, sessionId);
  session.report = report;

  const cost = getSessionCost(sessionId);
  if (cost) {
    console.log(`\n══ SESSION COMPLETE: ${sessionId} ══`);
    console.log(`  API calls: ${cost.api_calls} | TOTAL: ${cost.total_tokens.toLocaleString()} tokens → ${cost.total_cost}`);
  }

  return report;
}

export function getSessionUsage(sessionId: string) {
  return getSessionCost(sessionId);
}
