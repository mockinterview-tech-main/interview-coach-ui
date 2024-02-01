import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

import { 
    VITE_STRIPE_ID_BEST_PRODUCT, 
    VITE_STRIPE_ID_BETTER_PRODUCT, 
    VITE_STRIPE_ID_GOOD_PRODUCT, 
    VITE_NONCE_SIGNING_SECRET 
} from "$env/static/private";

import { decodeJwt } from '$lib/jwt';

export type Choice = {
    sku: string;
    price: number;
    label: string;
    description: string;
    stripeID: string;
    credits: number;
}

const stripe = new Stripe(import.meta.env['VITE_STRIPE_SECRET_KEY'], {
  apiVersion: '2023-08-16',
});

const offerings: Array<Choice> = [
    {sku: "good", price: 5, label: "3 Interview Questions", description: "Just trying out the product", credits: 3, stripeID: VITE_STRIPE_ID_GOOD_PRODUCT},
    {sku: "better", price: 10, label: "6 Interview Questions", description: "Equivalent to a $200 in-person coaching session", credits: 6, stripeID: VITE_STRIPE_ID_BETTER_PRODUCT},
    {sku: "best", price: 15, label: "12 Interview Questions", description: "Perfect for dialing in the perfect answer or preparing for the dream job", credits: 12, stripeID: VITE_STRIPE_ID_BEST_PRODUCT}
]

export const load: PageServerLoad = async () =>  {
    return { offerings } 
}

const generateNonce = (length = 24) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export const actions = {
    purchase: async ({request, locals}) => {
        if (!locals.pb?.authStore.isValid){
            throw redirect(301, '/');
        }
        const rawData = await request.formData();
        const chosenOffering = rawData.get('chosenOffering');

        if (chosenOffering) {
            const chosen = JSON.parse(chosenOffering.toString()) as Choice
            const nonce = generateNonce();
            const nonceToken = jwt.sign({...chosen, nonce}, VITE_NONCE_SIGNING_SECRET);

            const currentUserToken = decodeJwt(locals.pb?.authStore.token || '');
            locals.pb?.collection('users').update(currentUserToken.id, {nonce: nonceToken});

            const isProd = process.env.NODE_ENV === 'production' ? true : false;
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price: chosen.stripeID,
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: isProd ? `https://mockinterview.tech/interview?nonce=${nonce}` : `http://localhost:5173/interview?nonce=${nonce}`,
                cancel_url: isProd ? `https://mockinterview.tech/interview` : `http://localhost:5173/interview`,
                automatic_tax: {enabled: true},
            });
            throw redirect(303, session.url || 'http://localhost:5173/interview');
        }
    },
}