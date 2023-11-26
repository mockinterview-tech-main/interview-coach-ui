import { decodeJwt } from '$lib/jwt';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
     const currentUserToken = decodeJwt(locals.pb?.authStore.token || '');
    if (currentUserToken){
        let currentUser = await locals.pb?.collection('users').getOne(currentUserToken.id);
        if (currentUser){
            const req = await request.json();
            if (req.action == "deduct"){
                locals.pb?.collection('users').update(currentUserToken.id, { nonce: '', credits: (currentUser.credits - 1)});
            }
            if (req.action == "add") {
                locals.pb?.collection('users').update(currentUserToken.id, { nonce: '', credits: (currentUser.credits + 1)});
            }
        }
    }
	return json('');
};