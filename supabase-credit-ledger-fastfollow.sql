-- Fast-follow to supabase-credit-ledger.sql. Run once in the Supabase SQL Editor.
-- Makes the ledger COMPLETE and reconcilable: logs purchases (the main inflow) and
-- gives support a proper, logged manual-refund path. Additive + idempotent.

-- 1. External reference column (e.g. Stripe checkout session id) on the ledger.
alter table public.credit_transactions add column if not exists reference text;


-- 2. Purchase credit grant — atomic + idempotent on the Stripe checkout session id,
--    and writes a 'purchase' ledger row so sum(deltas) == profiles.credits.
--    Idempotency: if this stripe session was already applied, it no-ops (returns -1).
create or replace function public.grant_purchase_credits(p_amount integer, p_stripe_session_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_new integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'amount must be positive';
  end if;

  update public.profiles
    set credits = credits + p_amount,
        last_stripe_session_id = p_stripe_session_id
    where id = v_uid
      and coalesce(last_stripe_session_id, '') is distinct from coalesce(p_stripe_session_id, '')
    returning credits into v_new;

  if v_new is null then
    return -1;  -- already applied this stripe session (replay) or no profile row
  end if;

  insert into public.credit_transactions (user_id, session_id, delta, reason, balance_after, reference)
    values (v_uid, null, p_amount, 'purchase', v_new, p_stripe_session_id);

  return v_new;
end;
$$;

grant execute on function public.grant_purchase_credits(integer, text) to authenticated;


-- 3. Admin manual refund — grants credits to ANY user and logs a 'manual_refund'
--    row. Restricted to service_role (and the SQL editor), never callable by users.
create or replace function public.admin_refund_credit(p_user_id uuid, p_amount integer, p_reason text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new integer;
begin
  if p_user_id is null then
    raise exception 'user id required';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'amount must be positive';
  end if;

  update public.profiles
    set credits = credits + p_amount
    where id = p_user_id
    returning credits into v_new;

  if v_new is null then
    return -1;  -- no such profile
  end if;

  insert into public.credit_transactions (user_id, session_id, delta, reason, balance_after)
    values (p_user_id, null, p_amount, coalesce(p_reason, 'manual_refund'), v_new);

  return v_new;
end;
$$;

-- Lock it down: only service_role (server with the service key) and the SQL editor.
revoke execute on function public.admin_refund_credit(uuid, integer, text) from public;
revoke execute on function public.admin_refund_credit(uuid, integer, text) from anon;
revoke execute on function public.admin_refund_credit(uuid, integer, text) from authenticated;


-- 4. Safety net: log ANY credit change the RPCs didn't already record.
--    This makes hand-editing profiles.credits in the Supabase table editor safe —
--    the change still lands in the ledger, so sum(deltas) stays reconcilable.
--    How it works: the RPCs insert their ledger row inside the same transaction as
--    the update, so by the time this trigger fires the matching row already exists.
--    A raw edit has no such row, and gets logged as 'manual_adjustment'.
create or replace function public.log_manual_credit_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_delta integer := new.credits - old.credits;
  v_logged integer;
begin
  if v_delta = 0 then
    return new;
  end if;

  -- Did an RPC in this same transaction already log this exact change?
  select count(*) into v_logged
  from public.credit_transactions
  where user_id = new.id
    and balance_after = new.credits
    and delta = v_delta
    and created_at > now() - interval '5 seconds';

  if v_logged = 0 then
    insert into public.credit_transactions (user_id, session_id, delta, reason, balance_after)
      values (new.id, null, v_delta, 'manual_adjustment', new.credits);
  end if;

  return new;
end;
$$;

drop trigger if exists on_profiles_credits_changed on public.profiles;
create trigger on_profiles_credits_changed
  after update of credits on public.profiles
  for each row
  when (old.credits is distinct from new.credits)
  execute function public.log_manual_credit_change();
