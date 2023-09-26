import { c as create_ssr_component, d as each, e as escape, b as add_attribute } from "../../../chunks/ssr.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "h2.svelte-l7j0v7.svelte-l7j0v7{padding:60px 40px}div.svelte-l7j0v7.svelte-l7j0v7{display:flex;align-items:center;justify-content:space-around}div.svelte-l7j0v7 h3.svelte-l7j0v7{text-align:center}div.svelte-l7j0v7 form button.svelte-l7j0v7{display:flex;align-items:center;padding:10px 20px;border:2px solid transparent;cursor:pointer;font-weight:bold;border-radius:4px;transition:background-color 0.3s, border-color 0.3s;background:none;outline:none;font-size:16px;border-color:#A40080;color:#333}div.svelte-l7j0v7 form button.svelte-l7j0v7:hover{background-color:#A40080;color:white}.section.svelte-l7j0v7.svelte-l7j0v7{padding:20px 0;text-align:center}.section.svelte-l7j0v7.svelte-l7j0v7:last-of-type{padding-bottom:60px}.steps.svelte-l7j0v7.svelte-l7j0v7{display:flex;flex-wrap:wrap;justify-content:space-around}.step.svelte-l7j0v7.svelte-l7j0v7{background-color:#f5f5f5;flex-direction:column;padding:20px;border-radius:8px;flex:1;margin:20px}.step.svelte-l7j0v7 h3.svelte-l7j0v7{text-align:center}.step.svelte-l7j0v7 ul.svelte-l7j0v7{margin:auto;padding:0;list-style-type:none}.step.svelte-l7j0v7 ul li.svelte-l7j0v7{margin:10px;text-align:center}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const offerings = data.offerings;
  offerings[0];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<h2 class="svelte-l7j0v7" data-svelte-h="svelte-1iue0o6">Choose Your Package</h2> <section class="section svelte-l7j0v7" data-svelte-h="svelte-111quxe"><div class="steps svelte-l7j0v7"><div class="step svelte-l7j0v7"><h3 class="svelte-l7j0v7">Looking Around $5.00</h3> <ul class="svelte-l7j0v7"><li class="svelte-l7j0v7">Best as a refresher on interviewing</li></ul></div> <div class="step svelte-l7j0v7"><h3 class="svelte-l7j0v7">Passive Candidate $20.00</h3> <ul class="svelte-l7j0v7"><li class="svelte-l7j0v7">Equivalent to a 2 hour live person coaching session valued at $200.00</li></ul></div> <div class="step svelte-l7j0v7"><h3 class="svelte-l7j0v7">Active Candidate $30.00</h3> <ul class="svelte-l7j0v7"><li class="svelte-l7j0v7">Best for refining answers to tricky interview questions or preparing for multiple interviews</li></ul></div></div></section> <div class="svelte-l7j0v7">${each(offerings, (offering) => {
    return `<form action="?/purchase" method="POST"><h3 class="svelte-l7j0v7">${escape(offering.label)}</h3> <input type="hidden" name="chosenOffering"${add_attribute("value", JSON.stringify(offering), 0)}> <button type="submit" id="checkout-button" class="svelte-l7j0v7">${escape(offering.label)} $${escape(offering.price)}.00</button> </form>`;
  })} </div>`;
});
export {
  Page as default
};
