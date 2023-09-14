import { writable } from 'svelte/store';

export type InterviewQuestion = {uuid: string, question_text: string};
export const interviewQuestion = writable<InterviewQuestion>({uuid: "", question_text: ""});