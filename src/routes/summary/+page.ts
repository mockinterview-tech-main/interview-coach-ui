export const prerender = false;
export const ssr = false;

import { getSummaries } from "$lib/serviceApi";

export const load = async () => {
    const summaries = await getSummaries();
    return { summaries }
}