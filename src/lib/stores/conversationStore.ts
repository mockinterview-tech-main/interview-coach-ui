import { writable } from 'svelte/store';

export type ConversationPart = {participant: string; text: string};
export type Conversation = ConversationPart[];

export const conversationStore = writable<Conversation>([]);