import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const AUTO_REFUND_MAX_DURATION_MS = 3 * 60 * 1000; // 3 minutes
const AUTO_REFUND_MAX_STAR_SECTIONS = 1; // fewer than 2 sections filled

export const POST: RequestHandler = async ({ locals, request }) => {
    const session = await locals.getSession();
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { sessionId, durationMs, starSectionsFilled } = await request.json();
        if (!sessionId) {
            return json({ error: 'sessionId is required' }, { status: 400 });
        }

        const userId = session.user.id;

        // Check if session was already completed (avoid double-processing)
        const { data: existingLog } = await locals.supabase
            .from('session_logs')
            .select('status')
            .eq('session_id', sessionId)
            .single();

        if (existingLog?.status === 'completed') {
            return json({ status: 'already_completed' });
        }

        // Determine if auto-refund applies
        const shouldRefund = (durationMs || 0) < AUTO_REFUND_MAX_DURATION_MS
            && (starSectionsFilled || 0) <= AUTO_REFUND_MAX_STAR_SECTIONS;

        const status = shouldRefund ? 'refunded' : 'abandoned';

        // Update session log
        await locals.supabase
            .from('session_logs')
            .update({
                status,
                duration_ms: durationMs || null,
                star_sections_filled: starSectionsFilled ?? null,
            })
            .eq('session_id', sessionId);

        // Auto-refund credit if applicable
        if (shouldRefund) {
            const { data: profile } = await locals.supabase
                .from('profiles')
                .select('credits')
                .eq('id', userId)
                .single();

            if (profile) {
                await locals.supabase
                    .from('profiles')
                    .update({ credits: profile.credits + 1 })
                    .eq('id', userId);

            }
        }

        return json({ status, refunded: shouldRefund });
    } catch (err: any) {
        console.error('Abandon session error:', err);
        return json({ error: 'Failed to process abandoned session' }, { status: 500 });
    }
};
