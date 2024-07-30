import * as lamejs from "@breezystack/lamejs";

import { outputText, recordingState } from '$lib/stores/recordingState';
import { get } from 'svelte/store';
import { startRecording, stopRecording } from './mediaRecorder';
import { postTranscription } from "$lib/serviceApi";
import { millisecondsToMinuteSecondString } from "$lib/utils/time";

export const toggleRecording = async () => {
	const recordingStateValue = get(recordingState);
	if (recordingStateValue === 'idle') {
		await startRecording();
		recordingState.set('recording');
	} 
	if (recordingStateValue === 'recording') {
		try {
			let [audioBlob, elapsedTime] = await stopRecording();
			recordingState.set('transcribing');
			// Check if the size is less than 25MB
			if (audioBlob.size > 25 * 1024 * 1024){
				audioBlob = await compressAudioBlob(audioBlob);
				if (audioBlob.size > 25 * 1024 * 1024)
					throw new Error (`[ERROR] Given answer is too long. Speaking time: ${elapsedTime}`)
			}
			const text = await postTranscription(audioBlob);
			if (text){
        outputText.set(`{"time": "${millisecondsToMinuteSecondString(elapsedTime)}"} ${text}`);
			} else {
				outputText.set("bad transcription error");
			}
		} catch (error) {
				console.error('Error occurred during transcription:', error);
				outputText.set("long answer error");
		} finally {
				recordingState.set('idle');
		}
	}
}

const compressAudioBlob = async (audioBlob: Blob): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => {
			let data = r.result as ArrayBuffer;
			if (data.byteLength % 2 !== 0) {
				// If not, create a new ArrayBuffer with the correct length
				data = data.slice(0, data.byteLength - 1);
			}
			const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128); // Mono channel, 44100 Hz, 128 kbps
			
			const mp3Data = mp3Encoder.encodeBuffer(new Int16Array(data));
			mp3Encoder.flush();
			resolve(new Blob([mp3Data], { type: 'audio/mp3' }));
		};
		r.onerror = (error) => reject(error);
		r.readAsArrayBuffer(audioBlob);
	})
}