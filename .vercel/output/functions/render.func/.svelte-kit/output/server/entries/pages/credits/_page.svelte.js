import { c as create_ssr_component, f as each, e as escape, d as add_attribute, v as validate_component } from "../../../chunks/ssr.js";
import { B as Button } from "../../../chunks/Button.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "h2.svelte-1y6mkkv.svelte-1y6mkkv{padding:60px 40px}div.svelte-1y6mkkv.svelte-1y6mkkv{display:flex;align-items:center;justify-content:space-around}.section.svelte-1y6mkkv.svelte-1y6mkkv{padding:20px 0;text-align:center}.section.svelte-1y6mkkv.svelte-1y6mkkv:last-of-type{padding-bottom:60px}.steps.svelte-1y6mkkv.svelte-1y6mkkv{display:flex;flex-wrap:wrap;justify-content:space-around}.step.svelte-1y6mkkv.svelte-1y6mkkv{background-color:rgba(245, 245, 245, 0.9607843137);flex-direction:column;padding:20px;border-radius:8px;flex:1;margin:20px}.step.svelte-1y6mkkv ul.svelte-1y6mkkv{margin:auto;padding:0;list-style-type:none}.step.svelte-1y6mkkv ul li.svelte-1y6mkkv{margin:10px;text-align:center}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const offerings = data.offerings;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<h2 class="svelte-1y6mkkv" data-svelte-h="svelte-1iue0o6">Choose Your Package</h2> <section class="section svelte-1y6mkkv" data-svelte-h="svelte-111quxe"><div class="steps svelte-1y6mkkv"><div class="step svelte-1y6mkkv"><h3>Looking Around $5.00</h3> <ul class="svelte-1y6mkkv"><li class="svelte-1y6mkkv">Best as a refresher on interviewing</li></ul></div> <div class="step svelte-1y6mkkv"><h3>Passive Candidate $20.00</h3> <ul class="svelte-1y6mkkv"><li class="svelte-1y6mkkv">Equivalent to a 2 hour live person coaching session valued at $200.00</li></ul></div> <div class="step svelte-1y6mkkv"><h3>Active Candidate $30.00</h3> <ul class="svelte-1y6mkkv"><li class="svelte-1y6mkkv">Best for refining answers to tricky interview questions or preparing for multiple interviews</li></ul></div></div></section> <div class="svelte-1y6mkkv">${each(offerings, (offering) => {
    return `<form action="?/purchase" method="POST"><h3>${escape(offering.label)}</h3> <input type="hidden" name="chosenOffering"${add_attribute("value", JSON.stringify(offering), 0)}> ${validate_component(Button, "Button").$$render($$result, { type: "submit", id: "checkout-button" }, {}, {
      default: () => {
        return `${escape(offering.label)} $${escape(offering.price)}.00`;
      }
    })} </form>`;
  })} </div>`;
});
export {
  Page as default
};
