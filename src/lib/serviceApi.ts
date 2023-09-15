import type { Followup, InterviewAnswer } from "./stores/answerStore";
import type { InterviewQuestion } from "./stores/interviewQuestion";
import type { InterviewSummary } from "./stores/summaryStore";

const resumeUrl = import.meta.env["VITE_RESUME_URL"];

export const getQuestion = async (): Promise<InterviewQuestion | null> => {
    try {
        const response = await fetch(`${resumeUrl}/question`, {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const d = await response.json();
            return d.question as InterviewQuestion;
        } else {
            console.error('Error uploading interview answer');
            return null
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return null
    }
};

type AnswerQuestionRequest = {
    company: string;
    job: string;
    question_id: string;
    answer_text: string;
}

export const answerQuestion = async (answer: AnswerQuestionRequest): Promise<{answer: InterviewAnswer, followups: Followup[]} | null> => {
    try {
        let response = await fetch(`${resumeUrl}/answer`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(answer)
        });
        if (response.ok){
            const d = await response.json();
            return d;
        }
        else {
            console.error('API returned an error: ', response.status);
            return null;
        }
    } catch (e) {
        console.error('An error occurred: ', e);
        return null;
    }
}

export const answerFollowup = async (answerText: string, followupId: string): Promise<Followup | null> => {
    try {
        let response = await fetch(`${resumeUrl}/followup/${followupId}`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({followup_answer: answerText})
        });
        if (response.ok){
            const d = await response.json();
            return d.followup as Followup;
        }
        else {
            console.error('API returned an error: ', response.status);
            return null;
        }
    } catch (e) {
        console.error('An error occurred: ', e);
        return null;
    }
}

export const getSummary = async (answerId: string): Promise<InterviewSummary | null> => {
    try {
        const response = await fetch(`${resumeUrl}/summary/${answerId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const d = await response.json();
            return d.feedback as InterviewSummary
        } else {
            console.error('Error uploading interview answer');
            return null;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
};
