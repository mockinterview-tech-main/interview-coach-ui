import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe, saveCustomerId } from '$lib/server/billing';

export const GET: RequestHandler = async ({ url, locals }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, '/login');
    }

    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
        throw redirect(303, '/storybuilder');
    }

    try {
        // Verify the Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

        // Remember the Stripe customer so future checkouts and subscription lookups
        // reuse it instead of creating duplicates. Costs no extra API call.
        if (
            checkoutSession.customer &&
            checkoutSession.metadata?.user_id === session.user.id
        ) {
            const customerId = typeof checkoutSession.customer === 'string'
                ? checkoutSession.customer
                : checkoutSession.customer.id;
            await saveCustomerId(locals.supabase, session.user.id, customerId);
        }

        // Read credits from Stripe metadata (not from URL)
        const creditsToAdd = parseInt(checkoutSession.metadata?.credits || '0', 10);

        // Verify: paid, has credits to add, and belongs to this user
        if (
            checkoutSession.payment_status === 'paid' &&
            creditsToAdd > 0 &&
            checkoutSession.metadata?.user_id === session.user.id
        ) {
            // Atomic + idempotent grant: adds credits, records the stripe session id
            // (replay guard), and writes a 'purchase' ledger row — all in one call.
            const { error: grantError } = await locals.supabase.rpc('grant_purchase_credits', {
                p_amount: creditsToAdd,
                p_stripe_session_id: sessionId,
            });
            if (grantError) console.error('grant_purchase_credits failed:', grantError.message);
        }
        // For subscriptions (credits=0), no credits to add — subscription status
        // is checked in +layout.server.ts via Stripe API
    } catch (err) {
        console.error('Error confirming purchase:', err);
    }

    throw redirect(303, '/storybuilder');
};
