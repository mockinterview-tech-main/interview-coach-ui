import { audioSrc, outputText, recordingState } from '$lib/stores/recordingState';
import { transcribeAudioWithWhisperApi } from '$lib/transcribeAudioWhisper';
import { get } from 'svelte/store';
import { startRecording, stopRecording } from './mediaRecorder';

export async function toggleRecording() {
	const recordingStateValue = get(recordingState);
    
	if (recordingStateValue === 'idle') {
		await startRecording();
		recordingState.set('recording');
	} else {
		try {
			const audioBlob = await stopRecording();
			audioSrc.set(URL.createObjectURL(audioBlob));
			recordingState.set('transcribing');
			const text = await transcribeAudioWithWhisperApi(audioBlob);
            outputText.set(text);
		} catch (error) {
			console.error('Error occurred during transcription:', error);
		} finally {
			recordingState.set('idle');
		}
	}
    
}