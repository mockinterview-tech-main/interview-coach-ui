import { GOOGLE_TTS_API_KEY } from '$env/static/private';

// Chirp 3: HD voice — en-US female, natural conversational tone
const DEFAULT_VOICE = 'en-US-Chirp3-HD-Leda';

interface TTSOptions {
  voice?: string;
  speakingRate?: number;
  pitch?: number;
}

/**
 * Convert text to speech using Google Cloud Chirp 3: HD.
 * Returns a ReadableStream of MP3 audio bytes.
 */
export async function textToSpeechStream(text: string, options: TTSOptions = {}): Promise<ReadableStream<Uint8Array>> {
  if (!GOOGLE_TTS_API_KEY) {
    throw new Error('GOOGLE_TTS_API_KEY not set');
  }

  const voice = options.voice || DEFAULT_VOICE;
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: voice,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: options.speakingRate ?? 1.0,
        pitch: options.pitch ?? 0.0,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Google TTS error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  // Google returns base64-encoded audio in audioContent
  const audioBytes = Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0));

  // Wrap in a ReadableStream to match existing interface
  return new ReadableStream({
    start(controller) {
      controller.enqueue(audioBytes);
      controller.close();
    }
  });
}

/**
 * Convert text to speech, returns full audio as ArrayBuffer.
 */
export async function textToSpeech(text: string, options: TTSOptions = {}): Promise<ArrayBuffer> {
  if (!GOOGLE_TTS_API_KEY) {
    throw new Error('GOOGLE_TTS_API_KEY not set');
  }

  const voice = options.voice || DEFAULT_VOICE;
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: voice,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: options.speakingRate ?? 1.0,
        pitch: options.pitch ?? 0.0,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Google TTS error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const audioBytes = Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0));
  return audioBytes.buffer;
}
