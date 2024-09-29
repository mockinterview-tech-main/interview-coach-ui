export const prerender = false;
export const ssr = true;

import { getSummaries } from "$lib/serviceApi";

export const load = async () => {
    const summaries = await getSummaries();
    return { summaries }
}
