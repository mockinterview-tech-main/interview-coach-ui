import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
    const session = await locals.getSession();
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { topic, sessionId, description } = await request.json();

        if (!topic || !description?.trim()) {
            return json({ error: 'Topic and description are required' }, { status: 400 });
        }

        const userId = session.user.id;
        const userEmail = session.user.email;

        const { error } = await locals.supabase
            .from('support_requests')
            .insert({
                user_id: userId,
                user_email: userEmail,
                topic,
                session_id: sessionId || null,
                description: description.trim(),
            });

        if (error) {
            console.error('Failed to save support request:', error.message);
            return json({ error: 'Failed to submit request' }, { status: 500 });
        }

        return json({ success: true });
    } catch (err: any) {
        console.error('Support request error:', err);
        return json({ error: 'Failed to submit request' }, { status: 500 });
    }
};
