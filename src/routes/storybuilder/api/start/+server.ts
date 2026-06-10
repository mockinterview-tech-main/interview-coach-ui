import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSession, startSession } from '$lib/server/interview';

export const POST: RequestHandler = async ({ locals }) => {
  const authSession = await locals.getSession();
  if (!authSession) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const coachSession = createSession();
    const firstMessage = await startSession(coachSession.id);

    // Log session start (fire and forget)
    locals.supabase.from('session_logs').insert({
      user_id: authSession.user.id,
      session_id: coachSession.id,
      status: 'started',
    }).then(({ error }) => {
      if (error) console.error('Failed to log session start:', error.message);
    });

    return json({
      sessionId: coachSession.id,
      message: firstMessage,
    });
  } catch (err: any) {
    console.error('Error starting session:', err);
    return json({ error: 'Failed to start session' }, { status: 500 });
  }
};
