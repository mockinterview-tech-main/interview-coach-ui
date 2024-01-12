import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component, f as each } from "../../../../chunks/ssr.js";
import { A as Accordion, P as Panel, H as Header, C as Content } from "../../../../chunks/Header.js";
import { w as writable } from "../../../../chunks/index2.js";
const interviewSummaryStore = writable();
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "div.svelte-1vo9vtz.svelte-1vo9vtz{padding:50px}div.svelte-1vo9vtz h1.svelte-1vo9vtz{margin-top:80px;margin-left:40px}div.svelte-1vo9vtz i.svelte-1vo9vtz{margin-left:40px}div.svelte-1vo9vtz h3.svelte-1vo9vtz{display:block;text-align:left;font-weight:700}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $interviewSummaryStore, $$unsubscribe_interviewSummaryStore;
  $$unsubscribe_interviewSummaryStore = subscribe(interviewSummaryStore, (value) => $interviewSummaryStore = value);
  let { data } = $$props;
  let conversationText = "";
  if (data.summary)
    interviewSummaryStore.set(data.summary);
  if (data.conversation)
    conversationText = data.conversation;
  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  $$unsubscribe_interviewSummaryStore();
  return `<div class="svelte-1vo9vtz"><h1 class="svelte-1vo9vtz">${escape($interviewSummaryStore.title || "Your Past Interview")}</h1> <i class="svelte-1vo9vtz">${escape(new Date($interviewSummaryStore.created_at).toLocaleDateString())}</i><br><br> ${validate_component(Accordion, "Accordion").$$render($$result, { multiple: true }, {}, {
    default: () => {
      return `${validate_component(Panel, "Panel").$$render($$result, { open: true }, {}, {
        default: () => {
          return `${validate_component(Header, "Header").$$render($$result, {}, {}, {
            default: () => {
              return `<h2>Storytelling Fundamentals: ${escape($interviewSummaryStore.overall.grade)}</h2>`;
            }
          })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
            default: () => {
              return `<p>${escape($interviewSummaryStore.overall.summary)}</p> <h3 class="svelte-1vo9vtz">Situation: ${escape($interviewSummaryStore.situation.grade)}</h3> <p>${escape($interviewSummaryStore.situation.summary)}</p> <h3 class="svelte-1vo9vtz">Task: ${escape($interviewSummaryStore.task.grade)}</h3> <p>${escape($interviewSummaryStore.task.summary)}</p> <h3 class="svelte-1vo9vtz">Action: ${escape($interviewSummaryStore.action.grade)}</h3> <p>${escape($interviewSummaryStore.action.summary)}</p> <h3 class="svelte-1vo9vtz">Result: ${escape($interviewSummaryStore.result.grade)}</h3> <p>${escape($interviewSummaryStore.result.summary)}</p>`;
            }
          })}`;
        }
      })} ${$interviewSummaryStore.focus ? `${validate_component(Panel, "Panel").$$render($$result, { open: true }, {}, {
        default: () => {
          return `${validate_component(Header, "Header").$$render($$result, {}, {}, {
            default: () => {
              return `<h2>Focus Area ${escape(capitalize($interviewSummaryStore.focus.area))}: ${escape($interviewSummaryStore.focus.grade)}</h2>`;
            }
          })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
            default: () => {
              return `<p>${escape($interviewSummaryStore.focus.summary)}</p>`;
            }
          })}`;
        }
      })}` : ``} ${validate_component(Panel, "Panel").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Header, "Header").$$render($$result, {}, {}, {
            default: () => {
              return `<h2 data-svelte-h="svelte-h0a5h">Questions Asked</h2>`;
            }
          })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
            default: () => {
              return `${each($interviewSummaryStore.questions, (question) => {
                return `<p>${escape(question)}</p>`;
              })}`;
            }
          })}`;
        }
      })} ${validate_component(Panel, "Panel").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Header, "Header").$$render($$result, {}, {}, {
            default: () => {
              return `<h2 data-svelte-h="svelte-jnvy99">Interview Transcript</h2>`;
            }
          })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
            default: () => {
              return `${each(conversationText.split("\n"), (part) => {
                return `<p>${escape(part)}</p>`;
              })}`;
            }
          })}`;
        }
      })}`;
    }
  })} </div>`;
});
export {
  Page as default
};
