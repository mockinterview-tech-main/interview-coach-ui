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
  return `<div class="legal svelte-1ipid2w"><h1 data-svelte-h="svelte-byhntu">Privacy Policy:</h1> <div class="svelte-1ipid2w">${escape(VITE_COMPANY_NAME)} Privacy Policy<br>
Last Updated: September 15, 2023</div> <div class="svelte-1ipid2w"><b data-svelte-h="svelte-prka8s">Introduction</b><br>

Welcome to ${escape(VITE_COMPANY_NAME)} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal information. 
This Privacy Policy will inform you about how we collect, use, and safeguard your personal data. 
By using our services, you consent to the practices described in this policy.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-u9szi7"><b>Information We Collect</b><br> <i>Personal Information:</i> We may collect your name, email address, phone number, and other personal details when you sign up for our services or interact with our website.<br> <i>Usage Information:</i> We may collect information about your interactions with our services, such as the pages you visit, your IP address, browser type, and operating system.<br> <i>Cookies and Tracking:</i> We use cookies and similar tracking technologies to improve your experience and collect information about your online activities.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-179sb4h"><b>How We Use Your Information</b><br>

We may use your information for various purposes, including providing and improving our services, communicating with you, and ensuring the security of our platform.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-m86kmw"><b>Sharing Your Information</b><br>

We may share your information with trusted third parties, including service providers and partners, to fulfill our business purposes.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-fxzkp0"><b>Your Choices</b><br>

You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-138hjh5"><b>Security</b><br>

We take reasonable measures to protect your information, but no data transmission over the internet is completely secure. Please take steps to protect your own data as well.</div> <div class="svelte-1ipid2w" data-svelte-h="svelte-14qovkl"><b>Changes to this Privacy Policy</b><br>

We may update this policy periodically to reflect changes in our practices. Please review the policy regularly.</div> <div class="svelte-1ipid2w"><b data-svelte-h="svelte-e2vyd8">Contact Us</b><br>

If you have questions or concerns about our Privacy Policy, please contact us at ${escape(VITE_CONTACT_INFO)}.</div> </div>`;
});
export {
  Page as default
};
