-- Run this in your Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- Adds an atomic credit-deduction system + an append-only ledger for auditing.
-- Safe to run once; uses IF NOT EXISTS / CREATE OR REPLACE.

-- 1. Ledger — append-only record of every credit change (deduct / refund)
create table if not exists public.credit_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  session_id text,
  delta integer not null,          -- -1 for a deduction, +1 for a refund
  reason text not null,            -- 'session_start' | 'start_failed' | 'auto_refund_abandon' | 'manual_refund' | ...
  balance_after integer not null,  -- balance immediately after this change
  created_at timestamptz default now() not null
);

alter table public.credit_transactions enable row level security;

-- Users may read their own ledger (support / transparency). Inserts happen only
-- via the SECURITY DEFINER functions below, so no user INSERT policy is needed.
drop policy if exists "Users can read own credit transactions" on public.credit_transactions;
create policy "Users can read own credit transactions"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

create index if not exists credit_transactions_user_created_idx
  on public.credit_transactions (user_id, created_at desc);


-- 2. Atomic deduct — decrements 1 credit ONLY if the balance is > 0, in a single
--    guarded statement (no read-then-write race), and records the ledger row.
--    Returns the new balance, or -1 if the user had no credits.
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

  update public.profiles
    set credits = credits - 1
    where id = v_uid and credits > 0
    returning credits into v_new;

  if v_new is null then
    return -1;  -- no credits (or no profile row)
  end if;

  insert into public.credit_transactions (user_id, session_id, delta, reason, balance_after)
    values (v_uid, p_session_id, -1, 'session_start', v_new);

  return v_new;
end;
$$;


-- 3. Atomic refund — increments 1 credit and records the ledger row.
--    Returns the new balance.
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

  update public.profiles
    set credits = credits + 1
    where id = v_uid
    returning credits into v_new;

  if v_new is null then
    return -1;  -- no profile row
  end if;

  insert into public.credit_transactions (user_id, session_id, delta, reason, balance_after)
    values (v_uid, p_session_id, 1, coalesce(p_reason, 'manual_refund'), v_new);

  return v_new;
end;
$$;

grant execute on function public.deduct_credit(text) to authenticated;
grant execute on function public.refund_credit(text, text) to authenticated;
