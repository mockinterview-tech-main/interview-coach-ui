import { getConversation, getSummary } from '$lib/serviceApi';
import { interviewSummaryStore } from '$lib/stores/summaryStore.js';
import type { PageLoad } from './$types';

export const ssr = false; // Needs browser to send cookie for auth

export const load: PageLoad = async ({params}) => {
  let conversationText = "";
  let summary = await getSummary(params.slug);
  let conversation = '';

  if (summary?.summary_text) {
    let conversationData = await getConversation(summary?.conversation_id);
    conversation = conversationData?.text || 'Converation not found';
    conversationText = conversation;
    try {
      let parts = JSON.parse(summary?.summary_text);
      interviewSummaryStore.set({ ...summary, ...parts });
    } catch (e) {
      console.log('model returned invalid json');
    }
  }
  return {conversationText};
}