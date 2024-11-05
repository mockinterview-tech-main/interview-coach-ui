import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

import { 
    VITE_NONCE_SIGNING_SECRET, 
    VITE_STRIPE_ID_ALA_CARTE,
    VITE_STRIPE_ID_SUBSCRIPTION,
    VITE_STRIPE_MANAGE_LINK
} from "$env/static/private";

import { decodeJwt } from '$lib/jwt';

export type Choice = {
    type: "subscription" | "payment";
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
    {type: "payment", sku: "alacarte", price: 2, label: "Single Interview", description: "Just trying out the product", credits: 1, stripeID: VITE_STRIPE_ID_ALA_CARTE},
    {type: "subscription", sku: "subscription", price: 20, label: "Monthly Subscription", description: "As many interviews as you like. Billed monthly. Cancel anytime.", credits: 0, stripeID: VITE_STRIPE_ID_SUBSCRIPTION},
]

export const load: PageServerLoad = async () =>  {
    return { offerings, manageLink: VITE_STRIPE_MANAGE_LINK } 
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
            redirect(301, '/');
        }
        const rawData = await request.formData();
        const chosenOffering = rawData.get('chosenOffering');
        if (chosenOffering) {
            const chosen = JSON.parse(chosenOffering.toString()) as Choice
            const nonce = generateNonce();
            const purchaseIntent = jwt.sign({...chosen, nonce}, VITE_NONCE_SIGNING_SECRET);

            const currentUserToken = decodeJwt(locals.pb?.authStore.token || '');
            locals.pb?.collection('users').update(currentUserToken.id, {purchaseIntent});

            const isProd = process.env.NODE_ENV === 'production' ? true : false;

            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price: chosen.stripeID,
                        quantity: 1,
                    },
                ],
                mode: chosen.type,
                success_url: isProd ? `https://mockinterview.tech/interview?nonce=${nonce}` : `http://localhost:5173/interview?nonce=${nonce}`,
                cancel_url: isProd ? `https://mockinterview.tech/interview` : `http://localhost:5173/interview`,
                automatic_tax: {enabled: true},
            });
            redirect(303, session.url || 'http://localhost:5173/interview');
        }
    },
}