import PocketBase from "pocketbase";
import { d as VITE_POCKETBASE_URL } from "./private.js";
const handle = async ({ event, resolve }) => {
  event.locals.pb = new PocketBase(VITE_POCKETBASE_URL);
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");
  try {
    if (event.locals.pb.authStore.isValid) {
      await event.locals.pb.collection("users").authRefresh();
    }
  } catch (err) {
    event.locals.pb.authStore.clear();
  }
  const response = await resolve(event);
  const isProd = process.env.NODE_ENV === "production" ? true : false;
  response.headers.set(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie({
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: isProd ? ".mockinterview.tech" : "localhost"
    })
  );
  return response;
};
export {
  handle
};
