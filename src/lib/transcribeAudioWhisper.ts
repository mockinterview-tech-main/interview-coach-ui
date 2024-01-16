
export const transcribeAudioWithWhisperApi = async (audioBlob: Blob): Promise<string> => {
     const openaiKey = import.meta.env["VITE_OPENAI_API_KEY"];
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

	if (!response.ok) 
        throw new Error(response.toString() || 'Error transcribing the audio');

	const data = await response.json();

	return data.text;
}

