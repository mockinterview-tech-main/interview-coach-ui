import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe, resolveCustomerId } from '$lib/server/billing';

export const GET: RequestHandler = async ({ locals, url }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(302, '/login');
    }

    // Use the stored customer id when available. The old email lookup took the
    // first match, which could be a duplicate customer WITHOUT the subscription —
    // leaving a paying subscriber unable to reach their cancel page.
    const customerId = await resolveCustomerId(
        locals.supabase,
        session.user.id,
        session.user.email || ''
    );
    if (!customerId) {
        throw redirect(302, '/credits');
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${url.origin}/credits`,
    });

    throw redirect(303, portalSession.url);
};
