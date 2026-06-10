import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
    const code = url.searchParams.get('code');

    if (code) {
        const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
        if (error) {
            console.error('OAuth callback error:', error.message);
            throw redirect(303, '/login');
        }
    }

    // After successful OAuth, ensure profile exists
    const { data: { session } } = await locals.supabase.auth.getSession();
    if (session) {
        const userId = session.user.id;
        const { data: existing } = await locals.supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (!existing) {
            await locals.supabase.from('profiles').insert({
                id: userId,
                credits: 0,
            });
        }
    }

    throw redirect(303, '/dashboard');
};
