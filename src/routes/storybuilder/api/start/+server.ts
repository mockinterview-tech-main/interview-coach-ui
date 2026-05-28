import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSession, startSession } from '$lib/server/interview';

export const POST: RequestHandler = async ({ locals }) => {
  // Auth check — require logged-in user
  if (!locals.pb?.authStore.isValid) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const session = createSession();
    const firstMessage = await startSession(session.id);
    return json({
      sessionId: session.id,
      message: firstMessage,
    });
  } catch (err: any) {
    console.error('Error starting session:', err);
    return json({ error: 'Failed to start session' }, { status: 500 });
  }
};
