-- Run once in the Supabase SQL Editor.
--
-- Stores the user's Stripe customer id so every checkout reuses ONE customer
-- instead of minting a new one each time (passing customer_email creates a new
-- Customer per checkout, which produced duplicates and broke subscription
-- lookups: customers.list({limit:1}) could return the customer WITHOUT the
-- subscription, so a paying subscriber looked like a free user and couldn't
-- even reach the cancel portal).
--
-- Users who purchased before this column existed simply have NULL and keep using
-- the email-lookup fallback; it self-heals on their next checkout.
alter table public.profiles add column if not exists stripe_customer_id text;

create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);
