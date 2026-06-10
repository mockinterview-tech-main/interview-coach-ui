import type { Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createSupabaseServerClient(event.cookies);

    // Convenience helper — gets session without re-fetching if already cached
    event.locals.getSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession();
        return session;
    };

    const response = await resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range';
        },
    });

    return response;
};
