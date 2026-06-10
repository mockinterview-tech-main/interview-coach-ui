import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env['VITE_STRIPE_SECRET_KEY'], {
    apiVersion: '2023-08-16',
});

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

        // Read credits from Stripe metadata (not from URL)
        const creditsToAdd = parseInt(checkoutSession.metadata?.credits || '0', 10);

        // Verify: paid, has credits to add, and belongs to this user
        if (
            checkoutSession.payment_status === 'paid' &&
            creditsToAdd > 0 &&
            checkoutSession.metadata?.user_id === session.user.id
        ) {
            // Check if this session was already processed (prevent replay)
            const { data: profile } = await locals.supabase
                .from('profiles')
                .select('credits, last_stripe_session_id')
                .eq('id', session.user.id)
                .single();

            if (profile && profile.last_stripe_session_id !== sessionId) {
                await locals.supabase
                    .from('profiles')
                    .update({
                        credits: (profile.credits || 0) + creditsToAdd,
                        last_stripe_session_id: sessionId,
                    })
                    .eq('id', session.user.id);
            }
        }
        // For subscriptions (credits=0), no credits to add — subscription status
        // is checked in +layout.server.ts via Stripe API
    } catch (err) {
        console.error('Error confirming purchase:', err);
    }

    throw redirect(303, '/storybuilder');
};
