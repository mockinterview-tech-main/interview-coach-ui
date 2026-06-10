import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { endSession } from '$lib/server/interview';

export const POST: RequestHandler = async ({ locals, request }) => {
  const session = await locals.getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId, generateReport, starSectionsFilled } = await request.json();
    if (!sessionId) {
      return json({ error: 'sessionId is required' }, { status: 400 });
    }

    let result: any;
    try {
      result = await endSession(sessionId, { generateReport: !!generateReport });
    } catch (endErr: any) {
      console.error('endSession failed (session may have been lost to hot-reload):', endErr.message);
      // Still mark session as completed in DB even if in-memory session is gone
      const { error: logError } = await locals.supabase.from('session_logs')
        .update({ status: 'completed' })
        .eq('session_id', sessionId);
      if (logError) console.error('Failed to update session log:', logError.message);
      return json({ completed: true, cost: null, durationMs: null });
    }

    // Update session log with cost and completed status
    const updateData: Record<string, any> = {
      status: 'completed',
      duration_ms: result.durationMs,
      star_sections_filled: starSectionsFilled ?? null,
    };
    if (result.cost) {
      updateData.api_calls = result.cost.api_calls;
      updateData.input_tokens = result.cost.input_tokens;
      updateData.output_tokens = result.cost.output_tokens;
      updateData.total_tokens = result.cost.total_tokens;
      updateData.total_cost = result.cost.total_cost_numeric;
    }
    const { error: logError } = await locals.supabase.from('session_logs')
      .update(updateData)
      .eq('session_id', sessionId);

    if (logError) console.error('Failed to update session log:', logError.message);

    return json(result);
  } catch (err: any) {
    console.error('Error ending session:', err);
    return json({ error: 'Failed to end session' }, { status: 500 });
  }
};
