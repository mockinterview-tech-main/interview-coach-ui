import { redirect } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';

const stripe = new Stripe(import.meta.env['VITE_STRIPE_SECRET_KEY'], {
    apiVersion: '2023-08-16',
});

export const GET: RequestHandler = async ({ locals, url }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(302, '/login');
    }

    const email = session.user.email;
    if (!email) {
        throw redirect(302, '/credits');
    }

    // Find the Stripe customer by email
    const customers = await stripe.customers.list({ limit: 1, email });
    if (customers.data.length === 0) {
        throw redirect(302, '/credits');
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customers.data[0].id,
        return_url: `${url.origin}/credits`,
    });

    throw redirect(303, portalSession.url);
};
