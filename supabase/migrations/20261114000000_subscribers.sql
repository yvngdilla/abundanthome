-- Email sign-ups for the proof of concept.
create schema if not exists extensions;
create extension if not exists citext with schema extensions;

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email extensions.citext not null,
  list text not null check (list in ('declutter-challenge', 'vision-board')),
  source_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now(),
  unique (email, list)
);

create index if not exists subscribers_created_at_idx on public.subscribers (created_at desc);

-- Only the server (service role) reads or writes this table. No public policies.
alter table public.subscribers enable row level security;
