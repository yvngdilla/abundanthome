-- Profiles: one row per person (keyed on email), the anchor for everything we know about someone.
-- A profile is created the first time an email subscribes, buys or signs in; user_id is set if they
-- ever make an account. Visitors (one row per browser) sit underneath: most traffic is anonymous, and
-- a visitor is linked to a profile the moment that browser signs up or buys.
--
--   profiles 1--n subscribers, orders, email_sends
--   profiles 1--n visitors 1--n page_views, downloads
--   orders   1--n downloads (paid workbook files)
--
-- Additive only: existing columns (email, stripe_session_id, visitor_id) stay, so older code keeps working.
-- RLS is on with no policies, like every other table: only the server (service role) reads or writes.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email extensions.citext not null unique,
  user_id uuid unique references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Visitors: who the browser is, and which profile it belongs to once known.
alter table public.visitors add column if not exists kind text not null default 'human';
do $$ begin
  alter table public.visitors add constraint visitors_kind_check check (kind in ('human', 'bot', 'staff'));
exception when duplicate_object then null; end $$;
alter table public.visitors add column if not exists profile_id uuid references public.profiles (id) on delete set null;
create index if not exists visitors_profile_idx on public.visitors (profile_id);

-- Links from the existing tables.
alter table public.subscribers add column if not exists profile_id uuid references public.profiles (id) on delete cascade;
alter table public.orders add column if not exists profile_id uuid references public.profiles (id) on delete set null;
alter table public.orders add column if not exists visitor_id text;
alter table public.email_sends add column if not exists profile_id uuid references public.profiles (id) on delete cascade;
alter table public.downloads add column if not exists order_id bigint references public.orders (id) on delete cascade;
create index if not exists subscribers_profile_idx on public.subscribers (profile_id);
create index if not exists orders_profile_idx on public.orders (profile_id);
create index if not exists orders_visitor_idx on public.orders (visitor_id);
create index if not exists email_sends_profile_idx on public.email_sends (profile_id);
create index if not exists downloads_order_idx on public.downloads (order_id);
create index if not exists downloads_visitor_idx on public.downloads (visitor_id);
create index if not exists subscribers_visitor_idx on public.subscribers (visitor_id);

-- Backfill ---------------------------------------------------------------------------------------

-- Staff browsers become visitors of kind 'staff' (the staff_visitors table is kept for now, unused by the dashboard).
insert into public.visitors (id, first_seen, kind)
  select id, marked_at, 'staff' from public.staff_visitors
  on conflict (id) do update set kind = 'staff';

-- Browsers that reported being automated, or whose every page load was left unconfirmed, are bots.
update public.visitors v set kind = 'bot'
  where v.kind = 'human'
    and exists (select 1 from public.page_views p where p.visitor_id = v.id)
    and not exists (select 1 from public.page_views p where p.visitor_id = v.id and p.engaged is distinct from false and not p.automated);

-- One profile per email we already know, oldest sighting first.
insert into public.profiles (email, created_at)
  select email, min(created_at) from (
    select email, created_at from public.subscribers
    union all select email, created_at from public.orders where email is not null
    union all select email, sent_at from public.email_sends
    union all select email::extensions.citext, created_at from auth.users where email is not null
  ) e group by email
  on conflict (email) do nothing;
update public.profiles p set user_id = u.id from auth.users u where u.email::extensions.citext = p.email and p.user_id is null;

update public.subscribers s set profile_id = p.id from public.profiles p where p.email = s.email and s.profile_id is null;
update public.orders o set profile_id = p.id from public.profiles p where p.email = o.email and o.profile_id is null;
update public.email_sends e set profile_id = p.id from public.profiles p where p.email = e.email and e.profile_id is null;
update public.downloads d set order_id = o.id from public.orders o where o.stripe_session_id = d.stripe_session_id and d.order_id is null;

-- Ids that point at no visitor row are cleared before the foreign keys go on.
update public.subscribers s set visitor_id = null where visitor_id is not null and not exists (select 1 from public.visitors v where v.id = s.visitor_id);
update public.downloads d set visitor_id = null where visitor_id is not null and not exists (select 1 from public.visitors v where v.id = d.visitor_id);
insert into public.visitors (id, first_seen, first_path, country, device)
  select distinct on (visitor_id) visitor_id, created_at, path, country, device from public.page_views p
  where not exists (select 1 from public.visitors v where v.id = p.visitor_id)
  order by visitor_id, created_at
  on conflict (id) do nothing;

-- A browser that signed up belongs to that profile.
update public.visitors v set profile_id = s.profile_id from public.subscribers s
  where s.visitor_id = v.id and s.profile_id is not null and v.profile_id is null;

-- Foreign keys from the id columns that were plain text until now.
do $$ begin
  alter table public.page_views add constraint page_views_visitor_fk foreign key (visitor_id) references public.visitors (id) on delete cascade;
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.downloads add constraint downloads_visitor_fk foreign key (visitor_id) references public.visitors (id) on delete set null;
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.subscribers add constraint subscribers_visitor_fk foreign key (visitor_id) references public.visitors (id) on delete set null;
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.orders add constraint orders_visitor_fk foreign key (visitor_id) references public.visitors (id) on delete set null;
exception when duplicate_object then null; end $$;

-- New accounts get a profile (or claim the one their email already has). Never blocks a sign-up.
create or replace function public.link_profile_to_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email is not null then
    insert into public.profiles (email, user_id) values (new.email, new.id)
    on conflict (email) do update set user_id = excluded.user_id;
  end if;
  return new;
exception when others then
  return new;
end $$;
revoke all on function public.link_profile_to_user() from public, anon, authenticated;
drop trigger if exists link_profile_to_user on auth.users;
create trigger link_profile_to_user after insert on auth.users
  for each row execute function public.link_profile_to_user();
