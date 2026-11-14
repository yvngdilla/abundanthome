-- Browsers that have opened the admin (Nancy's, Colston's). Their visits and downloads are left out of the dashboard.
-- Server only, like the other tables: RLS on, no policies.
create table if not exists public.staff_visitors (
  id text primary key,
  marked_at timestamptz not null default now()
);
alter table public.staff_visitors enable row level security;
