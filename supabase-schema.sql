-- Run this in your Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- This creates the tables needed for mockinterview.tech

-- 1. Profiles table — stores user credits & metadata
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  credits integer default 0 not null,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Service can insert profiles"
  on public.profiles for insert
  with check (auth.uid() = id);


-- 2. Stories table — stores completed STAR coaching sessions
--    Matches what the storybuilder report page displays:
--    - question: the behavioral interview question this story answers
--    - full_story: the polished 3-5 min answer (first person)
--    - situation/task/action/result: individual STAR sections from coaching
--    - talking_points: JSON bullet-point anchors per section
--    - scorecard: full report JSON (if generated via endSession)
create table if not exists public.stories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  question text,
  full_story text,
  situation text,
  task text,
  action text,
  result text,
  talking_points jsonb,
  created_at timestamptz default now() not null
);

alter table public.stories enable row level security;

create policy "Users can read own stories"
  on public.stories for select
  using (auth.uid() = user_id);

create policy "Users can insert own stories"
  on public.stories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own stories"
  on public.stories for update
  using (auth.uid() = user_id);

create policy "Users can delete own stories"
  on public.stories for delete
  using (auth.uid() = user_id);


-- 3. Auto-create profile on signup (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, credits)
  values (new.id, 0);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
