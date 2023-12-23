import AudioRecorder from 'audio-recorder-polyfill';

let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];

export const startRecording = async (): Promise<void> => {
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	mediaRecorder = new AudioRecorder(stream);
	if (!mediaRecorder) throw new Error('MediaRecorder is not initialized.');
	mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
		recordedChunks.push(event.data);
	});
	mediaRecorder.start();
}

export const stopRecording = async (): Promise<Blob> => {
	return new Promise((resolve) => {
		if (!mediaRecorder) throw new Error('MediaRecorder is not initialized.');
		mediaRecorder.addEventListener('stop', () => {
			mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
			const audioBlob = new Blob(recordedChunks, { type: 'audio/mp3' });
			recordedChunks = [];
			resolve(audioBlob);
		});
		mediaRecorder.stop();
	});
}