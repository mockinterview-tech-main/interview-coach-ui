import { writable } from 'svelte/store';

export type InterviewAnswer = {
    id: string, 
    user_id: string,
    question_text: string,
    company_name: string,
    job_title: string,
    answer_text: string,
    created_at: string,
};

export type Followup = {
    id: string,
    answer_id: string,
    followup_question_text: string,
    answer_text?: string | null,
}

export const interviewAnswerStore = writable<InterviewAnswer | null>();
export const followupsStore = writable<Array<Followup>>([]);
export const currentFollowupStore = writable<Followup>();
