import { json } from '@sveltejs/kit';
import { KIT_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

// Kit's numeric form ID for "resumegateframework" — not secret, visible in the
// Kit dashboard. The API key is what must stay server-side: it can read
// account info and create subscribers, so it never goes to the browser.
const KIT_FORM_ID = 9783976;

// Nobody signs up four times in ten minutes. This is per-isolate and resets
// whenever the edge function goes cold, so it is a speed bump rather than a
// real limiter — enough to stop a naive loop, not a distributed one. If this
// page ever gets seriously targeted, move the counter to a shared store.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
	const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
	recent.push(now);
	hits.set(ip, recent);

	// Keep the map from growing without bound on a long-lived isolate.
	if (hits.size > 5000) {
		for (const [key, times] of hits) {
			if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
		}
	}

	return recent.length > MAX_PER_WINDOW;
}

// Deliberately permissive — the goal is to reject obvious junk before it costs
// a Kit API call, not to adjudicate what a valid address is.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: RequestHandler = async ({ request, getClientAddress, url }) => {
	// Requests that didn't come from our own page. Trivial to forge, but it
	// filters anything pointed at the endpoint directly without effort.
	const origin = request.headers.get('origin');
	if (origin && new URL(origin).host !== url.host) {
		return json({ error: 'Bad origin' }, { status: 403 });
	}

	let body: { email?: unknown; company?: unknown };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Bad request' }, { status: 400 });
	}

	// Honeypot. The form renders a hidden "company" field that a person never
	// sees and never fills. Anything that fills it gets a cheerful 200 and goes
	// nowhere — telling a bot it failed only teaches it to try again.
	if (typeof body.company === 'string' && body.company.trim() !== '') {
		return json({ ok: true });
	}

	const email = typeof body.email === 'string' ? body.email.trim() : '';
	if (!email || email.length > 254 || !EMAIL.test(email)) {
		return json({ error: 'Email required' }, { status: 400 });
	}

	if (rateLimited(getClientAddress(), Date.now())) {
		return json({ error: 'Too many attempts — try again later.' }, { status: 429 });
	}

	const headers = {
		'X-Kit-Api-Key': KIT_API_KEY,
		'Content-Type': 'application/json'
	};

	const subscriberRes = await fetch('https://api.kit.com/v4/subscribers', {
		method: 'POST',
		headers,
		body: JSON.stringify({ email_address: email })
	});
	if (!subscriberRes.ok) {
		return json({ error: 'Subscribe failed' }, { status: 502 });
	}
	const { subscriber } = await subscriberRes.json();

	const formRes = await fetch(
		`https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers/${subscriber.id}`,
		{ method: 'POST', headers }
	);
	if (!formRes.ok) {
		return json({ error: 'Form association failed' }, { status: 502 });
	}

	return json({ ok: true });
};
