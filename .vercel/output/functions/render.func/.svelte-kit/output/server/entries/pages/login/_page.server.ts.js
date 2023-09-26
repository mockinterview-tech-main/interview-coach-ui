import { r as redirect, f as fail } from "../../../chunks/index.js";
const load = async ({ locals, url, cookies }) => {
  const authToken = cookies.get("pb_auth");
  if (authToken) {
    throw redirect(302, "/");
  }
  try {
    const authMethods = await locals.pb?.collection("users").listAuthMethods();
    if (!authMethods) {
      return {};
    }
    const redirectURL = `${url.origin}/callback`;
    let output = {};
    authMethods.authProviders.forEach((provider) => {
      output[provider.name] = {
        authProviderRedirect: `${provider.authUrl}${redirectURL}`,
        authProviderState: provider.state,
        authCodeVerifier: provider.codeVerifier
      };
    });
    return output;
  } catch (e) {
    console.error("[ERROR] Unable to connect to authentication service");
    return {};
  }
};
const actions = {
  signup: async ({ locals, request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email")?.toString() || "";
    const password = data.get("password")?.toString() || "";
    const passwordConfirm = data.get("passwordConfirm")?.toString() || "";
    await locals.pb?.collection("users").create({ email, password, passwordConfirm });
    locals.pb?.collection("users").requestVerification(email);
    return loginWithEmailPassword(locals, cookies, email, password);
  },
  login: async ({ locals, request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email")?.toString() || "";
    const password = data.get("password")?.toString() || "";
    return loginWithEmailPassword(locals, cookies, email, password);
  }
};
const loginWithEmailPassword = async (locals, cookies, email, password) => {
  try {
    await locals.pb?.collection("users").authWithPassword(email, password);
    const isProd = process.env.NODE_ENV === "production" ? true : false;
    if (locals.pb?.authStore.isValid) {
      cookies.set(
        "pb_auth",
        locals.pb?.authStore.exportToCookie({ secure: isProd, sameSite: "lax", httpOnly: true })
      );
      return { success: true };
    }
  } catch (e) {
    if (e.status >= 400 && e.status <= 500) {
      return fail(e.status, { email, authFail: true });
    }
    if (e.status >= 500) {
      return fail(e.status, { email, authDown: true });
    }
  }
};
export {
  actions,
  load
};
