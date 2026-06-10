import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateTalkingPoints } from '$lib/server/claude';

export const POST: RequestHandler = async ({ locals, request }) => {
  const session = await locals.getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId, starSections, fullStory } = await request.json();
    if (!starSections && !fullStory) {
      return json({ error: 'starSections or fullStory is required' }, { status: 400 });
    }
    const points = await generateTalkingPoints(starSections || null, sessionId, fullStory, locals.supabase);
    return json({ talkingPoints: points });
  } catch (err: any) {
    console.error('Talking points error:', err);
    return json({ error: 'Failed to generate talking points' }, { status: 500 });
  }
};
