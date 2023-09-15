import { writable } from 'svelte/store';

export type InterviewSummary = {
    id: string;
    answer_id: string
    user_id: string
    created_at: string
    summary_text: string
    Situation: string
    Task: string
    Action: string
    Result: string
    Summary: string
};

export const interviewSummaryStore = writable<InterviewSummary>();
