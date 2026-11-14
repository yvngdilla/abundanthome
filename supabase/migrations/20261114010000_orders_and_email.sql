-- Orders from Stripe Checkout, a log of every email sent, and unsubscribes.
-- All tables are written only by the server with the service role key: RLS is on and there are no policies,
-- so the public anon key can read or write nothing.

alter table public.subscribers add column if not exists unsubscribed_at timestamptz;

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  stripe_session_id text not null unique,
  email extensions.citext,
  product text not null,
  amount_cents integer,
  currency text,
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create index if not exists orders_email_idx on public.orders (email);

-- One row per email per person. resend_id is null when an overdue email was skipped instead of sent.
create table if not exists public.email_sends (
  id bigint generated always as identity primary key,
  email extensions.citext not null,
  email_key text not null,
  list text,
  resend_id text,
  sent_at timestamptz not null default now(),
  unique (email, email_key)
);
alter table public.email_sends enable row level security;
