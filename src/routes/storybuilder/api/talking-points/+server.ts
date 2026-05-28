import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateTalkingPoints } from '$lib/server/claude';

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.pb?.authStore.isValid) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId, starSections } = await request.json();
    if (!starSections) {
      return json({ error: 'starSections is required' }, { status: 400 });
    }
    const points = await generateTalkingPoints(starSections, sessionId);
    return json({ talkingPoints: points });
  } catch (err: any) {
    console.error('Talking points error:', err);
    return json({ error: 'Failed to generate talking points' }, { status: 500 });
  }
};
