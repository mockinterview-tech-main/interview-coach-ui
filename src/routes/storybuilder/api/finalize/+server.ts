import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { finalizeStarExtraction } from '$lib/server/interview';

// Runs one final STAR extraction over the full transcript at session end, so the
// summary is built from the freshest sidebar state (catches the user's last answer).
export const POST: RequestHandler = async ({ locals, request }) => {
  const authSession = await locals.getSession();
  if (!authSession) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return json({ error: 'sessionId is required' }, { status: 400 });
    }
    const sections = await finalizeStarExtraction(sessionId, locals.supabase);
    return json({ sections });
  } catch (err: any) {
    console.error('finalize extraction failed:', err.message);
    // Non-fatal — the summary can still proceed with the last in-session state.
    return json({ sections: null });
  }
};
