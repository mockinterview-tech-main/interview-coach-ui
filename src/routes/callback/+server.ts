import { redirect } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { decodeJwt } from '$lib/jwt';

export const GET: RequestHandler = async ({ locals, url, cookies }: RequestEvent) => {
    const redirectURL = `${url.origin}/callback`;
    const expectedState = cookies.get('state');
    const codeVerifier = cookies.get('cv');
    const providerName = cookies.get('prov');

    const query = new URLSearchParams(url.search);
    const state = query.get('state');
    const code = query.get('code');

    const authMethods = await locals.pb?.collection('users').listAuthMethods();
    if (!authMethods?.authProviders) {
        console.log('authy providers');
        throw redirect(303, '/login');
    }
    const provider = authMethods.authProviders.find(p => p.name == providerName);

    if (!provider) {
        console.log('Provider not found');
        throw redirect(303, '/login');
    }

    if (expectedState !== state) {
        console.log('state does not match expected', expectedState, state);
        throw redirect(303, '/login');
    }

    try {
        let { meta } = await locals.pb?.collection('users')
            .authWithOAuth2Code(providerName || '', code || '', codeVerifier || '', redirectURL);
        const currentUserToken = decodeJwt(locals.pb?.authStore.token || '');
        if (currentUserToken){
            let userData: { name: string; avatarUrl: string; credits?: number } = {
                name: meta.name.split(" ")[0],
                avatarUrl: meta.avatarUrl,
            };
            locals.pb?.collection('users').update(currentUserToken.id, userData)
        }
    } catch (err) {
        console.log('Error logging in with OAuth user', err);
    } finally {
        throw redirect(303, '/interview');
    }
};
