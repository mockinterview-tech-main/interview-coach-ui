import { writable } from 'svelte/store';

export type InterviewSummary = {
    id: string;
    answer_id: string
    user_id: string
    conversation_id: string
    created_at: string
    summary_text: string
    questions: string[]
    title: string
    situation: SectionGrade
    task: SectionGrade
    action: SectionGrade
    result: SectionGrade
    overall: SectionGrade
};

type SectionGrade = {grade: string, summary: string}

export const interviewSummaryStore = writable<InterviewSummary>();
