-- First-party analytics for the admin dashboard: page views, downloads, and where sign-ups come from.
-- No IP addresses are stored. visitor_id is a random id kept in the visitor's browser (localStorage).
-- Like the other tables, RLS is on with no policies: only the server (service role) can read or write.

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  visitor_id text not null,
  path text not null,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  country text,
  region text,
  city text,
  device text,
  created_at timestamptz not null default now()
);
alter table public.page_views enable row level security;
create index if not exists page_views_created_idx on public.page_views (created_at);
create index if not exists page_views_visitor_idx on public.page_views (visitor_id, created_at);

-- One row per visitor: when and how they first arrived. Lets the dashboard tell new visitors from returning ones.
create table if not exists public.visitors (
  id text primary key,
  first_seen timestamptz not null default now(),
  first_path text,
  first_referrer_host text,
  first_utm_source text,
  country text,
  device text
);
alter table public.visitors enable row level security;
create index if not exists visitors_first_seen_idx on public.visitors (first_seen);

-- Free template downloads (kind = 'template') and paid workbook files (kind = 'workbook').
create table if not exists public.downloads (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('template', 'workbook')),
  item text not null,
  file text,
  visitor_id text,
  stripe_session_id text,
  created_at timestamptz not null default now()
);
alter table public.downloads enable row level security;
create index if not exists downloads_created_idx on public.downloads (created_at);

-- Where each sign-up came from, geographically and by device.
alter table public.subscribers add column if not exists country text;
alter table public.subscribers add column if not exists region text;
alter table public.subscribers add column if not exists city text;
alter table public.subscribers add column if not exists device text;
alter table public.subscribers add column if not exists visitor_id text;
alter table public.subscribers add column if not exists landing_path text;
