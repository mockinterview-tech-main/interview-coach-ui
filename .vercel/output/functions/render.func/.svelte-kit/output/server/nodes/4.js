import * as server from '../entries/pages/credits/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/credits/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/credits/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.24723c09.js","_app/immutable/chunks/scheduler.16b0dea1.js","_app/immutable/chunks/index.d72b7527.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/Button.0debd371.js","_app/immutable/chunks/Ripple.d5d52d31.js"];
export const stylesheets = ["_app/immutable/assets/4.00332845.css"];
export const fonts = [];
