import type { Stats } from "./stores/statsStore";
import type { InterviewSummary } from "./stores/summaryStore";

const resumeUrl = import.meta.env["VITE_RESUME_URL"];

type ConversationRequest = {
    text: string;
    id?: string | null;
}

type SummaryizeRequest = {
    conversation_id: string;
}

export const postConversation = async (conversation: ConversationRequest): Promise<{id: string, user_id: string, text: string, finished: boolean, added_part: string} | null> => {
    try {
        const response = await fetch(`${resumeUrl}/conversations`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(conversation)
        });
        if (response.ok) {
            const d = await response.json();
            return {...d.conversation, added_part: d.added_part}
        } else {
            console.error('API returned an error: ', response);
            return null;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
}

export const putConversation = async (conversation: ConversationRequest): Promise<{id: string, user_id: string, text: string, finished: boolean, added_part: string} | null> => {
    try {
        const response = await fetch(`${resumeUrl}/conversations/${conversation.id}`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(conversation)
        });
        if (response.ok) {
            const d = await response.json();
            return {...d.conversation, added_part: d.added_part}
        } else {
            console.error('API returned an error: ', response);
            return null;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
}

export const getConversation = async (conversationId: string): Promise<{id: string, user_id: string, text: string, finished: boolean} | null> => {
    try {
        const response = await fetch(`${resumeUrl}/conversations/${conversationId}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const d = await response.json();
            return { ...d.conversation}
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
        console.error('An error occurred: ', error);
        return null;
    }
};

export const getSummaryStats = async (): Promise<Stats | null> => {
    try {
        const response = await fetch(`${resumeUrl}/summary/stats`, {
            method: 'GET',
            credentials: 'include',
        });
         if (response.ok) {
            const d = await response.json();
            return d.summaries as Stats
        } else {
            console.error('API returned an error: ', response);
            return null;
        }
    } catch (error) {
        console.error('An error occurred: ', error);
        return null;
    }
}

export const postSummary = async (summarize_request: SummaryizeRequest): Promise<InterviewSummary | null> => {
    try {
        const response = await fetch (`${resumeUrl}/summary`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({...summarize_request})
        });
        if (response.ok) {
            const d = await response.json();
            return d.summary as InterviewSummary;
        } else {
            console.error('API returned an error: ', response);
            return null;
        }
    } catch (error) {
        console.error('An error occurred: ', error);
        return null;
    }
}

export const postTranscription = async (audioBlob: Blob): Promise<string | null> => {
    try {
        const mp3File = new File([audioBlob], 'recording.mp3');
        const formData = new FormData();
        formData.append('file', mp3File);
        
        const response = await fetch(`${resumeUrl}/transcription`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        if (response.ok) {
            const d = await response.json();
            return d.text;
        } else {
            console.error('API returned an error: ', response);
            return null;
        }
    } catch (error) {
        console.error('An error occurred: ', error);
        return null;
    }
}