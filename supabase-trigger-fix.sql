-- Run once in the Supabase SQL Editor. Fixes double-logging.
--
-- Bug: the log_manual_credit_change trigger is AFTER UPDATE FOR EACH ROW, which in
-- Postgres fires at the end of the UPDATE statement — BEFORE the RPC gets to insert
-- its own ledger row. The "did an RPC already log this?" lookup therefore always
-- found nothing, so every RPC-driven change ALSO wrote a bogus 'manual_adjustment'.
--
-- Fix: the RPCs now set a transaction-local flag, and the trigger skips when it sees
-- it. Deterministic, no timing assumptions. Direct table edits (no flag) still log.

-- 1. Trigger: skip when a credit RPC is doing the work.
create or replace function public.log_manual_credit_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_delta integer := new.credits - old.credits;
begin
  if v_delta = 0 then
    return new;
  end if;

  -- An RPC in this transaction already logs its own ledger row.
  if coalesce(current_setting('app.credit_rpc', true), '') = 'on' then
    return new;
  end if;

  insert into public.credit_transactions (user_id, session_id, delta, reason, balance_after)
    values (new.id, null, v_delta, 'manual_adjustment', new.credits);

  return new;
end;
$$;


-- 2. Re-create the three RPCs, each setting the transaction-local flag first.
create or replace function public.deduct_credit(p_session_id text)
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

  perform set_config('app.credit_rpc', 'on', true);

  update public.profiles
    set credits = credits - 1
    where id = v_uid and credits > 0
    returning credits into v_new;

  if v_new is null then
    return -1;
  end if;

  insert into public.credit_transactions (user_id, session_id, delta, reason, balance_after)
    values (v_uid, p_session_id, -1, 'session_start', v_new);

  return v_new;
end;
$$;

create or replace function public.refund_credit(p_session_id text, p_reason text)
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

  perform set_config('app.credit_rpc', 'on', true);

  update public.profiles
    set credits = credits + 1
    where id = v_uid
    returning credits into v_new;

  if v_new is null then
    return -1;
  end if;

  insert into public.credit_transactions (user_id, session_id, delta, reason, balance_after)
    values (v_uid, p_session_id, 1, coalesce(p_reason, 'manual_refund'), v_new);

  return v_new;
end;
$$;

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

  perform set_config('app.credit_rpc', 'on', true);

  update public.profiles
    set credits = credits + p_amount,
        last_stripe_session_id = p_stripe_session_id
    where id = v_uid
      and coalesce(last_stripe_session_id, '') is distinct from coalesce(p_stripe_session_id, '')
    returning credits into v_new;

  if v_new is null then
    return -1;  -- replay of an already-applied stripe session
  end if;

  insert into public.credit_transactions (user_id, session_id, delta, reason, balance_after, reference)
    values (v_uid, null, p_amount, 'purchase', v_new, p_stripe_session_id);

  return v_new;
end;
$$;

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

  perform set_config('app.credit_rpc', 'on', true);

  update public.profiles
    set credits = credits + p_amount
    where id = p_user_id
    returning credits into v_new;

  if v_new is null then
    return -1;
  end if;

  insert into public.credit_transactions (user_id, session_id, delta, reason, balance_after)
    values (p_user_id, null, p_amount, coalesce(p_reason, 'manual_refund'), v_new);

  return v_new;
end;
$$;

grant execute on function public.deduct_credit(text) to authenticated;
grant execute on function public.refund_credit(text, text) to authenticated;
grant execute on function public.grant_purchase_credits(integer, text) to authenticated;
revoke execute on function public.admin_refund_credit(uuid, integer, text) from public;
revoke execute on function public.admin_refund_credit(uuid, integer, text) from anon;
revoke execute on function public.admin_refund_credit(uuid, integer, text) from authenticated;


-- 3. Clean up the bogus rows this bug already created: any 'manual_adjustment'
--    that has a real RPC row for the same user, delta and balance within a second.
delete from public.credit_transactions ma
where ma.reason = 'manual_adjustment'
  and exists (
    select 1 from public.credit_transactions x
    where x.user_id = ma.user_id
      and x.delta = ma.delta
      and x.balance_after = ma.balance_after
      and x.reason <> 'manual_adjustment'
      and abs(extract(epoch from (x.created_at - ma.created_at))) < 2
  );
