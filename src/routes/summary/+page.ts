export const prerender = true;
export const ssr = false;

import { getSummaries } from "$lib/serviceApi";

export const load = async () => {
    console.log("ASDF")
    const summaries = await getSummaries();
    return { summaries }
}
