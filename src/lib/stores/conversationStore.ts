import { writable } from 'svelte/store';

export type ConversationPart = {participant: string; text: string};
export type Conversation = ConversationPart[];

export type CompletedConversation = {text: string, id: string, user_id: string, summary_id: string}

export const conversationStore = writable<Conversation>([]);