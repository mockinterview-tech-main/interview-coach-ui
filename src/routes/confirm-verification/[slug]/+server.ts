import { redirect } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { decodeJwt } from '$lib/jwt';

export const GET: RequestHandler = async ({ locals, url }: RequestEvent) => {
    const urlParts = url.toString().split('/')
    const token = urlParts[urlParts.length - 1]

    const verified = await locals.pb?.collection('users').confirmVerification(token);
    if (verified) {
        throw redirect(303, '/interview');
    }
    throw redirect(303, '/login');
}