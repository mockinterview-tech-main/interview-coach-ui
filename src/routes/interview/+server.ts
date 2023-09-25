import { decodeJwt } from '$lib/jwt';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
     const currentUserToken = decodeJwt(locals.pb?.authStore.token || '');
    if (currentUserToken){
        let currentUser = await locals.pb?.collection('users').getOne(currentUserToken.id);
        if (currentUser){
            locals.pb?.collection('users').update(currentUserToken.id, { nonce: '', credits: (currentUser.credits - 1)});
        }
    }
	return json('');
};