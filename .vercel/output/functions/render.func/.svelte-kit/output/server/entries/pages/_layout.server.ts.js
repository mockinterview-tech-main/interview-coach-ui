import { r as redirect } from "../../chunks/index.js";
import { d as decodeJwt, v as validateJwt } from "../../chunks/jwt.js";
import { V as VITE_NONCE_SIGNING_SECRET } from "../../chunks/private.js";
const load = async ({ locals, url }) => {
  const protectedRoutes = ["interview", "summary"];
  if (!locals.pb?.authStore.isValid && protectedRoutes.includes(url.pathname.split("/").filter(Boolean)[0])) {
    throw redirect(302, "/login");
  }
  const currentUserToken = decodeJwt(locals.pb?.authStore.token || "");
  if (currentUserToken) {
    let currentUser = await locals.pb?.collection("users").getOne(currentUserToken.id);
    if (currentUser) {
      if (currentUser.nonce) {
        const nonce = url.searchParams.get("nonce");
        if (validateJwt(currentUser.nonce, VITE_NONCE_SIGNING_SECRET)) {
          const userToken = decodeJwt(currentUser.nonce);
          if (userToken.nonce === nonce) {
            await locals.pb?.collection("users").update(currentUserToken.id, { nonce: "", credits: currentUser.credits + userToken.credits });
            currentUser = await locals.pb?.collection("users").getOne(currentUserToken.id);
          }
        }
      }
      return {
        loggedIn: locals.pb?.authStore.isValid,
        credits: currentUser?.credits
      };
    }
  }
  return {
    loggedIn: false
  };
};
export {
  load
};
