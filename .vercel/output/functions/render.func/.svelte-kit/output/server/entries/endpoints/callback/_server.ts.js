import { r as redirect } from "../../../chunks/index.js";
import { d as decodeJwt } from "../../../chunks/jwt.js";
const GET = async ({ locals, url, cookies }) => {
  const redirectURL = `${url.origin}/callback`;
  const expectedState = cookies.get("state");
  const codeVerifier = cookies.get("cv");
  const providerName = cookies.get("prov");
  const query = new URLSearchParams(url.search);
  const state = query.get("state");
  const code = query.get("code");
  const authMethods = await locals.pb?.collection("users").listAuthMethods();
  if (!authMethods?.authProviders) {
    console.log("authy providers");
    throw redirect(303, "/login");
  }
  const provider = authMethods.authProviders.find((p) => p.name == providerName);
  if (!provider) {
    console.log("Provider not found");
    throw redirect(303, "/login");
  }
  if (expectedState !== state) {
    console.log("state does not match expected", expectedState, state);
    throw redirect(303, "/login");
  }
  try {
    let { meta } = await locals.pb?.collection("users").authWithOAuth2Code(providerName || "", code || "", codeVerifier || "", redirectURL);
    const currentUserToken = decodeJwt(locals.pb?.authStore.token || "");
    if (currentUserToken) {
      let userData = {
        name: meta.name.split(" ")[0],
        avatarUrl: meta.avatarUrl
      };
      if (meta.isNew) {
        userData.credits = 3;
      }
      locals.pb?.collection("users").update(currentUserToken.id, userData);
    }
  } catch (err) {
    console.log("Error logging in with OAuth user", err);
  }
  throw redirect(303, "/interview");
};
export {
  GET
};
