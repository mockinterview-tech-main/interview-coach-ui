-- PARKED — run ONLY on "blast day", the day Yijun emails existing users
-- (after resumability + Deepgram ship). NOT part of the numbered sequence.
--
-- Decided 2026-09-09: every EXISTING profile gets one free story, 30 days from
-- today — the same welcome story a new signup gets from the trigger in 011 —
-- regardless of how many session credits they held. Credits are then zeroed in
-- the same run. Nothing else is converted; legacy stories are already past
-- their window ($6 to reopen).
--
-- Idempotent: a profile that already has a welcome/trial row is skipped, so a
-- re-run cannot grant twice.

insert into public.purchases (user_id, kind, stories_allowed, source, note, expires_at)
select p.id, 'single_story', 1, 'trial', 'welcome story (blast day)', now() + interval '30 days'
  from public.profiles p
 where not exists (
   select 1 from public.purchases x where x.user_id = p.id and x.source = 'trial'
 );

-- Zero every remaining session credit. The audit trigger logs each as a
-- 'manual_adjustment' ledger row, which is the correct record of retirement.
update public.profiles set credits = 0 where credits > 0;

-- verify:
-- select count(*) from purchases where source = 'trial' and note like '%blast day%';  -- number of profiles without a prior trial
-- select count(*) from profiles where credits > 0;                                   -- 0

-- ── Signups between 2026-09-08 and blast day ───────────────────────────────
-- The welcome-story trigger (011) gave each of them a trial row, but prod could
-- not spend it until the release, so the 30-day clock ran out unused. Reset
-- every UNSPENT trial to 30 days from today — the same free story as everyone
-- else, on the same clock as the announcement. Spent trials are untouched.
update public.purchases p
   set expires_at = now() + interval '30 days'
 where p.source = 'trial'
   and p.revoked_at is null
   and not exists (select 1 from public.story_consumptions c where c.purchase_id = p.id);
