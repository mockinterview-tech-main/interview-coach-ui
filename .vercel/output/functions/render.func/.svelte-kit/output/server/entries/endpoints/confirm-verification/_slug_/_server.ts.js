import { r as redirect } from "../../../../chunks/index.js";
const GET = async ({ locals, url, cookies }) => {
  const urlParts = url.toString().split("/");
  const token = urlParts[urlParts.length - 1];
  const verified = await locals.pb?.collection("users").confirmVerification(token);
  if (verified) {
    if (locals.pb?.authStore.isValid) {
      throw redirect(303, "/");
    }
  }
  throw redirect(303, "/login");
};
export {
  GET
};
