import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
    const session = await locals.getSession();
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();
    const userId = session.user.id;

    if (action !== 'deduct' && action !== 'refund') {
        return json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get current credits
    const { data: profile } = await locals.supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

    if (!profile) {
        return json({ error: 'Profile not found' }, { status: 404 });
    }

    let newCredits = profile.credits;

    if (action === 'deduct') {
        if (newCredits <= 0) {
            return json({ error: 'No credits remaining' }, { status: 403 });
        }
        newCredits -= 1;
    } else if (action === 'refund') {
        // Only refund 1 credit — for failed session starts
        newCredits += 1;
    }

    await locals.supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', userId);

    return json({ credits: newCredits });
};
