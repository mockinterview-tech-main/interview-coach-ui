import { c as create_ssr_component, e as escape, n as null_to_empty, d as each, b as add_attribute, v as validate_component } from "../../../chunks/ssr.js";
/* empty css                                                      */const css$1 = {
  code: "div.svelte-128tvz6{cursor:pointer}.selected.svelte-128tvz6{background-color:#FE4BDD}.summary-list-card.svelte-128tvz6{padding:20px;display:block;text-decoration:none;cursor:pointer;transition:background-color 0.3s ease}.summary-list-card.svelte-128tvz6:hover{background-color:#FE4BDD;cursor:pointer}",
  map: null
};
const ListItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  let { subtitle } = $$props;
  let { selected = false } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.subtitle === void 0 && $$bindings.subtitle && subtitle !== void 0)
    $$bindings.subtitle(subtitle);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  $$result.css.add(css$1);
  return `  <div class="${escape(
    null_to_empty(selected ? "selected summary-list-card" : "summary-list-card"),
    true
  ) + " svelte-128tvz6"}"><i><strong>${escape(title)}</strong></i><br> <i>${escape(subtitle)}</i> </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "div.svelte-sl1a7s.svelte-sl1a7s{padding:40px 20px;justify-items:center}div.svelte-sl1a7s a.svelte-sl1a7s:link{text-decoration:inherit;color:inherit;cursor:auto}div.svelte-sl1a7s a.svelte-sl1a7s:visited{text-decoration:inherit;color:inherit;cursor:auto}div.svelte-sl1a7s h1.svelte-sl1a7s{margin:40px 20px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const summaries = data.summaries;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<div class="svelte-sl1a7s"><h1 class="svelte-sl1a7s" data-svelte-h="svelte-1x55bf1">Past Sessions</h1> ${summaries ? `${each(summaries, (summary) => {
    return `<a data-sveltekit-preload-data="hover"${add_attribute("href", `/summary/${summary.id}`, 0)} class="svelte-sl1a7s">${validate_component(ListItem, "ListItem").$$render(
      $$result,
      {
        title: summary.question_text,
        subtitle: `${new Date(summary.created_at).toLocaleDateString()} ${new Date(summary.created_at).toLocaleTimeString()}`
      },
      {},
      {}
    )} </a>`;
  })}` : ``} </div>`;
});
export {
  Page as default
};
