import Stripe from 'stripe';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

import {
    VITE_STRIPE_ID_ALA_CARTE,
    VITE_STRIPE_ID_SUBSCRIPTION,
} from '$env/static/private';

export type Choice = {
    type: 'subscription' | 'payment';
    sku: string;
    price: number;
    label: string;
    description: string;
    features: string[];
    stripeID: string;
    credits: number;
};

const stripe = new Stripe(import.meta.env['VITE_STRIPE_SECRET_KEY'], {
    apiVersion: '2023-08-16',
});

const offerings: Array<Choice> = [
    {
        type: 'payment',
        sku: 'alacarte',
        price: 3,
        label: 'Single Session',
        description: '20-min STAR story construction with the AI coach',
        features: [
            'Relaxing conversations for rambling out project details.',
            'Ending wth an interview-competitive narrative',
            'Polished details saved to your Story Bank, forever accessible',
        ],
        credits: 1,
        stripeID: VITE_STRIPE_ID_ALA_CARTE,
    },
    {
        type: 'subscription',
        sku: 'subscription',
        price: 30,
        label: 'Monthly Unlimited',
        description: 'Unlimited story building sessions. Billed monthly.',
        features: [
            'Same single-session benefits',
            'Unlimited sessions per month',
            'Cancel anytime',
        ],
        credits: 0,
        stripeID: VITE_STRIPE_ID_SUBSCRIPTION,
    },
];

export const load: PageServerLoad = async () => {
    return { offerings };
};

export const actions: Actions = {
    purchase: async ({ request, locals, url }) => {
        const session = await locals.getSession();
        if (!session) {
            throw redirect(301, '/login');
        }

        const rawData = await request.formData();
        const chosenOffering = rawData.get('chosenOffering');

        if (chosenOffering) {
            const chosen = JSON.parse(chosenOffering.toString()) as Choice;
            const baseUrl = url.origin;

            const checkoutSession = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price: chosen.stripeID,
                        quantity: 1,
                    },
                ],
                mode: chosen.type,
                success_url: `${baseUrl}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${baseUrl}/credits`,
                customer_email: session.user.email,
                metadata: {
                    credits: chosen.credits.toString(),
                    user_id: session.user.id,
                },
            });

            throw redirect(303, checkoutSession.url || '/credits');
        }
    },
};
