import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { assessSession } from '$lib/server/claude';
import { getSessionTargetCompany } from '$lib/server/interview';

// Grounded end-of-session assessment. Produces the whole summary (per-section
// talking points + strong/missing, cited strengths/growth, and a full story only
// when all four sections are green) from what the user actually shared. Replaces
// the old generateStoryReport + talking-points + strength-signals trio.
export const POST: RequestHandler = async ({ locals, request }) => {
  const authSession = await locals.getSession();
  if (!authSession) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { sessionId, starSections, starStatus, conversationHistory, question } = await request.json();

    const assessment = await assessSession(
      conversationHistory || [],
      {
        situation: starSections?.situation ?? null,
        task: starSections?.task ?? null,
        action: starSections?.action ?? null,
        result: starSections?.result ?? null,
      },
      {
        situation: starStatus?.situation ?? null,
        task: starStatus?.task ?? null,
        action: starStatus?.action ?? null,
        result: starStatus?.result ?? null,
      },
      question ?? null,
      sessionId,
      locals.supabase,
      // Read from the session server-side rather than trusting the client.
      await getSessionTargetCompany(sessionId, locals.supabase)
    );

    return json({ assessment });
  } catch (err: any) {
    console.error('assess endpoint error:', err.message);
    return json({ error: 'assess_failed' }, { status: 500 });
  }
};
