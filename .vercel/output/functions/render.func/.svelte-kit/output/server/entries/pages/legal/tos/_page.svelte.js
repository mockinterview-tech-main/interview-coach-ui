import { c as create_ssr_component, e as escape } from "../../../../chunks/ssr.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".legal.svelte-1ipid2w{margin:20px}div.svelte-1ipid2w{padding:20px 0px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const VITE_COMPANY_NAME = "MockInterview.tech";
  const VITE_CONTACT_INFO = "mockinterview.app@gmail.com";
  $$result.css.add(css);
  return `<div class="legal svelte-1ipid2w"><h1 data-svelte-h="svelte-17ffd0v">Terms of Service:</h1> <div class="svelte-1ipid2w">${escape(VITE_COMPANY_NAME)} Terms of Service<br>
Last Updated: September 15, 2023</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-gjp9je"><b>Acceptance of Terms</b><br>
By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-pe72to"><b>Use of Our Services</b><br>
You may use our services for your personal and non-commercial use only. You may not use our services in a manner that violates any applicable laws or regulations.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-4gdhqv"><b>Intellectual Property</b><br>
Our services may contain intellectual property owned or licensed by us. You may not use our intellectual property without our express permission.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-15ec3hf"><b>User Content</b><br>
You are responsible for any content you submit to our services. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-1f04ynn"><b>Limitation of Liability</b><br>
We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of our services.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-17z7ysp"><b>Privacy</b><br>
Your use of our services is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-r0pxls"><b>Termination</b><br>
We reserve the right to terminate or suspend your access to our services at any time and for any reason.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-1f07fkw"><b>Changes to these Terms</b><br>
We may update these terms periodically. By continuing to use our services, you agree to be bound by the revised terms.</div> <div class="svelte-1ipid2w"><b data-svelte-h="svelte-e2vyd8">Contact Us</b><br>
If you have questions or concerns about our Terms of Service, please contact us at ${escape(VITE_CONTACT_INFO)}.</div> </div>`;
});
export {
  Page as default
};
