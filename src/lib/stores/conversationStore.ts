import { writable } from 'svelte/store';

export type Participant = 'user' | 'ai';

export type ConversationPart = {
    participant: Participant; 
    text: string, 
    speakingTime?: string | null
};

export type Conversation = {
    id?: string | null;
    finished: boolean;
    parts: ConversationPart[];
}

export type CompletedConversation = {
    text: string, 
    id: string, 
    user_id: string, 
    summary_id: string
}

export const conversationStore = writable<Conversation>({
    id: null, 
    finished: false, 
    parts: []
});