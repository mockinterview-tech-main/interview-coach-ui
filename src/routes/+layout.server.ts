import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env['VITE_STRIPE_SECRET_KEY'], {
  apiVersion: '2023-08-16',
});

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const protectedRoutes = ['storybuilder', 'credits', 'stories', 'dashboard'];
    const firstSegment = url.pathname.split('/').filter(Boolean)[0];

    const session = await locals.getSession();

    if (!session && protectedRoutes.includes(firstSegment)) {
        redirect(302, '/login');
    }

    if (session) {
        const user = session.user;
        const email = user.email || '';
        const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];

        // Check Stripe subscription status
        let subscriptionID: string | null = null;
        let subscriptionCancelAt: Date | null = null;
        let subscriptionRenewAt: string | null = null;
        let credits = 0;

        try {
            // Look up user profile in Supabase for credits
            const { data: profile } = await locals.supabase
                .from('profiles')
                .select('credits')
                .eq('id', user.id)
                .single();

            if (profile) {
                credits = profile.credits || 0;
            }

            // Check Stripe for subscription
            const stripeCustomerResult = await stripe.customers.list({
                limit: 1,
                email: email,
            });

            if (stripeCustomerResult.data.length > 0) {
                const stripeCustomerID = stripeCustomerResult.data[0].id;
                const subscriptionResult = await stripe.subscriptions.list({
                    customer: stripeCustomerID,
                });
                if (subscriptionResult.data.length > 0) {
                    const sub = subscriptionResult.data[0];
                    if (sub.status === 'active') {
                        subscriptionID = sub.id;
                        subscriptionRenewAt = new Date(sub.current_period_end * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    }
                    if (sub.cancel_at) {
                        subscriptionCancelAt = new Date(sub.cancel_at * 1000);
                    }
                }
            }
        } catch (err) {
            console.error('Error loading user data:', err);
        }

        return {
            loggedIn: true,
            username: name,
            credits,
            subscriptionID,
            subscriptionCancelAt,
            subscriptionRenewAt,
        };
    }

    return {
        loggedIn: false,
        subscriptionID: null,
        username: '',
        credits: 0,
    };
};
