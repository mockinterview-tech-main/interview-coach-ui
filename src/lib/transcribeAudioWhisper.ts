import * as lamejs from "@breezystack/lamejs";

export const transcribeAudioWithWhisperApi = async (audioBlob: Blob): Promise<string> => {
     const openaiKey = import.meta.env["VITE_OPENAI_API_KEY"];
	// Check if the size is less than 25MB
	if (audioBlob.size > 25 * 1024 * 1024){
		audioBlob = await compressAudioBlob(audioBlob);
		if (audioBlob.size > 25 * 1024 * 1024)
			throw new Error ("[ERROR] Given answer is too long")
	}

	if (!openaiKey) 
        throw new Error("[ERROR] Unable to contact OpenAI")

	const mp3File = new File([audioBlob], 'recording.mp3');
	const formData = new FormData();
	formData.append('file', mp3File);
	formData.append('model', 'whisper-1');

	const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
		method: 'POST',
		headers: { Authorization: `Bearer ${openaiKey}` },
		body: formData
	});

	const data = await response.json();

	if (!response.ok) 
        throw new Error(data.error || 'Error transcribing the audio');

	return data.text;
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