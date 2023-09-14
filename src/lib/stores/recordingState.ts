import { writable } from 'svelte/store';

export type RecordingState = 'idle' | 'recording' | 'transcribing';
export const recordingState = writable<RecordingState>('idle');
export const outputText = writable('');
export const audioSrc = writable('');