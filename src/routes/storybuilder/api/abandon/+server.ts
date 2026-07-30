import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isRefundEligible } from '$lib/refund-policy';

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
        const eligibleForRefund = isRefundEligible(durationMs || 0, starSectionsFilled || 0);

        // Only refund if this session actually carries a net charge in the ledger.
        // This skips subscribers (never charged) and prevents double-refunds.
        let refunded = false;
        let credits: number | null = null;
        if (eligibleForRefund) {
            const { data: txns } = await locals.supabase
                .from('credit_transactions')
                .select('delta')
                .eq('session_id', sessionId)
                .eq('user_id', userId);
            const net = (txns || []).reduce((sum, t) => sum + (t.delta || 0), 0);
            if (net < 0) {
                const { data: newBalance, error: refundError } = await locals.supabase.rpc('refund_credit', {
                    p_session_id: sessionId,
                    p_reason: 'auto_refund_abandon',
                });
                if (refundError) console.error('refund_credit RPC failed on abandon:', refundError.message);
                else {
                    refunded = true;
                    if (typeof newBalance === 'number' && newBalance >= 0) credits = newBalance;
                }
            }
        }

        const status = refunded ? 'refunded' : 'abandoned';

        // Update session log
        await locals.supabase
            .from('session_logs')
            .update({
                status,
                duration_ms: durationMs || null,
                star_sections_filled: starSectionsFilled ?? null,
            })
            .eq('session_id', sessionId);

        return json({ status, refunded, credits });
    } catch (err: any) {
        console.error('Abandon session error:', err);
        return json({ error: 'Failed to process abandoned session' }, { status: 500 });
    }
};
