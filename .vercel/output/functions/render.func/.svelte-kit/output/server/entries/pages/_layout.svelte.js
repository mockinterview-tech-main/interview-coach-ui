import { c as create_ssr_component } from "../../chunks/ssr.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-f4sf2e.svelte-f4sf2e.svelte-f4sf2e{font-family:Arial, Helvetica, sans-serif;font-size:medium}main.svelte-f4sf2e nav.svelte-f4sf2e.svelte-f4sf2e{padding:0px 20px}nav.svelte-f4sf2e.svelte-f4sf2e.svelte-f4sf2e{position:fixed;left:0;top:0;width:100%;z-index:1000;padding:20px;background-color:#333;line-height:50px}nav.svelte-f4sf2e span.svelte-f4sf2e.svelte-f4sf2e{padding:20px}nav.svelte-f4sf2e span.svelte-f4sf2e a.svelte-f4sf2e{color:#fff;text-decoration:none;transition:color 0.3s ease}nav.svelte-f4sf2e span.svelte-f4sf2e a.svelte-f4sf2e:hover{color:#FDF56C}footer.svelte-f4sf2e.svelte-f4sf2e.svelte-f4sf2e{position:fixed;left:0;bottom:0;width:100%;background-color:#333;color:#fff;padding:10px}footer.svelte-f4sf2e span.svelte-f4sf2e.svelte-f4sf2e{padding:20px}footer.svelte-f4sf2e a.svelte-f4sf2e.svelte-f4sf2e{color:#fff;text-decoration:none;transition:color 0.3s ease}footer.svelte-f4sf2e a.svelte-f4sf2e.svelte-f4sf2e:hover{color:#FDF56C}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const loggedIn = data.loggedIn;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<main class="svelte-f4sf2e"><nav class="svelte-f4sf2e"><span class="svelte-f4sf2e" data-svelte-h="svelte-9vm1f"><a href="/" class="svelte-f4sf2e">Home</a></span> ${loggedIn ? `<span class="svelte-f4sf2e" data-svelte-h="svelte-1f41j2k"><a href="/interview" class="svelte-f4sf2e">New Interview</a></span> <span class="svelte-f4sf2e" data-svelte-h="svelte-72vce9"><a data-sveltekit-preload-data="hover" href="/summary" class="svelte-f4sf2e">Past Sessions</a></span>` : `<span class="svelte-f4sf2e" data-svelte-h="svelte-1k5vuhi"><a href="/login" class="svelte-f4sf2e">Get Started</a></span>`}</nav> ${slots.default ? slots.default({}) : ``} <footer class="svelte-f4sf2e" data-svelte-h="svelte-1el2zi4"><span class="svelte-f4sf2e">© 2023 EmpowerPro Labs</span> <span class="svelte-f4sf2e"><a href="/legal/tos" class="svelte-f4sf2e">Terms of Service</a></span> <span class="svelte-f4sf2e"><a href="/legal/privacy" class="svelte-f4sf2e">Privacy Policy</a></span> <span class="svelte-f4sf2e"><a href="/legal/cookie" class="svelte-f4sf2e">Cookie Policy</a></span></footer> </main>`;
});
export {
  Layout as default
};
