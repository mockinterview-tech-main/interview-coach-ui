

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.11c16e93.js","_app/immutable/chunks/scheduler.16b0dea1.js","_app/immutable/chunks/index.d72b7527.js","_app/immutable/chunks/stores.d1c15704.js","_app/immutable/chunks/singletons.58fddef5.js","_app/immutable/chunks/index.8426354e.js"];
export const stylesheets = [];
export const fonts = [];
