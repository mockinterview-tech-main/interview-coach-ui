import { g as getSummary, d as getConversation } from "../../../../chunks/serviceApi.js";
const prerender = false;
const ssr = false;
const load = async ({ params }) => {
  let summary = await getSummary(params.slug);
  let conversation = "";
  if (summary?.summary_text) {
    let conversationData = await getConversation(summary?.conversation_id);
    conversation = conversationData?.text || "Converation not found";
    try {
      let parts = JSON.parse(summary?.summary_text);
      summary = { ...summary, ...parts };
    } catch (e) {
      console.log("model returned invalid json");
    }
  }
  return {
    summary,
    conversation
  };
};
export {
  load,
  prerender,
  ssr
};
