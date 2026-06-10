import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.getSession();
    if (session) {
        throw redirect(302, '/');
    }
    return {};
};

export const actions: Actions = {
    google: async ({ locals, url }) => {
        const { data, error } = await locals.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${url.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('[Google OAuth Error]:', error.message);
            return fail(500, { error: true, message: 'Failed to start Google login' });
        }

        if (data.url) {
            throw redirect(303, data.url);
        }
    },
};
