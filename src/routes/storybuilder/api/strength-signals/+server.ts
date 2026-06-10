import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { evaluateStrengthSignals } from '$lib/server/claude';

export const POST: RequestHandler = async ({ locals, request }) => {
  const session = await locals.getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId, conversationHistory, question, fullStory } = await request.json();
    if (!conversationHistory || !fullStory) {
      return json({ error: 'conversationHistory and fullStory are required' }, { status: 400 });
    }
    const signals = await evaluateStrengthSignals(conversationHistory, question, fullStory, sessionId, locals.supabase);
    return json({ signals });
  } catch (err: any) {
    console.error('Strength signals error:', err);
    return json({ error: 'Failed to evaluate strength signals' }, { status: 500 });
  }
};
