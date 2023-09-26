import * as universal from '../entries/pages/summary/_page.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/summary/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/summary/+page.ts";
export const imports = ["_app/immutable/nodes/10.9c1581d1.js","_app/immutable/chunks/serviceApi.105de162.js","_app/immutable/chunks/scheduler.63fa6192.js","_app/immutable/chunks/index.685025e0.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/listItem.4b741a2a.js"];
export const stylesheets = ["_app/immutable/assets/10.9b51b33e.css","_app/immutable/assets/listItem.d94be4b0.css"];
export const fonts = [];
