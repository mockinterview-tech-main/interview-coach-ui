import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.getSession();
    if (!session) {
        return { stories: [] };
    }

    const { data: stories, error } = await locals.supabase
        .from('stories')
        .select('id, question, full_story, talking_points, strength_signals, flags, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading stories:', error);
        return { stories: [] };
    }

    return { stories: stories || [] };
};
