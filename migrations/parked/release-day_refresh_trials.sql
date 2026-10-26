-- PARKED — run on RELEASE DAY (the day PR #19 reaches prod), before blast day.
--
-- The welcome-story trigger (011) has been live on prod since 2026-09-08, but
-- prod's code could not spend a trial story until the release. Every account
-- that signed up in between holds a trial row whose 30-day clock ran out, or
-- nearly, before they could use it. Reset each UNSPENT trial to 30 days from
-- today so the free story is real for them. Spent trials are left alone.

update public.purchases p
   set expires_at = now() + interval '30 days'
 where p.source = 'trial'
   and p.revoked_at is null
   and not exists (select 1 from public.story_consumptions c where c.purchase_id = p.id);

-- verify: every unspent trial now ends ~30 days out
-- select count(*), min(expires_at), max(expires_at) from purchases
--  where source = 'trial' and id not in (select purchase_id from story_consumptions);
