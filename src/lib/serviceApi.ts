import type { Followup, InterviewAnswer } from "./stores/answerStore";
import type { CompletedConversation } from "./stores/conversationStore";
import type { InterviewQuestion } from "./stores/interviewQuestion";
import type { InterviewSummary } from "./stores/summaryStore";

const resumeUrl = import.meta.env["VITE_RESUME_URL"];

type ConversationRequest = {
    text: string;
}

export const postConversation = async (conversation: ConversationRequest): Promise<{id: string, user_id: string, text: string, summary_id: string} | null> => {
    try {
        const response = await fetch(`${resumeUrl}/conversation`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({text: conversation.text})
        });
        if (response.ok) {
            const d = await response.json();
            return {...d.conversation, summary_id: d.summary_id} as CompletedConversation
        } else {
            console.error('API returned an error: ', response);
            return null;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
}

export const getConversation = async (conversationId: string): Promise<{conversation: CompletedConversation} | null> => {
    try {
        const response = await fetch(`${resumeUrl}/conversations/${conversationId}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const d = await response.json();
            return { conversation: d.conversation as CompletedConversation }
        } else {
            console.error('API returned an error: ', response);
            return null;
        }
    } catch (error) {
        console.error("An error occurred: ", error);
        return null;
    }
}

export const getSummary = async (summaryId: string): Promise<InterviewSummary | null> => {
    try {
        const response = await fetch(`${resumeUrl}/summary/${summaryId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const d = await response.json();
            return d.summary as InterviewSummary
        } else {
            console.error('API returned an error: ', response);
            return null;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
};

export const getSummaries = async (): Promise<Array<InterviewSummary> | null> => {
    try {
        const response = await fetch(`${resumeUrl}/summary`, {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const d = await response.json();
            return d.summaries as Array<InterviewSummary>
        } else {
            console.error('API returned an error: ', response);
            return null;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
};