import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
    const session = await locals.getSession();
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { session_id, question, full_story, talking_points, strength_signals, flags } = await request.json();

        const { data, error } = await locals.supabase.from('stories').insert({
            user_id: session.user.id,
            session_id: session_id || null,
            question: question || null,
            full_story: full_story || null,
            talking_points: talking_points || null,
            strength_signals: strength_signals || null,
            flags: flags || null,
        }).select('id').single();

        if (error) {
            console.error('Error saving story:', error);
            return json({ error: 'Failed to save story' }, { status: 500 });
        }

        return json({ id: data.id, saved: true });
    } catch (err: any) {
        console.error('Save story error:', err);
        return json({ error: 'Failed to save story' }, { status: 500 });
    }
};
