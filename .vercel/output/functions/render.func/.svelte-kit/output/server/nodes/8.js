

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/legal/tos/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.2ec60d27.js","_app/immutable/chunks/scheduler.16b0dea1.js","_app/immutable/chunks/index.d72b7527.js"];
export const stylesheets = ["_app/immutable/assets/6.13de9004.css"];
export const fonts = [];
