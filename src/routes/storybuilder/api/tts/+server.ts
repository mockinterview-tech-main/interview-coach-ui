import type { RequestHandler } from './$types';
import { textToSpeechStream } from '$lib/server/tts';

export const POST: RequestHandler = async ({ locals, request }) => {
  const session = await locals.getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { text } = await request.json();
    if (!text) {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const audioStream = await textToSpeechStream(text);

    return new Response(audioStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      }
    });
  } catch (err: any) {
    console.error('TTS error:', err.message);
    return new Response(JSON.stringify({ error: 'TTS failed', message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
