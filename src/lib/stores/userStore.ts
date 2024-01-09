import { writable } from 'svelte/store';

export type UserState = {
    credits: number;
}
export const userStore = writable<UserState>();
