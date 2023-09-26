import { c as create_ssr_component, a as subscribe, b as add_attribute, e as escape, d as each, n as null_to_empty, v as validate_component, f as set_store_value } from "../../../chunks/ssr.js";
import { w as writable } from "../../../chunks/index2.js";
import { c as currentFollowupStore, f as followupsStore, i as interviewAnswerStore } from "../../../chunks/answerStore.js";
import { a as answerQuestion, b as answerFollowup, c as buildSummary, g as getAIQuestion } from "../../../chunks/serviceApi.js";
import "audio-recorder-polyfill";
/* empty css                                                      */function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate" || key === "on_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const goto = /* @__PURE__ */ client_method("goto");
const interviewQuestion = writable({ uuid: "", question_text: "" });
const recordingState = writable("idle");
const outputText = writable("");
const aiChatStore = writable([]);
const userChatStore = writable([]);
const aiChatCard_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: "h3.svelte-139rwjt.svelte-139rwjt{text-align:center}form.svelte-139rwjt.svelte-139rwjt{max-width:50%;margin:auto}form.svelte-139rwjt label.svelte-139rwjt{margin-bottom:5px}form.svelte-139rwjt input.svelte-139rwjt{width:100%;line-height:20px;margin-bottom:20px;border:1px solid #A40080;padding:10px;border-radius:4px}form.svelte-139rwjt input.svelte-139rwjt:focus{border:1px solid #A40080}form.svelte-139rwjt button.svelte-139rwjt{display:flex;align-items:center;padding:10px 20px;border:2px solid transparent;cursor:pointer;font-weight:bold;border-radius:4px;transition:background-color 0.3s, border-color 0.3s;background:none;outline:none;font-size:16px;border-color:#A40080;color:#333}form.svelte-139rwjt button.svelte-139rwjt:hover{background-color:#A40080;color:white}#conversationSection.svelte-139rwjt.svelte-139rwjt{overflow:scroll;margin:20px;max-height:500px}",
  map: null
};
const AiChatCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $interviewQuestion, $$unsubscribe_interviewQuestion;
  let $aiChatStore, $$unsubscribe_aiChatStore;
  $$unsubscribe_interviewQuestion = subscribe(interviewQuestion, (value) => $interviewQuestion = value);
  $$unsubscribe_aiChatStore = subscribe(aiChatStore, (value) => $aiChatStore = value);
  let { loading } = $$props;
  let { endInterview } = $$props;
  let { jobInfo } = $$props;
  let { handleJobInfo } = $$props;
  let { credits } = $$props;
  const conversationSectionElement = document.querySelector("conversationSection");
  if (conversationSectionElement) {
    const conversationSectionElementObserver = new MutationObserver(() => conversationSectionElement.scrollTop = conversationSectionElement?.scrollHeight);
    conversationSectionElementObserver.observe(conversationSectionElement, { childList: true });
  }
  let conversationSection;
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  if ($$props.endInterview === void 0 && $$bindings.endInterview && endInterview !== void 0)
    $$bindings.endInterview(endInterview);
  if ($$props.jobInfo === void 0 && $$bindings.jobInfo && jobInfo !== void 0)
    $$bindings.jobInfo(jobInfo);
  if ($$props.handleJobInfo === void 0 && $$bindings.handleJobInfo && handleJobInfo !== void 0)
    $$bindings.handleJobInfo(handleJobInfo);
  if ($$props.credits === void 0 && $$bindings.credits && credits !== void 0)
    $$bindings.credits(credits);
  $$result.css.add(css$3);
  $$unsubscribe_interviewQuestion();
  $$unsubscribe_aiChatStore();
  return `<h3 class="svelte-139rwjt" data-svelte-h="svelte-1owq50e">AI Chat</h3> <div id="conversationSection" class="svelte-139rwjt"${add_attribute("this", conversationSection, 0)}>${$interviewQuestion.question_text === "" ? `<p>${escape($aiChatStore[0])}</p> ${credits === 0 ? `<p data-svelte-h="svelte-1wsfys2"><b>Uh oh, looks like you&#39;re out of credits. Please buy more before continuing.</b></p>` : ``} <form class="svelte-139rwjt">${credits !== 0 ? `<label for="job" class="svelte-139rwjt" data-svelte-h="svelte-1ddirbq">Job Title</label> <input ${credits === 0 ? "disabled" : ""} id="job" type="text" placeholder="Technical Program Manager" class="svelte-139rwjt"${add_attribute("value", jobInfo.job, 0)}><br> <label for="company" class="svelte-139rwjt" data-svelte-h="svelte-53r700">Company</label> <input ${credits === 0 ? "disabled" : ""} id="company" type="text" placeholder="Google" class="svelte-139rwjt"${add_attribute("value", jobInfo.company, 0)}><br><br> <button type="submit" ${loading ? "disabled" : ""} class="svelte-139rwjt">Get Started</button>` : ``} ${credits === 0 ? `<div style="display: flex; justify-content: center;"><button class="svelte-139rwjt" data-svelte-h="svelte-1wuos1c">Buy Credits</button></div>` : ``}</form>` : `${each($aiChatStore, (part) => {
    return `<p>${escape(part)}</p>`;
  })} ${loading && !endInterview ? `<p data-svelte-h="svelte-i2onk7">Hang on, I&#39;m taking some notes 📝...</p>` : ``} ${endInterview ? `<p data-svelte-h="svelte-1qlm3eq">Thank you for your time. Please wait and we&#39;ll get you your feedback in a bit 🎉</p>` : ``}`} </div>`;
});
const recordAnswerButton_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "button.svelte-10cmru6{margin:10px auto}.record-button.svelte-10cmru6{width:50px;height:50px;border:none;position:relative;background-color:#007bff;color:#fff;border-radius:50%;cursor:pointer;display:flex;justify-content:center;align-items:center;font-size:20px;transition:background-color 0.3s ease}.record-button.svelte-10cmru6:hover{background-color:#0056b3}.flash.svelte-10cmru6{animation:svelte-10cmru6-flash 1s infinite}@keyframes svelte-10cmru6-flash{0%{background-color:red}50%{background-color:blue}100%{background-color:red}}.record-button[title].svelte-10cmru6:hover::after{content:attr(title);background-color:#333;color:#fff;padding:4px 8px;border-radius:4px;position:absolute;top:110%;left:50%;transform:translateX(-50%);white-space:nowrap;opacity:0;transition:opacity 0.2s ease-in-out}.record-button[title].svelte-10cmru6:hover::after{opacity:1;visibility:visible}",
  map: null
};
const RecordAnswerButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $recordingState, $$unsubscribe_recordingState;
  let $interviewQuestion, $$unsubscribe_interviewQuestion;
  let $currentFollowupStore, $$unsubscribe_currentFollowupStore;
  $$unsubscribe_recordingState = subscribe(recordingState, (value) => $recordingState = value);
  $$unsubscribe_interviewQuestion = subscribe(interviewQuestion, (value) => $interviewQuestion = value);
  $$unsubscribe_currentFollowupStore = subscribe(currentFollowupStore, (value) => $currentFollowupStore = value);
  let { loading } = $$props;
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  $$result.css.add(css$2);
  $$unsubscribe_recordingState();
  $$unsubscribe_interviewQuestion();
  $$unsubscribe_currentFollowupStore();
  return `<button ${loading || $recordingState === "transcribing" || !($interviewQuestion.question_text || $currentFollowupStore) ? "disabled" : ""}${add_attribute(
    "title",
    $recordingState === "idle" ? "start recording" : "finish recording",
    0
  )} class="${escape(null_to_empty(`record-button ${$recordingState === "recording" ? "flash" : ""}`), true) + " svelte-10cmru6"}">${escape($recordingState === "idle" ? " ▶️" : "⏹️ ")} </button>`;
});
const userChatCard_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "h3.svelte-1vgjtje{text-align:center}#conversationSection.svelte-1vgjtje{margin:20px;max-height:500px;flex-direction:column;overflow:scroll;scroll-behavior:smooth}",
  map: null
};
const UserChatCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $userChatStore, $$unsubscribe_userChatStore;
  let $recordingState, $$unsubscribe_recordingState;
  $$unsubscribe_userChatStore = subscribe(userChatStore, (value) => $userChatStore = value);
  $$unsubscribe_recordingState = subscribe(recordingState, (value) => $recordingState = value);
  let { endInterview } = $$props;
  let userChatContainer;
  if ($$props.endInterview === void 0 && $$bindings.endInterview && endInterview !== void 0)
    $$bindings.endInterview(endInterview);
  $$result.css.add(css$1);
  $$unsubscribe_userChatStore();
  $$unsubscribe_recordingState();
  return `<h3 class="svelte-1vgjtje" data-svelte-h="svelte-6rrrmr">User Chat</h3> <div id="conversationSection" class="svelte-1vgjtje"${add_attribute("this", userChatContainer, 0)}>${each($userChatStore, (part) => {
    return `<p>${escape(part)}</p>`;
  })} ${$recordingState === "transcribing" && !endInterview ? `<p data-svelte-h="svelte-80c2sq">Transcribing speech 📝...</p>` : ``} </div>`;
});
const questionList_svelte_svelte_type_style_lang = "";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "div.svelte-139jwsq.svelte-139jwsq{padding:40px 20px;display:flex}div.svelte-139jwsq .aiChat.svelte-139jwsq{display:flex;flex-direction:column;justify-items:center;width:50%;max-height:100vh}div.svelte-139jwsq .userChat.svelte-139jwsq{display:flex;flex-direction:column;justify-items:center;width:50%;max-height:100vh}div.svelte-139jwsq .userChat div.svelte-139jwsq{justify-content:flex-end}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $interviewAnswerStore, $$unsubscribe_interviewAnswerStore;
  let $aiChatStore, $$unsubscribe_aiChatStore;
  let $currentFollowupStore, $$unsubscribe_currentFollowupStore;
  let $interviewQuestion, $$unsubscribe_interviewQuestion;
  let $userChatStore, $$unsubscribe_userChatStore;
  let $outputText, $$unsubscribe_outputText;
  $$unsubscribe_interviewAnswerStore = subscribe(interviewAnswerStore, (value) => $interviewAnswerStore = value);
  $$unsubscribe_aiChatStore = subscribe(aiChatStore, (value) => $aiChatStore = value);
  $$unsubscribe_currentFollowupStore = subscribe(currentFollowupStore, (value) => $currentFollowupStore = value);
  $$unsubscribe_interviewQuestion = subscribe(interviewQuestion, (value) => $interviewQuestion = value);
  $$unsubscribe_userChatStore = subscribe(userChatStore, (value) => $userChatStore = value);
  $$unsubscribe_outputText = subscribe(outputText, (value) => $outputText = value);
  let { data } = $$props;
  const credits = data.credits;
  let jobInfo = { company: "", job: "" };
  let questions;
  let loading = false;
  let endInterview = false;
  const handleJobInfo = async (e) => {
    e.preventDefault();
    if (jobInfo.company && jobInfo.job) {
      {
        loading = true;
        let aiQuestion = await getAIQuestion({
          company: jobInfo.company,
          job: jobInfo.job
        });
        loading = false;
        if (aiQuestion) {
          set_store_value(interviewQuestion, $interviewQuestion = { ...aiQuestion, uuid: "ephemeral" }, $interviewQuestion);
        } else {
          let actualQuestions = questions.filter((q) => q.uuid !== "");
          set_store_value(interviewQuestion, $interviewQuestion = actualQuestions[Math.floor(Math.random() * actualQuestions.length)], $interviewQuestion);
        }
      }
      aiChatStore.set([
        ...$aiChatStore,
        `Lucy: I see you're interviewing as a ${jobInfo.job} at ${jobInfo.company}. Here is your first question 🙂!`
      ]);
      aiChatStore.set([...$aiChatStore, $interviewQuestion.question_text]);
      fetch("/interview", { method: "POST", credentials: "include" });
    } else {
      alert("Please tell me what job and company you're preparing for");
    }
  };
  const followupGenerator = function* (followups) {
    for (const item of followups) {
      yield item;
    }
  };
  let nextFollowup;
  followupsStore.subscribe((followupList) => nextFollowup = followupGenerator(followupList));
  outputText.subscribe(async (answerText) => {
    try {
      if ($outputText !== "") {
        userChatStore.set([...$userChatStore, `You: ${answerText}`]);
        loading = true;
        if (!$interviewAnswerStore) {
          const result = await answerQuestion({
            question_text: $interviewQuestion.question_text,
            company: jobInfo.company,
            job: jobInfo.job,
            answer_text: answerText
          });
          if (result) {
            if (result.errors) {
              aiChatStore.set([...$aiChatStore, `Lucy: ${result.errors}`]);
            } else {
              const { answer, followups } = result;
              interviewAnswerStore.set(answer);
              followupsStore.set(followups);
              const fu = nextFollowup.next();
              if (!fu.done) {
                aiChatStore.set([...$aiChatStore, `Lucy: ${fu.value.followup_question_text}`]);
                currentFollowupStore.set(fu.value);
              }
            }
          }
        } else {
          answerFollowup(answerText, $currentFollowupStore.id);
          const fu = nextFollowup.next();
          if (!fu.done) {
            aiChatStore.set([...$aiChatStore, `Lucy: ${fu.value.followup_question_text}`]);
            currentFollowupStore.set(fu.value);
          } else {
            endInterview = true;
            if ($interviewAnswerStore) {
              const resp = await buildSummary($interviewAnswerStore.id);
              if (resp?.summary_text) {
                goto(`/summary/${resp.id}`);
              } else {
                console.log(resp);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      loading = false;
    }
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="svelte-139jwsq"><div class="aiChat svelte-139jwsq">${validate_component(AiChatCard, "AIChatCard").$$render(
      $$result,
      {
        credits,
        loading,
        endInterview,
        jobInfo,
        handleJobInfo
      },
      {},
      {}
    )}</div> <div class="userChat svelte-139jwsq">${!$interviewQuestion.uuid ? `${``}` : `${validate_component(UserChatCard, "UserChatCard").$$render($$result, { endInterview }, {}, {})} ${!endInterview && (jobInfo.company !== "" || jobInfo.job !== "") ? `<div class="svelte-139jwsq">${validate_component(RecordAnswerButton, "RecordAnswerButton").$$render($$result, { loading }, {}, {})}</div>` : ``}`}</div> </div>`;
  } while (!$$settled);
  $$unsubscribe_interviewAnswerStore();
  $$unsubscribe_aiChatStore();
  $$unsubscribe_currentFollowupStore();
  $$unsubscribe_interviewQuestion();
  $$unsubscribe_userChatStore();
  $$unsubscribe_outputText();
  return $$rendered;
});
export {
  Page as default
};
