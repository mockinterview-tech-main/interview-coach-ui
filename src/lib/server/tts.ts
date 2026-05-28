import { ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID } from '$env/static/private';

const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // "Sarah"

interface TTSOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
}

/**
 * Stream TTS audio from ElevenLabs.
 * Returns a ReadableStream of MP3 audio bytes.
 */
export async function textToSpeechStream(text: string, options: TTSOptions = {}): Promise<ReadableStream<Uint8Array>> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY not set');
  }

  const vid = options.voiceId || ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${vid}/stream`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: options.stability ?? 0.5,
        similarity_boost: options.similarityBoost ?? 0.75,
        style: options.style ?? 0.0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`ElevenLabs stream error ${response.status}: ${errBody}`);
  }

  if (!response.body) {
    throw new Error('ElevenLabs returned no body');
  }

  return response.body;
}

/**
 * Convert text to speech, returns full audio as ArrayBuffer.
 */
export async function textToSpeech(text: string, options: TTSOptions = {}): Promise<ArrayBuffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY not set');
  }

  const vid = options.voiceId || ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${vid}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: options.stability ?? 0.5,
        similarity_boost: options.similarityBoost ?? 0.75,
        style: options.style ?? 0.0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${errBody}`);
  }

  return response.arrayBuffer();
}
