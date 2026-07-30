import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSession, startSession } from '$lib/server/interview';
import { hasActiveSubscription } from '$lib/server/billing';

export const POST: RequestHandler = async ({ locals }) => {
  const authSession = await locals.getSession();
  if (!authSession) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = authSession.user.id;
  const email = authSession.user.email || '';
  const coachSession = createSession();

  // Determine entitlement server-side (authoritative — never trust the client).
  let subscriber = false;
  try {
    subscriber = await hasActiveSubscription(locals.supabase, userId, email);
  } catch (err: any) {
    // If Stripe is unreachable we cannot confirm entitlement. Fail closed rather
    // than risk giving a free session; the user can retry.
    console.error('Subscription check failed on start:', err.message);
    return json({ error: 'billing_unavailable' }, { status: 503 });
  }

  // Atomic credit deduction for non-subscribers. Happens BEFORE the expensive
  // startSession (Claude) call, so we never pay for Claude then fail to charge.
  let deducted = false;
  let newCredits: number | null = null;
  if (!subscriber) {
    const { data: result, error: deductError } = await locals.supabase.rpc('deduct_credit', {
      p_session_id: coachSession.id,
    });
    if (deductError) {
      console.error('deduct_credit RPC failed:', deductError.message);
      return json({ error: 'deduct_failed' }, { status: 500 });
    }
    if (result === -1) {
      return json({ error: 'no_credits' }, { status: 402 });
    }
    deducted = true;
    newCredits = result;
  }

  try {
    // Log session start BEFORE startSession so loadSession can find it on cold start
    const { error: insertError } = await locals.supabase.from('session_logs').insert({
      user_id: userId,
      session_id: coachSession.id,
      status: 'started',
    });
    if (insertError) console.error('Failed to log session start:', insertError.message);

    const firstMessage = await startSession(coachSession.id, locals.supabase);

    return json({
      sessionId: coachSession.id,
      message: firstMessage,
      credits: newCredits, // null for subscribers; new balance otherwise
    });
  } catch (err: any) {
    console.error('Error starting session:', err);
    // Session creation failed after we charged — refund atomically, server-side.
    if (deducted) {
      const { error: refundError } = await locals.supabase.rpc('refund_credit', {
        p_session_id: coachSession.id,
        p_reason: 'start_failed',
      });
      if (refundError) console.error('refund_credit RPC failed after start error:', refundError.message);
    }
    return json({ error: 'start_failed' }, { status: 500 });
  }
};
