import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.6548902e.js","_app/immutable/chunks/scheduler.16b0dea1.js","_app/immutable/chunks/index.d72b7527.js","_app/immutable/chunks/stores.d1c15704.js","_app/immutable/chunks/singletons.58fddef5.js","_app/immutable/chunks/index.8426354e.js","_app/immutable/chunks/serviceApi.ab420a33.js","_app/immutable/chunks/userStore.5c8895b4.js"];
export const stylesheets = ["_app/immutable/assets/0.d96a0cb4.css"];
export const fonts = ["_app/immutable/assets/inter-cyrillic-ext-400-normal.f7666a51.woff2","_app/immutable/assets/inter-cyrillic-ext-400-normal.f83f176b.woff","_app/immutable/assets/inter-cyrillic-400-normal.e9493683.woff2","_app/immutable/assets/inter-cyrillic-400-normal.3a27cac9.woff","_app/immutable/assets/inter-greek-ext-400-normal.d3e30cde.woff2","_app/immutable/assets/inter-greek-ext-400-normal.37983db3.woff","_app/immutable/assets/inter-greek-400-normal.2f2d421a.woff2","_app/immutable/assets/inter-greek-400-normal.f8bb5355.woff","_app/immutable/assets/inter-vietnamese-400-normal.5779ad5e.woff","_app/immutable/assets/inter-latin-ext-400-normal.64a98f58.woff2","_app/immutable/assets/inter-latin-ext-400-normal.495669c6.woff","_app/immutable/assets/inter-latin-400-normal.0364d368.woff2","_app/immutable/assets/inter-latin-400-normal.e3982e96.woff"];
