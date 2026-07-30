-- Run once in the Supabase SQL Editor.
-- Marks each saved story as 'complete' (all four STAR sections interview-ready)
-- or 'partial' (real work captured, but not a finished story). Lets the Story Bank
-- keep incomplete sessions the user paid for, while showing them distinctly.
alter table public.stories add column if not exists tier text;
