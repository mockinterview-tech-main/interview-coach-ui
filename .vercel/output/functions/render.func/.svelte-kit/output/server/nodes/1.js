

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.83b38fd6.js","_app/immutable/chunks/scheduler.63fa6192.js","_app/immutable/chunks/index.685025e0.js","_app/immutable/chunks/singletons.e72b8aa4.js","_app/immutable/chunks/index.e8cf925c.js"];
export const stylesheets = [];
export const fonts = [];
