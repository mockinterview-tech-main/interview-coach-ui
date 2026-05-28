import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { endSession, getSession } from '$lib/server/interview';

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.pb?.authStore.isValid) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId, skipReport } = await request.json();
    if (!sessionId) {
      return json({ error: 'sessionId is required' }, { status: 400 });
    }
    const report = await endSession(sessionId, { skipReport: !!skipReport });
    return json({ scorecard: report });
  } catch (err: any) {
    console.error('Error ending session:', err);
    return json({ scorecard: { error: 'api_error', message: 'Failed to connect to the AI service.' } });
  }
};
