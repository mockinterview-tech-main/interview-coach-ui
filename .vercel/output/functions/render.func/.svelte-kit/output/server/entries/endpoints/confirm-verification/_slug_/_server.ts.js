import { r as redirect } from "../../../../chunks/index.js";
import { d as decodeJwt } from "../../../../chunks/jwt.js";
const GET = async ({ locals, url, cookies }) => {
  const urlParts = url.toString().split("/");
  const token = urlParts[urlParts.length - 1];
  const verified = await locals.pb?.collection("users").confirmVerification(token);
  if (verified) {
    if (locals.pb?.authStore.isValid) {
      const currentUserToken = decodeJwt(locals.pb?.authStore.token || "");
      if (currentUserToken) {
        let currentUser = await locals.pb?.collection("users").getOne(currentUserToken.id);
        if (currentUser) {
          await locals.pb?.collection("users").update(currentUserToken.id, { credits: 3 });
          throw redirect(303, "/");
        }
      }
    }
  }
  throw redirect(303, "/login");
};
export {
  GET
};
