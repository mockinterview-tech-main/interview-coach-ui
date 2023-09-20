import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const protectedRoutes = ['interview', 'summary']

    console.log(url.pathname.split("/").filter(Boolean)[0])
    if (!locals.pb?.authStore.isValid && protectedRoutes.includes(url.pathname.split("/").filter(Boolean)[0])) {
        throw redirect(302, '/login')
    }
};
