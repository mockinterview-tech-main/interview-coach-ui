import AudioRecorder from 'audio-recorder-polyfill';
import * as lamejs from '@breezystack/lamejs';

let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];

let startTime: number;
let stopTime: number;

export const startRecording = async (): Promise<MediaStream> => {
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	mediaRecorder = new AudioRecorder(stream);
	if (!mediaRecorder) throw new Error('MediaRecorder is not initialized.');
	mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
		recordedChunks.push(event.data);
	});
	startTime = Date.now();
	mediaRecorder.start();
	return stream
}

export const stopRecording = async (): Promise<[Blob, number]> => {
	return new Promise((resolve) => {
		if (!mediaRecorder) throw new Error('MediaRecorder is not initialized.');
		mediaRecorder.addEventListener('stop', () => {
			mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
			const audioBlob = new Blob(recordedChunks, { type: 'audio/mp3' });
			recordedChunks = [];
			stopTime = Date.now();
			resolve([audioBlob, stopTime - startTime]);
		});
		mediaRecorder.stop();
	});
}
export const compressAudioBlob = async (audioBlob: Blob): Promise<Blob> => {
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
	});
};