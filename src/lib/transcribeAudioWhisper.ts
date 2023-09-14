export const transcribeAudioWithWhisperApi = async (audioBlob: Blob): Promise<string> => {
     const openaiKey = import.meta.env["VITE_OPENAI_API_KEY"];
	// Check if the size is less than 25MB
	if (audioBlob.size > 25 * 1024 * 1024) 
        throw new Error('Please upload an audio file less than 25MB');

	if (!openaiKey) 
        throw new Error("[ERROR] Unable to contact OpenAI")

	const wavFile = new File([audioBlob], 'recording.wav');
	const formData = new FormData();
	formData.append('file', wavFile);
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