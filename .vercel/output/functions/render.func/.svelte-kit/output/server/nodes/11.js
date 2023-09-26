import * as universal from '../entries/pages/summary/_slug_/_page.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/summary/_slug_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/summary/[slug]/+page.ts";
export const imports = ["_app/immutable/nodes/11.b8adf652.js","_app/immutable/chunks/serviceApi.105de162.js","_app/immutable/chunks/scheduler.63fa6192.js","_app/immutable/chunks/index.685025e0.js","_app/immutable/chunks/answerStore.2580ed77.js","_app/immutable/chunks/index.e8cf925c.js"];
export const stylesheets = ["_app/immutable/assets/11.160de75f.css"];
export const fonts = [];
