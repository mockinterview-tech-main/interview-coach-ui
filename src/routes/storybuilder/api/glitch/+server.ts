import { json } from '@sveltejs/kit';
import { ALERT_SLACK_WEBHOOK } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
    const session = await locals.getSession();
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { sessionId, starSectionsFilled } = await request.json();
        if (!sessionId) {
            return json({ error: 'sessionId is required' }, { status: 400 });
        }

        const userId = session.user.id;
        const userEmail = session.user.email;

        // Update session log to glitch status
        await locals.supabase
            .from('session_logs')
            .update({ status: 'glitch', star_sections_filled: starSectionsFilled ?? null })
            .eq('session_id', sessionId);

        console.log(`[glitch] Story generation failed after retries: user=${userId} session=${sessionId}`);

        // Send Slack alert (fire and forget)
        if (ALERT_SLACK_WEBHOOK) {
            fetch(ALERT_SLACK_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: `🚨 *Story Generation Glitch*\n• User: ${userEmail}\n• Session: \`${sessionId}\`\n• Status: Failed after 2 retries — user is waiting for their story.`,
                }),
            }).catch(err => console.error('Slack alert failed:', err));
        }

        return json({ logged: true });
    } catch (err: any) {
        console.error('Glitch log error:', err);
        return json({ error: 'Failed to log glitch' }, { status: 500 });
    }
};
