import { c as create_ssr_component, e as escape, v as validate_component, f as each, n as null_to_empty, d as add_attribute } from "../../../chunks/ssr.js";
import { B as Button } from "../../../chunks/Button.js";
const googleGLogo = "/_app/immutable/assets/googleLogo.ed9087d7.svg";
const githubLogo = "/_app/immutable/assets/githubLogo.7a0dd11e.svg";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".error.svelte-2g0pjb.svelte-2g0pjb{padding:40px;position:absolute;top:40px;color:red}.form-container.svelte-2g0pjb.svelte-2g0pjb{box-shadow:5px 5px #EDECF2;border:1px solid #EDECF2;width:50%;height:100%;margin:auto;position:relative;top:100px;text-align:center}.form-container.svelte-2g0pjb .action-selector.svelte-2g0pjb{display:flex;flex-flow:row nowrap;margin:none;cursor:pointer;border-bottom:1px solid #A40080}.form-container.svelte-2g0pjb .action-selector p.svelte-2g0pjb{margin:0;flex:1;text-align:center;line-height:50px;color:#A40080}.form-container.svelte-2g0pjb .action-selector p.svelte-2g0pjb:hover{background-color:#A40080;color:white;transition:background-color 0.2s ease-in-out;transition:color 0.2s ease-in-out}.form-container.svelte-2g0pjb .action-selector .active-action-tab.svelte-2g0pjb{background-color:#A40080;color:white}.form-container.svelte-2g0pjb .action-form.svelte-2g0pjb{padding:20px}.form-container.svelte-2g0pjb .social-container.svelte-2g0pjb{display:flex;flex-flow:row wrap;align-items:center;justify-content:space-evenly}.form-container.svelte-2g0pjb .social-container img.svelte-2g0pjb{cursor:pointer;width:50px;height:50px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { form } = $$props;
  let providers = data;
  const logos = {
    "google": googleGLogo,
    "github": githubLogo
  };
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  $$result.css.add(css);
  return `<p class="error svelte-2g0pjb">${form?.error ? `${escape(form.message)}` : ``}</p> <div class="form-container svelte-2g0pjb"><div class="action-selector svelte-2g0pjb">  <p class="${escape(null_to_empty("active-action-tab"), true) + " svelte-2g0pjb"}">Sign Up</p>   <p class="${escape(null_to_empty(""), true) + " svelte-2g0pjb"}">Log In</p></div> <div class="action-form svelte-2g0pjb">${`<form method="POST" action="?/signup"><label for="email" data-svelte-h="svelte-omfvba">email address</label><br> <input name="email" type="email" placeholder="email@address.com" required><br> <label for="password" data-svelte-h="svelte-ew6a2y">password</label><br> <input name="password" type="password" placeholder="secret password" minlength="8" required><br> <label for="passwordConfirm" data-svelte-h="svelte-1ug2g98">confirm password</label><br> <input name="passwordConfirm" type="password" placeholder="secret password" minlength="8" required><br> ${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, {
    default: () => {
      return `Sign Up`;
    }
  })}</form>`}</div> <h3 data-svelte-h="svelte-9w7jde">Connect With</h3> <div class="social-container svelte-2g0pjb">${each(Object.keys(providers), (provider) => {
    return `${providers[provider].authProviderState ? `  <div><img${add_attribute("src", logos[provider], 0)} alt="${escape(provider, true) + " logo"}" class="svelte-2g0pjb"> <p class="svelte-2g0pjb">${escape(provider)}</p> </div>` : ``}`;
  })}</div> </div>`;
});
export {
  Page as default
};
