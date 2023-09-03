import { writable } from 'svelte/store';

type InterviewQuestion = {qid: string, question: string};
export const interviewQuestion = writable<InterviewQuestion>({qid: "", question: ""});