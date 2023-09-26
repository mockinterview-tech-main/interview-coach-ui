import { e as getSummary, f as getAnswer } from "../../../../chunks/serviceApi.js";
const prerender = false;
const ssr = false;
const load = async ({ params }) => {
  let summary = await getSummary(params.slug);
  let answer = null;
  let question = null;
  if (summary?.answer_id) {
    let response = await getAnswer(summary.answer_id);
    if (response) {
      answer = response.answer;
      question = response.question;
    }
  }
  if (summary?.summary_text) {
    try {
      let parts = JSON.parse(summary?.summary_text);
      summary = { ...summary, ...parts };
    } catch (e) {
      console.log("model returned invalid json");
    }
  }
  return {
    summary,
    answer,
    question
  };
};
export {
  load,
  prerender,
  ssr
};
