import { transcribeAudioWithWhisperApi } from "$lib/transcribeAudioWhisper";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.blob()
    const text = await transcribeAudioWithWhisperApi(data);
    return json({text})
}