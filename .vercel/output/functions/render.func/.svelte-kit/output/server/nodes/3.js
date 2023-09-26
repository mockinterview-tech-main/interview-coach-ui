

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.6f7f3efc.js","_app/immutable/chunks/scheduler.63fa6192.js","_app/immutable/chunks/index.685025e0.js"];
export const stylesheets = ["_app/immutable/assets/3.f7fff0be.css"];
export const fonts = [];
