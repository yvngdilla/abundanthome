-- A sign-in attempt only becomes a profile once the email is confirmed (the person clicked the
-- sign-in link, or signed in with Google). Bots typing addresses into the sign-in form no longer
-- create profiles. Subscribing and buying still create a profile straight away (lib/profiles.ts).

create or replace function public.link_profile_to_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email is not null and new.email_confirmed_at is not null then
    insert into public.profiles (email, user_id) values (new.email, new.id)
    on conflict (email) do update set user_id = excluded.user_id;
  end if;
  return new;
exception when others then
  return new;
end $$;
revoke all on function public.link_profile_to_user() from public, anon, authenticated;
drop trigger if exists link_profile_to_user on auth.users;
create trigger link_profile_to_user after insert or update of email_confirmed_at on auth.users
  for each row execute function public.link_profile_to_user();
