import * as universal from '../entries/pages/summary/_page.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/summary/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/summary/+page.ts";
export const imports = ["_app/immutable/nodes/10.5c0383c5.js","_app/immutable/chunks/serviceApi.ab420a33.js","_app/immutable/chunks/scheduler.16b0dea1.js","_app/immutable/chunks/index.d72b7527.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/horizontalLoader.6e3c0fc5.js"];
export const stylesheets = ["_app/immutable/assets/10.bd23be93.css","_app/immutable/assets/horizontalLoader.2f34ffe4.css"];
export const fonts = [];
