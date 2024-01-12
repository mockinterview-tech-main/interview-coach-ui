import { c as create_ssr_component, e as escape } from "../../../../chunks/ssr.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".legal.svelte-1ipid2w{margin:20px}div.svelte-1ipid2w{padding:20px 0px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const VITE_COMPANY_NAME = "MockInterview.tech";
  const VITE_CONTACT_INFO = "concierge@mockinterview.tech";
  $$result.css.add(css);
  return `<div class="legal svelte-1ipid2w"><h1 data-svelte-h="svelte-11mq95a">Cookie Policy:</h1> <div class="svelte-1ipid2w">${escape(VITE_COMPANY_NAME)} Cookie Policy<br>
    Last Updated: September 15, 2023</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-1nqu4yz"><b>What Are Cookies</b><br>

    Cookies are small text files that are stored on your device when you visit our website. They help us improve your online experience.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-1jk11yq"><b>Types of Cookies</b><br> <i>Essential Cookies:</i> These cookies are necessary for the functioning of our website.<br> <i>Analytics Cookies:</i> We use these cookies to collect data about your usage of our website.<br> <i>Advertising Cookies:</i> These cookies track your online activities to provide you with personalized ads.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-uyg3jm"><b>How to Control Cookies</b><br>
    You can manage or disable cookies through your browser settings. Please note that disabling cookies may affect your experience on our website.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-aet1v6"><b>Third-Party Cookies</b><br>
    We may allow third-party cookies on our website for advertising and analytics purposes. These cookies are subject to the privacy policies of the respective third parties.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-1mn1is5"><b>Changes to this Cookie Policy</b><br>
    We may update this policy periodically. Please review the policy regularly.</div> <div class="svelte-1ipid2w"><b data-svelte-h="svelte-e2vyd8">Contact Us</b><br>
    If you have questions or concerns about our Cookie Policy, please contact us at ${escape(VITE_CONTACT_INFO)}.</div> </div>`;
});
export {
  Page as default
};
