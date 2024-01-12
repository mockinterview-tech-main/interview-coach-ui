import jwt from "jsonwebtoken";
import Stripe from "stripe";
import { r as redirect } from "../../../chunks/index.js";
import { V as VITE_NONCE_SIGNING_SECRET, a as VITE_STRIPE_ID_GOOD_PRODUCT, b as VITE_STRIPE_ID_BETTER_PRODUCT, c as VITE_STRIPE_ID_BEST_PRODUCT } from "../../../chunks/private.js";
import { d as decodeJwt } from "../../../chunks/jwt.js";
const stripe = new Stripe({ "VITE_ENV": "development", "VITE_POCKETBASE_URL": "http://localhost:5555", "VITE_RESUME_URL": "http://localhost:8080", "VITE_OPENAI_API_KEY": "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", "VITE_COMPANY_NAME": "MockInterview.tech", "VITE_CONTACT_INFO": "concierge@mockinterview.tech", "VITE_STRIPE_PUBLIC_KEY": "pk_test_cCwXXdbuzfrMhtOhU2JBmyhn", "VITE_STRIPE_SECRET_KEY": "sk_test_bvszjhM9LnizMfBrwsHZSJva", "VITE_STRIPE_ID_BEST_PRODUCT": "price_1Nu2CpL5tBw90QNmGrMxd1ge", "VITE_STRIPE_ID_BETTER_PRODUCT": "price_1Nu3FoL5tBw90QNmt8IVUUKX", "VITE_STRIPE_ID_GOOD_PRODUCT": "price_1Nu3EvL5tBw90QNmCEP13Wtc", "VITE_NONCE_SIGNING_SECRET": "ByTd38IQSzmgs3S9FoNfaY8F", "VITE_EXCHANGE_END_CODE": "^_^", "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true }["VITE_STRIPE_SECRET_KEY"], {
  apiVersion: "2023-08-16"
});
const offerings = [
  { sku: "good", price: 5, label: "1 Interview Question", credits: 1, stripeID: VITE_STRIPE_ID_GOOD_PRODUCT },
  { sku: "better", price: 20, label: "5 Interview Questions", credits: 5, stripeID: VITE_STRIPE_ID_BETTER_PRODUCT },
  { sku: "best", price: 30, label: "10 Interview Questions", credits: 10, stripeID: VITE_STRIPE_ID_BEST_PRODUCT }
];
const load = async () => {
  return { offerings };
};
const generateNonce = (length = 24) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};
const actions = {
  purchase: async ({ request, locals }) => {
    if (!locals.pb?.authStore.isValid) {
      throw redirect(301, "/");
    }
    const rawData = await request.formData();
    const chosenOffering = rawData.get("chosenOffering");
    if (chosenOffering) {
      const chosen = JSON.parse(chosenOffering.toString());
      const nonce = generateNonce();
      const nonceToken = jwt.sign({ ...chosen, nonce }, VITE_NONCE_SIGNING_SECRET);
      const currentUserToken = decodeJwt(locals.pb?.authStore.token || "");
      locals.pb?.collection("users").update(currentUserToken.id, { nonce: nonceToken });
      const isProd = process.env.NODE_ENV === "production" ? true : false;
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: chosen.stripeID,
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: isProd ? `https://mockinterview.tech/interview?nonce=${nonce}` : `http://localhost:5173/interview?nonce=${nonce}`,
        cancel_url: isProd ? `https://mockinterview.tech/interview` : `http://localhost:5173/interview`,
        automatic_tax: { enabled: true }
      });
      throw redirect(303, session.url || "http://localhost:5173/interview");
    }
  }
};
export {
  actions,
  load
};
