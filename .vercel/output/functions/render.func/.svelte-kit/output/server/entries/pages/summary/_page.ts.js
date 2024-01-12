import { c as getSummaries } from "../../../chunks/serviceApi.js";
const prerender = false;
const ssr = false;
const load = async () => {
  const summaries = await getSummaries();
  return { summaries };
};
export {
  load,
  prerender,
  ssr
};
