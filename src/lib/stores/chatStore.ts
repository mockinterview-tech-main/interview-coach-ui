import { writable } from 'svelte/store';
export const aiChatStore = writable<Array<string>>([]);
export const userChatStore = writable<Array<string>>([]);
