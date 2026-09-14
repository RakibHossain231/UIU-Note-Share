-- ============================================================
-- UIU NOTE SHARE - SUPABASE DATABASE SCHEMA
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ============================================================

-- 1. COURSES TABLE
create table if not exists public.courses (
  id text primary key,
  code text not null,
  title text not null,
  abbr text,
  department text not null,
  trimester integer not null,
  color text default '#FF6600',
  description text,
  credit numeric default 3,
  created_at timestamp with time zone default now()
);

-- 2. CONTRIBUTORS TABLE
create table if not exists public.contributors (
  id text primary key,
  name text not null,
  department text not null,
  batch text,
  avatar_url text,
  social_url text,
  social_type text default 'facebook',
  contributions_count integer default 0,
  created_at timestamp with time zone default now()
);

-- 3. RESOURCES TABLE (Notes, CTs, Exam Solves)
create table if not exists public.resources (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  department text not null,
  type text not null,
  title text not null,
  description text,
  trimester_code text,
  term text,
  ct_number integer,
  assignment_number integer,
  storage_type text not null default 'drive',
  file_url text not null,
  has_solution boolean default false,
  solution_url text,
  file_size text,
  upload_date text,
  contributor_id text references public.contributors(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- 4. NOTE REQUESTS TABLE
create table if not exists public.note_requests (
  id text primary key,
  course_code text not null,
  course_title text not null,
  resource_type text not null,
  requested_by text not null,
  contact_info text,
  notes text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- 5. CREATOR PROFILE TABLE
create table if not exists public.creator_profile (
  id text primary key default 'creator',
  name text not null default 'Rakib Hossain',
  department text not null default 'CSE',
  batch text default 'Batch 231',
  avatar_url text default 'https://github.com/RakibHossain231.png',
  bio text,
  github_url text default 'https://github.com/RakibHossain231',
  linkedin_url text default 'https://www.linkedin.com/in/rakibhossain231',
  facebook_url text default 'https://www.facebook.com/RakibHossain231',
  email text default 'rakibhossain0308@yahoo.com',
  updated_at timestamp with time zone default now()
);

-- Insert Default Creator Profile
insert into public.creator_profile (id, name, department, batch, avatar_url, github_url, linkedin_url, facebook_url, email)
values (
  'creator',
  'Rakib Hossain',
  'CSE',
  'Batch 231',
  'https://github.com/RakibHossain231.png',
  'https://github.com/RakibHossain231',
  'https://www.linkedin.com/in/rakibhossain231',
  'https://www.facebook.com/RakibHossain231',
  'rakibhossain0308@yahoo.com'
)
on conflict (id) do nothing;

-- Insert Founding Contributor
insert into public.contributors (id, name, department, batch, avatar_url, social_url, social_type, contributions_count)
values (
  'rakib-231',
  'Rakib Hossain',
  'CSE',
  'Batch 231',
  'https://github.com/RakibHossain231.png',
  'https://github.com/RakibHossain231',
  'github',
  0
)
on conflict (id) do nothing;

-- Enable Row Level Security (RLS)
alter table public.courses enable row level security;
alter table public.contributors enable row level security;
alter table public.resources enable row level security;
alter table public.note_requests enable row level security;
alter table public.creator_profile enable row level security;

-- Open Read/Write Policies for Web App
drop policy if exists "Enable all for courses" on public.courses;
create policy "Enable all for courses" on public.courses for all using (true) with check (true);

drop policy if exists "Enable all for contributors" on public.contributors;
create policy "Enable all for contributors" on public.contributors for all using (true) with check (true);

drop policy if exists "Enable all for resources" on public.resources;
create policy "Enable all for resources" on public.resources for all using (true) with check (true);

drop policy if exists "Enable all for note_requests" on public.note_requests;
create policy "Enable all for note_requests" on public.note_requests for all using (true) with check (true);

drop policy if exists "Enable all for creator_profile" on public.creator_profile;
create policy "Enable all for creator_profile" on public.creator_profile for all using (true) with check (true);

-- 6. SITE STATS TABLE (Visitors, Counter)
create table if not exists public.site_stats (
  key text primary key,
  value bigint not null default 0,
  updated_at timestamp with time zone default now()
);

-- Insert Initial Visitor Stat
insert into public.site_stats (key, value)
values ('total_visitors', 1420)
on conflict (key) do nothing;

alter table public.site_stats enable row level security;

drop policy if exists "Enable all for site_stats" on public.site_stats;
create policy "Enable all for site_stats" on public.site_stats for all using (true) with check (true);

