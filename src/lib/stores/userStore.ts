import { writable } from 'svelte/store';

export type UserState = {
    credits: number;
    subscriptionID?: string | null;
    loggedIn: boolean;
}
export const userStore = writable<UserState>();
