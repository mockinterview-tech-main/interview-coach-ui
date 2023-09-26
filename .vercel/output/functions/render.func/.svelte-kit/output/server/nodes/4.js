import * as server from '../entries/pages/credits/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/credits/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/credits/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.274ef684.js","_app/immutable/chunks/scheduler.63fa6192.js","_app/immutable/chunks/index.685025e0.js","_app/immutable/chunks/each.e59479a4.js"];
export const stylesheets = ["_app/immutable/assets/4.bf207e4a.css"];
export const fonts = [];
