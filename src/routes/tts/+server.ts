import type { RequestHandler } from "./$types";
const openaiKey = import.meta.env["VITE_OPENAI_API_KEY"];

export const POST: RequestHandler = async ({ request }) => {
    const {text, interviewer} = await request.json();
    let voice = "onyx"
    if (interviewer === "Lucy" || interviewer === "Kelly" || interviewer === "Judy") {
        voice = "nova"
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: "POST",
        headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({model: "tts-1", input: text, voice, speed: "1.1"})
    });

    const audioBuffer = await response.arrayBuffer();
    
    return new Response(audioBuffer, {
        headers: {
            'Content-Type': 'audio/mpeg'
        }
    });
}