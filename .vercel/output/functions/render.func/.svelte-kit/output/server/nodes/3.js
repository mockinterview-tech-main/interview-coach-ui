

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.5b891fff.js","_app/immutable/chunks/scheduler.16b0dea1.js","_app/immutable/chunks/index.d72b7527.js","_app/immutable/chunks/Header.9311700f.js","_app/immutable/chunks/Ripple.d5d52d31.js","_app/immutable/chunks/index.8426354e.js","_app/immutable/chunks/Button.0debd371.js"];
export const stylesheets = ["_app/immutable/assets/3.1614ff12.css"];
export const fonts = [];
