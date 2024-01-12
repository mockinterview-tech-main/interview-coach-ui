import { c as create_ssr_component, a as subscribe, o as onDestroy, b as set_store_value, e as escape, d as add_attribute, v as validate_component, f as each } from "../../../chunks/ssr.js";
import { B as Button } from "../../../chunks/Button.js";
import { w as writable } from "../../../chunks/index2.js";
import "@breezystack/lamejs";
import "audio-recorder-polyfill";
/* empty css                                                              */import { p as putConversation, a as postConversation, b as postSummary } from "../../../chunks/serviceApi.js";
import { u as userStore } from "../../../chunks/userStore.js";
const UserHeadsetDuo = "/_app/immutable/assets/user-headset-duo.d2ea5145.svg";
const Lucy = "/_app/immutable/assets/lucy.cb729f68.png";
const Dale = "/_app/immutable/assets/dale.bcebc9cd.png";
const Kelly = "/_app/immutable/assets/kelly.7cc0c393.png";
const Judy = "/_app/immutable/assets/judy.16c024e3.png";
const Patrick = "/_app/immutable/assets/patrick.a20ac797.png";
const outputText = writable("");
const conversationStore = writable({ id: null, finished: false, parts: [] });
const recordAnswerButton_svelte_svelte_type_style_lang = "";
const transcript_svelte_svelte_type_style_lang = "";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "div.svelte-1aw72s1.svelte-1aw72s1{display:flex;flex-direction:column}div.svelte-1aw72s1 .call.svelte-1aw72s1{width:100%;background-color:#6e6e6e;padding:20px 0px;position:sticky;top:0}div.svelte-1aw72s1 .call .control-panel.svelte-1aw72s1{display:flex;flex-direction:row;margin:0px 40vw}div.svelte-1aw72s1 .call h3.svelte-1aw72s1{margin:auto;padding-top:20px;margin-top:75px;text-align:center;color:#A40080;background-color:white;width:500px;border-top:1px solid black;border-left:1px solid black;border-right:1px solid black}div.svelte-1aw72s1 .call .pfp-container.svelte-1aw72s1{background-color:white;width:500px;padding:20px 0px;padding-bottom:30px;margin:auto}div.svelte-1aw72s1 .call .pfp-container img.svelte-1aw72s1{width:150px;border-radius:100px;margin:auto}@media only screen and (max-width: 1000px){div.svelte-1aw72s1 .call h3.svelte-1aw72s1{font-size:14px;width:300px}div.svelte-1aw72s1 .call .pfp-container.svelte-1aw72s1{width:300px}div.svelte-1aw72s1 .call .pfp-container img.svelte-1aw72s1{width:100px}}div.svelte-1aw72s1 .transcript.svelte-1aw72s1{padding:0px 15%;margin-bottom:40px}div.svelte-1aw72s1 .options-container.svelte-1aw72s1{flex-flow:row wrap;display:flex}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $conversationStore, $$unsubscribe_conversationStore;
  let $outputText, $$unsubscribe_outputText;
  let $userStore, $$unsubscribe_userStore;
  $$unsubscribe_conversationStore = subscribe(conversationStore, (value) => $conversationStore = value);
  $$unsubscribe_outputText = subscribe(outputText, (value) => $outputText = value);
  $$unsubscribe_userStore = subscribe(userStore, (value) => $userStore = value);
  let { data } = $$props;
  let { username } = data;
  const interviewers = [
    { name: "Lucy Interviewer", pfp: Lucy },
    { name: "Dale Interviewer", pfp: Dale },
    { name: "Kelly Interviewer", pfp: Kelly },
    { name: "Judy Interviewer", pfp: Judy },
    {
      name: "Patrick Interviewer",
      pfp: Patrick
    }
  ];
  const topics = [
    "Adaptability",
    "Collaboration",
    "Customer Focus",
    "Decision Making",
    "Influence",
    "Innovation",
    "Problem Solving"
  ];
  const interviewer = interviewers[Math.floor(Math.random() * interviewers.length)];
  let loading = false;
  let selectedTopic = "";
  let summaryId = "";
  const reset = () => {
    set_store_value(outputText, $outputText = "", $outputText);
    set_store_value(conversationStore, $conversationStore = { id: null, finished: false, parts: [] }, $conversationStore);
  };
  onDestroy(reset);
  outputText.subscribe(async () => {
    try {
      if ($outputText !== "") {
        if ($outputText.toLocaleLowerCase() === "long answer error") {
          const newPart2 = {
            participant: interviewer.name.split(" ")[0],
            text: "Great answer, but a key component of interviewing well is telling impactful stories succinctly. Please try shortening your story."
          };
          set_store_value(conversationStore, $conversationStore.parts = [...$conversationStore.parts, newPart2], $conversationStore);
          return;
        }
        const newPart = {
          participant: username || "Me",
          text: $outputText
        };
        set_store_value(conversationStore, $conversationStore.parts = [...$conversationStore.parts, newPart], $conversationStore);
        loading = true;
        const conversationResponse = $conversationStore.id ? await putConversation({
          id: $conversationStore.id,
          text: `${newPart.participant}: ${newPart.text}`
        }) : await postConversation({
          text: `${newPart.text} and I'd like to talk about ${selectedTopic}`
        });
        if (conversationResponse) {
          set_store_value(
            conversationStore,
            $conversationStore = {
              id: conversationResponse.id,
              finished: conversationResponse.finished,
              parts: [
                ...$conversationStore.parts,
                {
                  participant: interviewer.name.split(" ")[0],
                  text: conversationResponse.added_part.split(": ").filter((part) => part != "Interviewer" || part != interviewer.name.split(" ")[0]).join(". ")
                }
              ]
            },
            $conversationStore
          );
          if (conversationResponse.finished) {
            const summary = await postSummary({
              conversation_id: $conversationStore.id || ""
            });
            summaryId = summary?.id || "";
          }
        }
        loading = false;
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  $$unsubscribe_conversationStore();
  $$unsubscribe_outputText();
  $$unsubscribe_userStore();
  return `<div class="svelte-1aw72s1"><div class="call svelte-1aw72s1"><h3 class="svelte-1aw72s1">${escape(interviewer.name.split(" ")[0])}</h3> <div class="pfp-container svelte-1aw72s1"> ${`<img${add_attribute("src", UserHeadsetDuo, 0)} class="svelte-1aw72s1">`}</div> <br> <div class="control-panel svelte-1aw72s1">${``}</div></div> <div class="transcript svelte-1aw72s1">${$userStore.credits === 0 ? `<p style="text-align: center;" data-svelte-h="svelte-tijdt8">Uh oh, looks like you&#39;re out of credits. Please buy more before continuing.</p> <div class="options-container svelte-1aw72s1" style="flex-direction: column; align-items: center;">${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Buy Credits`;
    }
  })}</div>` : `${`<h2 data-svelte-h="svelte-vzkkuq">Select a Focus Area</h2> <p data-svelte-h="svelte-3o6s3a">Most soft skill interviews focus on one of the following topics. Please choose one of the following:</p> <div class="options-container svelte-1aw72s1">${each(topics, (topic) => {
    return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `${escape(topic)}`;
      }
    })}`;
  })}</div>`}`}</div> </div>`;
});
export {
  Page as default
};
