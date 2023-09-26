import { d as decodeJwt } from "../../../chunks/jwt.js";
import { j as json } from "../../../chunks/index.js";
const POST = async ({ locals }) => {
  const currentUserToken = decodeJwt(locals.pb?.authStore.token || "");
  if (currentUserToken) {
    let currentUser = await locals.pb?.collection("users").getOne(currentUserToken.id);
    if (currentUser) {
      locals.pb?.collection("users").update(currentUserToken.id, { nonce: "", credits: currentUser.credits - 1 });
    }
  }
  return json("");
};
export {
  POST
};
