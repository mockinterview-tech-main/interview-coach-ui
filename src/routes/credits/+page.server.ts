import jwt from 'jsonwebtoken';

import { redirect } from "@sveltejs/kit";
import { stripe } from '$lib/stripe';
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
    stripeID: string;
    credits: number;
}

const offerings: Array<Choice> = [
    {sku: "good", price: 5, label: "1 Interview Question", credits: 1, stripeID: VITE_STRIPE_ID_GOOD_PRODUCT},
    {sku: "better", price: 20, label: "5 Interview Questions", credits: 5, stripeID: VITE_STRIPE_ID_BETTER_PRODUCT},
    {sku: "best", price: 30, label: "10 Interview Questions", credits: 10, stripeID: VITE_STRIPE_ID_BEST_PRODUCT}
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
                        // Provide the exact price ID (for example, pr_1234) of the product you want to sell
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
        
        // todo - validate the slug. if it exists & is valid, bump the credits by however many they purchase
    },
}