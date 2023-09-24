import { redirect } from "@sveltejs/kit";
import { stripe } from '$lib/stripe';

export const actions = {
    five: async () => {
        // todo - determine selected product
        // todo - if user not authed -> kick them to home page (this shouldnt happen really but 🤷‍♂️)
        // todo - generate a slug & store it in pb with user and stripe-callback endpoint (success page).
            // todo - slug should be signed jwt including how many units purchased
            // todo - validate the slug. if it exists & is valid, bump the credits by however many they purchase
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: 'price_1NtjlXL5tBw90QNmvKbb0q6m',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173?slug=whatthefuckisthisanyway`,
            cancel_url: `http://localhost:5173`,
            automatic_tax: {enabled: true},
        });

        throw redirect(303, session.url || 'http://localhost:5173');
    },
}