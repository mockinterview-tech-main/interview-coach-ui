

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/legal/privacy/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.3fd50c6e.js","_app/immutable/chunks/scheduler.63fa6192.js","_app/immutable/chunks/index.685025e0.js"];
export const stylesheets = ["_app/immutable/assets/6.13de9004.css"];
export const fonts = [];
