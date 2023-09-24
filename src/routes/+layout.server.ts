import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { decodeJwt } from '$lib/jwt';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const protectedRoutes = ['interview', 'summary']

    if (!locals.pb?.authStore.isValid && protectedRoutes.includes(url.pathname.split("/").filter(Boolean)[0])) {
        throw redirect(302, '/login')
    }
    
    const currentUserToken = decodeJwt(locals.pb?.authStore.token || '');
    if (currentUserToken){
        const currentUser = await locals.pb?.collection('users').getOne(currentUserToken.id);
        if (currentUser){
            return {
                loggedIn: locals.pb?.authStore.isValid,
                credits: currentUser?.credits
            }
        }
    }
    return {
        loggedIn: false
    }
};
