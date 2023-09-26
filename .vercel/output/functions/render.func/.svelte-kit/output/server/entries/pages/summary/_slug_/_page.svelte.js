import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component } from "../../../../chunks/ssr.js";
import { i as interviewAnswerStore } from "../../../../chunks/answerStore.js";
import { w as writable } from "../../../../chunks/index2.js";
const interviewSummaryStore = writable();
const summaryCard_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "div.svelte-krj83o.svelte-krj83o{display:flex;flex-direction:row;flex-wrap:wrap;align-content:space-between}div.svelte-krj83o .summaryContainer.svelte-krj83o{margin:10px;max-width:50%;flex-direction:column;flex-grow:2}div.svelte-krj83o .userInputContainer.svelte-krj83o{margin:10px;max-width:45%;flex-direction:column;flex-grow:1}div.svelte-krj83o strong.svelte-krj83o{display:block}",
  map: null
};
const SummaryCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $interviewSummaryStore, $$unsubscribe_interviewSummaryStore;
  let $interviewAnswerStore, $$unsubscribe_interviewAnswerStore;
  $$unsubscribe_interviewSummaryStore = subscribe(interviewSummaryStore, (value) => $interviewSummaryStore = value);
  $$unsubscribe_interviewAnswerStore = subscribe(interviewAnswerStore, (value) => $interviewAnswerStore = value);
  $$result.css.add(css$1);
  $$unsubscribe_interviewSummaryStore();
  $$unsubscribe_interviewAnswerStore();
  return `<div class="svelte-krj83o"><div class="summaryContainer svelte-krj83o"><strong class="svelte-krj83o" data-svelte-h="svelte-uvl912">Situation</strong> <p>${escape($interviewSummaryStore.Situation)}</p> <strong class="svelte-krj83o" data-svelte-h="svelte-xf0ds1">Task</strong> <p>${escape($interviewSummaryStore.Task)}</p> <strong class="svelte-krj83o" data-svelte-h="svelte-1q6mq0u">Action</strong> <p>${escape($interviewSummaryStore.Action)}</p> <strong class="svelte-krj83o" data-svelte-h="svelte-1tfzy7x">Result</strong> <p>${escape($interviewSummaryStore.Result)}</p> <strong class="svelte-krj83o" data-svelte-h="svelte-3dtjwi">Analysis</strong> <p>${escape($interviewSummaryStore.Summary)}</p></div> <div class="userInputContainer svelte-krj83o"><strong class="svelte-krj83o" data-svelte-h="svelte-r39vwv">Your Answer</strong> <p>${escape($interviewAnswerStore.answer_text)}</p></div> </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "div.svelte-3d69mn{margin:60px 40px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $interviewAnswerStore, $$unsubscribe_interviewAnswerStore;
  let $interviewSummaryStore, $$unsubscribe_interviewSummaryStore;
  $$unsubscribe_interviewAnswerStore = subscribe(interviewAnswerStore, (value) => $interviewAnswerStore = value);
  $$unsubscribe_interviewSummaryStore = subscribe(interviewSummaryStore, (value) => $interviewSummaryStore = value);
  let { data } = $$props;
  if (data.summary)
    interviewSummaryStore.set(data.summary);
  if (data.answer)
    interviewAnswerStore.set(data.answer);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  $$unsubscribe_interviewAnswerStore();
  $$unsubscribe_interviewSummaryStore();
  return `<div class="svelte-3d69mn"><h1><i>${escape($interviewAnswerStore.question_text)}</i></h1> <h5>${escape(new Date($interviewSummaryStore.created_at).toLocaleDateString())} ${escape(new Date($interviewSummaryStore.created_at).toLocaleTimeString())}</h5> ${validate_component(SummaryCard, "SummaryCard").$$render($$result, {}, {}, {})} </div>`;
});
export {
  Page as default
};
