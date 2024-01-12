import * as universal from '../entries/pages/interview/_layout.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/interview/+layout.ts";
export const imports = ["_app/immutable/nodes/2.51c6d7e4.js","_app/immutable/chunks/scheduler.16b0dea1.js","_app/immutable/chunks/index.d72b7527.js"];
export const stylesheets = [];
export const fonts = [];
