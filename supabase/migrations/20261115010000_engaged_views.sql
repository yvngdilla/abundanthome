-- Bot filter for first-party analytics.
-- A page load is recorded with engaged = false; it flips to true once the page has been visible for
-- about 3 seconds or the person scrolls, taps or types. The dashboard counts only engaged views, so
-- scanners and link previews that load a page and leave are left out. Rows from before this change
-- keep engaged = null and still count. automated = the browser reported itself as automated
-- (navigator.webdriver).
alter table public.page_views add column if not exists view_key text;
alter table public.page_views add column if not exists engaged boolean;
alter table public.page_views add column if not exists automated boolean not null default false;
create index if not exists page_views_view_key_idx on public.page_views (view_key);
