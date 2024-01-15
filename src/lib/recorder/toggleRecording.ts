import { outputText, recordingState } from '$lib/stores/recordingState';
import { get } from 'svelte/store';
import { startRecording, stopRecording } from './mediaRecorder';

export const toggleRecording = async () => {
	const recordingStateValue = get(recordingState);
    
	if (recordingStateValue === 'idle') {
		await startRecording();
		recordingState.set('recording');
	} else {
		try {
			const audioBlob = await stopRecording();
			recordingState.set('transcribing');
			const response = await fetch("/transcription", {
				method: "POST",
				credentials: "include",
				body: audioBlob
			});
			const {text} = await response.json();
            outputText.set(text);
		} catch (error) {
			console.error('Error occurred during transcription:', error);
			outputText.set("long answer error");
		} finally {
			recordingState.set('idle');
		}
	}
    
}