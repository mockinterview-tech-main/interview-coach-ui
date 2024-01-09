import { writable } from 'svelte/store';

export type Stats = {
    adaptability: Stat;
    collaboration: Stat;
    customerocus: Stat;
    decision_making: Stat;
    influence: Stat;
    innovation: Stat;
    problem_solving: Stat;
}

export type Stat = {
    attempts: number;
    gpa: number;
}

export const statsStore = writable<Stats>();
