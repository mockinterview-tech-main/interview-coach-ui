import { c as create_ssr_component, e as escape, d as add_attribute, f as each, v as validate_component } from "../../../chunks/ssr.js";
/* empty css                                                              */import { g as getSummary } from "../../../chunks/serviceApi.js";
const Loading = "/_app/immutable/assets/loading.a8e2709a.svg";
const css$2 = {
  code: ".loading-left.svelte-aoculw{display:block}.loading-center.svelte-aoculw{margin:auto;display:block;text-align:center}",
  map: null
};
const HorizontalLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size } = $$props;
  let { position } = $$props;
  let imgWidth = 30;
  let pos = "center";
  switch (position) {
    case "l":
      pos = "left";
      break;
    case "c":
      pos = "center";
      break;
    case "r":
      pos = "right";
      break;
    default:
      pos = "center";
      break;
  }
  switch (size) {
    case "xs":
      imgWidth = 10;
      break;
    case "s":
      imgWidth = 20;
      break;
    case "m":
      imgWidth = 30;
      break;
    case "l":
      imgWidth = 40;
      break;
    case "xl":
      imgWidth = 50;
      break;
    default:
      imgWidth = 30;
      break;
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  $$result.css.add(css$2);
  return `  <img class="${"loading-" + escape(pos, true) + " svelte-aoculw"}" style="${"width: " + escape(imgWidth, true) + "%"}" alt="loading"${add_attribute("src", Loading, 0)}> <p class="${"loading-" + escape(pos, true) + " svelte-aoculw"}">${slots.default ? slots.default({}) : ``}</p>`;
});
const listItem_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "div.svelte-1o3v4id{cursor:pointer}.selected.svelte-1o3v4id{background-color:#A40080;color:#ffffff}.list-card.svelte-1o3v4id{padding:10px 20px;display:block;cursor:pointer;border-radius:4px;transition:background-color 0.3s ease-in-out}.list-card.svelte-1o3v4id:hover{background-color:#A40080;color:#ffffff;cursor:pointer}",
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
  return `  <div class="${"list-card " + escape(selected ? "selected" : "", true) + " svelte-1o3v4id"}"><i><strong>${escape(title)}</strong></i><br><br> <i>${escape(subtitle)}</i> </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "div.svelte-1n6b3jf.svelte-1n6b3jf{padding:40px 20px}div.svelte-1n6b3jf h1.svelte-1n6b3jf{margin:40px 20px}a.svelte-1n6b3jf.svelte-1n6b3jf{color:inherit;display:block;padding:5px 20px}a.svelte-1n6b3jf p.svelte-1n6b3jf{padding:5px 20px}.no-sessions.svelte-1n6b3jf.svelte-1n6b3jf{margin-left:20px}.no-sessions.svelte-1n6b3jf a.svelte-1n6b3jf{display:inline;padding:0;font-weight:700;text-decoration:underline}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let summaries;
  let unfinishedSummaryIds = [];
  const finishUnfinishedSummaries = async (unfinishedSummaryIds2) => {
    const finishedSummaries = await Promise.all(unfinishedSummaryIds2.map(async (s) => {
      if (s) {
        let x = await getSummary(s);
        if (x?.summary_text) {
          let parts = JSON.parse(x?.summary_text);
          return { ...x, ...parts };
        }
        return x;
      }
    }));
    summaries = [
      ...summaries.filter((s) => s.summary_text),
      ...finishedSummaries.filter((s) => s !== null)
    ];
  };
  if (data.summaries) {
    summaries = data.summaries?.map((summary) => {
      try {
        if (summary.summary_text) {
          let parts = JSON.parse(summary?.summary_text);
          return { ...summary, ...parts };
        } else {
          unfinishedSummaryIds = [...unfinishedSummaryIds, summary.id];
          return { ...summary };
        }
      } catch (e) {
        console.log("model returned invalid json");
        return { ...summary };
      }
    });
  }
  finishUnfinishedSummaries(unfinishedSummaryIds);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<div class="svelte-1n6b3jf"><h1 class="svelte-1n6b3jf" data-svelte-h="svelte-17blcwe">Past Interviews</h1> ${summaries && summaries.length > 0 ? `${each(summaries, (summary) => {
    return `${summary.title ? `<a data-sveltekit-preload-data="hover"${add_attribute("href", `/summary/${summary.id}`, 0)} class="svelte-1n6b3jf">${validate_component(ListItem, "ListItem").$$render(
      $$result,
      {
        title: summary.title,
        subtitle: `${new Date(summary.created_at).toLocaleDateString()} ${new Date(summary.created_at).toLocaleTimeString()}`
      },
      {},
      {}
    )} </a>` : `<a data-sveltekit-preload-data="hover"${add_attribute("href", `/summary/${summary.id}`, 0)} class="svelte-1n6b3jf"><p class="svelte-1n6b3jf">${validate_component(HorizontalLoader, "HorizontalLoader").$$render($$result, { size: "xs", position: "l" }, {}, {
      default: () => {
        return `Processing Interview From ${escape(`${new Date(summary.created_at).toLocaleDateString()} ${new Date(summary.created_at).toLocaleTimeString()}`)}`;
      }
    })}</p> </a>`}`;
  })}` : `<p class="no-sessions svelte-1n6b3jf" data-svelte-h="svelte-1krn4xr">Past interview evaluations will show up here as you practice. <a href="/interview" class="svelte-1n6b3jf">Start a new practice session.</a></p>`} </div>`;
});
export {
  Page as default
};
