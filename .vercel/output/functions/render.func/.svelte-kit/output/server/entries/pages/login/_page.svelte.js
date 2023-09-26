import { c as create_ssr_component, d as each, b as add_attribute, e as escape } from "../../../chunks/ssr.js";
const googleGLogo = "/_app/immutable/assets/googleLogo.ed9087d7.svg";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "div.svelte-1vk3wzo.svelte-1vk3wzo{padding:60px 20px;display:flex}div.svelte-1vk3wzo .form.svelte-1vk3wzo{flex-direction:column;flex:1}div.svelte-1vk3wzo .form label.svelte-1vk3wzo{margin-bottom:5px}div.svelte-1vk3wzo .form input.svelte-1vk3wzo{width:50%;line-height:20px;margin-bottom:20px;border:1px solid #A40080;padding:10px;border-radius:4px}div.svelte-1vk3wzo .form input.svelte-1vk3wzo:focus{border:1px solid #A40080}div.svelte-1vk3wzo .form button.svelte-1vk3wzo{display:flex;align-items:center;padding:10px 20px;border:2px solid transparent;cursor:pointer;font-weight:bold;border-radius:4px;transition:background-color 0.3s, border-color 0.3s;background:none;outline:none;font-size:16px;border-color:#A40080;color:#333}div.svelte-1vk3wzo .form button img.svelte-1vk3wzo{width:24px;height:24px;margin-right:10px}div.svelte-1vk3wzo .form button.svelte-1vk3wzo:hover{background-color:#A40080;color:white}div.svelte-1vk3wzo .form .social-button.svelte-1vk3wzo{margin:0px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let providers = data;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<div class="svelte-1vk3wzo"><div class="form svelte-1vk3wzo" data-svelte-h="svelte-1caoizb"><h2>Sign Up</h2> <form method="POST" action="?/signup"><label for="email" class="svelte-1vk3wzo">email address</label><br><input name="email" type="email" placeholder="email@address.com" required class="svelte-1vk3wzo"><br> <label for="password" class="svelte-1vk3wzo">password</label><br><input name="password" type="password" placeholder="secret password" required class="svelte-1vk3wzo"><br> <label for="passwordConfirm" class="svelte-1vk3wzo">confirm password</label><br><input name="passwordConfirm" type="password" placeholder="secret password" required class="svelte-1vk3wzo"><br> <button type="submit" class="svelte-1vk3wzo">Sign Up</button></form></div> <div class="form svelte-1vk3wzo" data-svelte-h="svelte-sqwfq6"><h2>Log In</h2> <form method="POST" action="?/login"><label for="email" class="svelte-1vk3wzo">email address</label><br><input name="email" type="email" placeholder="email@address.com" required class="svelte-1vk3wzo"><br> <label for="password" class="svelte-1vk3wzo">password</label><br><input name="password" type="password" placeholder="secret passphrase" required class="svelte-1vk3wzo"><br> <button type="submit" class="svelte-1vk3wzo">Login</button></form></div> <div class="form svelte-1vk3wzo"><h2 data-svelte-h="svelte-b05s4o">Social Login</h2> ${each(Object.keys(providers), (provider) => {
    return `${providers[provider].authProviderState ? `<button class="social-button svelte-1vk3wzo"><img width="20px" height="20px"${add_attribute("src", googleGLogo, 0)} alt="Google Logo" class="svelte-1vk3wzo">Login with ${escape(provider)}</button>` : ``}`;
  })}</div> </div>`;
});
export {
  Page as default
};
