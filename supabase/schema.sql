-- SBI EDM Approval: database, security rules and screenshot storage.
-- Paste this whole file into Supabase > SQL Editor and click Run.
-- It is safe to run again: every statement checks whether the object exists first.

-- ============================================================
-- 1. Reviewers (Group Digital Marketing)
--    Everyone whose login email is in this table can see every ticket
--    and approve, send back or mark tickets as scheduled.
-- ============================================================
create table if not exists public.reviewers (
  email text primary key,
  added_at timestamptz not null default now()
);
alter table public.reviewers enable row level security;
-- role: 'admin' (super admin) manages reviewers and hotel access; 'reviewer' manages hotel access only
alter table public.reviewers add column if not exists role text not null default 'reviewer';
alter table public.reviewers add column if not exists added_by text;
do $$ begin
  alter table public.reviewers add constraint reviewers_role_check check (role in ('reviewer', 'admin'));
exception when duplicate_object then null; end $$;

create or replace function public.is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.reviewers
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.reviewers
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')) and role = 'admin'
  );
$$;

-- Reviewers can see the reviewer list; only super admins can add, change or remove reviewers.
drop policy if exists "reviewers: reviewers read" on public.reviewers;
create policy "reviewers: reviewers read" on public.reviewers
  for select to authenticated using (public.is_reviewer());
drop policy if exists "reviewers: admins add" on public.reviewers;
create policy "reviewers: admins add" on public.reviewers
  for insert to authenticated with check (public.is_admin() and email = lower(email));
drop policy if exists "reviewers: admins change" on public.reviewers;
create policy "reviewers: admins change" on public.reviewers
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "reviewers: admins remove" on public.reviewers;
create policy "reviewers: admins remove" on public.reviewers
  for delete to authenticated using (public.is_admin());

-- There must always be at least one super admin.
create or replace function public.reviewers_keep_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role = 'admin' and not exists (select 1 from public.reviewers where role = 'admin') then
    raise exception 'At least one super admin must remain.';
  end if;
  return null;
end;
$$;
drop trigger if exists reviewers_keep_admin on public.reviewers;
create constraint trigger reviewers_keep_admin
  after update or delete on public.reviewers
  deferrable initially deferred
  for each row execute function public.reviewers_keep_admin();

-- ============================================================
-- 1b. Hotel access (managed by reviewers on the portal's Access page)
--     One row per email and hotel. A PIC who handles a cluster has one
--     row per hotel. Everyone linked to a hotel sees and can revise all
--     of that hotel's tickets, and can only submit for linked hotels.
-- ============================================================
create table if not exists public.hotel_members (
  email      text not null check (email = lower(email) and email like '%@%'),
  hotel_code text not null check (hotel_code ~ '^[A-Z0-9]{2,10}$'),
  added_by   text,
  added_at   timestamptz not null default now(),
  primary key (email, hotel_code)
);
create index if not exists hotel_members_hotel_idx on public.hotel_members (hotel_code);
alter table public.hotel_members enable row level security;

create or replace function public.is_member(p_hotel text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.hotel_members
    where email = lower(coalesce(auth.jwt() ->> 'email', '')) and hotel_code = p_hotel
  );
$$;

drop policy if exists "hotel_members: read own or as reviewer" on public.hotel_members;
create policy "hotel_members: read own or as reviewer" on public.hotel_members
  for select to authenticated
  using (email = lower(coalesce(auth.jwt() ->> 'email', '')) or public.is_reviewer());
drop policy if exists "hotel_members: reviewers add" on public.hotel_members;
create policy "hotel_members: reviewers add" on public.hotel_members
  for insert to authenticated
  with check (public.is_reviewer());
drop policy if exists "hotel_members: reviewers remove" on public.hotel_members;
create policy "hotel_members: reviewers remove" on public.hotel_members
  for delete to authenticated
  using (public.is_reviewer());

-- ============================================================
-- 2. Tickets
--    One row per EDM submission. Scalar columns are used for security
--    rules and counting; `summary` feeds the ticket list and `data`
--    holds the full submission (HTML, check results, versions).
--    Times are ISO 8601 text written by the app.
-- ============================================================
create table if not exists public.tickets (
  id                 text primary key check (id ~ '^edm-[a-z0-9]{6,40}$'),
  owner              uuid not null default auth.uid() references auth.users (id) on delete cascade,
  owner_email        text,
  ticket             text unique,
  hotel_code         text not null,
  start_at           text,
  state              text not null default 'draft' check (state in ('draft', 'submitted')),
  created_at         text,
  updated_at         text,
  submitted_at       text,
  first_submitted_at text,
  summary            jsonb not null default '{}'::jsonb,
  data               jsonb not null default '{}'::jsonb
);
create index if not exists tickets_owner_idx on public.tickets (owner);
create index if not exists tickets_hotel_month_idx on public.tickets (hotel_code, start_at);
alter table public.tickets enable row level security;

-- ============================================================
-- 3. Reviews (one per ticket, written only by reviewers)
-- ============================================================
create table if not exists public.reviews (
  ticket_id text primary key references public.tickets (id) on delete cascade,
  owner     uuid not null,
  status    text not null check (status in ('reviewing', 'approved', 'revision', 'scheduled')),
  at        text not null,
  data      jsonb not null default '{}'::jsonb
);
create index if not exists reviews_owner_idx on public.reviews (owner);
alter table public.reviews enable row level security;

-- A hotel may edit its own ticket while it is a draft, or after a reviewer
-- sent it back for revision (and before it is resubmitted).
create or replace function public.can_edit_ticket(p_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.tickets t
    left join public.reviews r on r.ticket_id = t.id
    where t.id = p_id
      and (t.owner = auth.uid() or public.is_member(t.hotel_code))
      and (
        t.state = 'draft'
        or (r.status = 'revision' and r.at >= coalesce(t.submitted_at, ''))
      )
  );
$$;

-- ---------- tickets policies ----------
drop policy if exists "tickets: read own or as reviewer" on public.tickets;
drop policy if exists "tickets: read own hotel or as reviewer" on public.tickets;
create policy "tickets: read own hotel or as reviewer" on public.tickets
  for select to authenticated
  using (owner = auth.uid() or public.is_member(hotel_code) or public.is_reviewer());

drop policy if exists "tickets: hotel creates own" on public.tickets;
create policy "tickets: hotel creates own" on public.tickets
  for insert to authenticated
  with check (owner = auth.uid() and ticket is null and (public.is_member(hotel_code) or public.is_reviewer()));

drop policy if exists "tickets: hotel edits own while editable" on public.tickets;
create policy "tickets: hotel edits own while editable" on public.tickets
  for update to authenticated
  using (public.can_edit_ticket(id))
  with check (public.is_member(hotel_code) or owner = auth.uid());

-- Super admins can delete any ticket (its review is removed with it).
drop policy if exists "tickets: super admins delete" on public.tickets;
create policy "tickets: super admins delete" on public.tickets
  for delete to authenticated
  using (public.is_admin());

-- Owner email is always taken from the login; ticket numbers can only be
-- set by assign_ticket(); the owner can never change.
create or replace function public.tickets_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.owner_email := auth.jwt() ->> 'email';
    new.ticket := null;
  else
    new.owner := old.owner;
    new.owner_email := old.owner_email;
    if old.ticket is not null then
      new.hotel_code := old.hotel_code;
    end if;
    if coalesce(current_setting('edm.assigning', true), '') <> '1' then
      new.ticket := old.ticket;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists tickets_guard on public.tickets;
create trigger tickets_guard
  before insert or update on public.tickets
  for each row execute function public.tickets_guard();

-- ---------- reviews policies ----------
drop policy if exists "reviews: read own tickets or as reviewer" on public.reviews;
create policy "reviews: read own tickets or as reviewer" on public.reviews
  for select to authenticated
  using (owner = auth.uid() or public.is_reviewer()
         or exists (select 1 from public.tickets t where t.id = ticket_id and public.is_member(t.hotel_code)));

drop policy if exists "reviews: reviewers insert" on public.reviews;
create policy "reviews: reviewers insert" on public.reviews
  for insert to authenticated
  with check (public.is_reviewer());

drop policy if exists "reviews: reviewers update" on public.reviews;
create policy "reviews: reviewers update" on public.reviews
  for update to authenticated
  using (public.is_reviewer())
  with check (public.is_reviewer());

-- ============================================================
-- 4. Ticket numbers and the monthly limit
--    Hotels cannot read each other's tickets, so these run with
--    elevated rights and return only a number.
-- ============================================================

-- Number of submitted EDMs for a hotel in a month (YYYY-MM), excluding one ticket.
create or replace function public.month_count(p_hotel text, p_month text, p_exclude text default null)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.tickets
  where hotel_code = p_hotel
    and state = 'submitted'
    and left(coalesce(start_at, ''), 7) = p_month
    and id <> coalesce(p_exclude, '');
$$;

-- Gives a submitted ticket its number: EDM-<HOTEL CODE>-<YYMM of send date>-<NN>.
-- Keeps the number it already has on resubmission.
create or replace function public.assign_ticket(p_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  t public.tickets;
  prefix text;
  next_no integer;
  result text;
begin
  select * into t from public.tickets where id = p_id and (owner = auth.uid() or public.is_member(hotel_code));
  if not found then
    raise exception 'ticket not found';
  end if;
  if t.ticket is not null then
    return t.ticket;
  end if;
  if t.state <> 'submitted' or t.start_at is null then
    raise exception 'ticket is not submitted';
  end if;

  prefix := 'EDM-' || t.hotel_code || '-' || substr(t.start_at, 3, 2) || substr(t.start_at, 6, 2);
  perform pg_advisory_xact_lock(hashtext(prefix));

  select coalesce(max(nullif(regexp_replace(ticket, '^.*-', ''), '')::integer), 0) + 1
    into next_no
    from public.tickets
    where ticket like prefix || '-%';

  result := prefix || '-' || lpad(next_no::text, 2, '0');
  perform set_config('edm.assigning', '1', true);
  update public.tickets set ticket = result where id = p_id;
  perform set_config('edm.assigning', '', true);
  return result;
end;
$$;

revoke all on function public.is_reviewer() from public, anon;
revoke all on function public.can_edit_ticket(text) from public, anon;
revoke all on function public.month_count(text, text, text) from public, anon;
revoke all on function public.assign_ticket(text) from public, anon;
grant execute on function public.is_reviewer() to authenticated;
grant execute on function public.can_edit_ticket(text) to authenticated;
grant execute on function public.month_count(text, text, text) to authenticated;
grant execute on function public.assign_ticket(text) to authenticated;
revoke all on function public.is_member(text) from public, anon;
grant execute on function public.is_member(text) to authenticated;

-- Table access for the API. Written out explicitly so the schema works whether
-- or not "Automatically expose new tables" is on. RLS above still decides rows.
revoke all on public.reviewers, public.tickets, public.reviews from anon;
revoke all on public.reviewers from authenticated;
grant select, insert, update, delete on public.reviewers to authenticated;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
grant select, insert, update, delete on public.tickets to authenticated;
grant select, insert, update on public.reviews to authenticated;
revoke all on public.hotel_members from anon;
grant select, insert, delete on public.hotel_members to authenticated;
-- the daily cleanup (api/cleanup.js) runs as service_role with the secret key
grant select, delete on public.tickets, public.reviews to service_role;

-- ============================================================
-- 5. Screenshot storage (private)
--    Files live under <user id>/<ticket id>/... Each hotel reads and
--    uploads only its own folder; reviewers read everything. Files are
--    never overwritten or deleted, so earlier versions stay available.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('screenshots', 'screenshots', false, 20971520, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "screenshots: upload to own folder" on storage.objects;
create policy "screenshots: upload to own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "screenshots: read own or as reviewer" on storage.objects;
create policy "screenshots: read own or as reviewer" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'screenshots'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_reviewer()
         or exists (select 1 from public.tickets t
                    where t.id = (storage.foldername(name))[2] and public.is_member(t.hotel_code)))
  );

drop policy if exists "screenshots: super admins delete" on storage.objects;
create policy "screenshots: super admins delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'screenshots' and public.is_admin());

-- ============================================================
-- 5b. Helpers for the Access page and the daily cleanup
-- ============================================================

-- People who have signed in but are not reviewers and not linked to any hotel
-- (shown to reviewers on the Access page so they can be linked).
create or replace function public.unlinked_users()
returns table (email text, last_sign_in_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select lower(u.email), u.last_sign_in_at
  from auth.users u
  where public.is_reviewer()
    and u.email is not null
    and not exists (select 1 from public.reviewers r where lower(r.email) = lower(u.email))
    and not exists (select 1 from public.hotel_members m where m.email = lower(u.email))
  order by u.last_sign_in_at desc nulls last
  limit 200;
$$;
revoke all on function public.unlinked_users() from public, anon;
grant execute on function public.unlinked_users() to authenticated;

-- Accounts overview for super admins: never returns passwords, only whether one is set.
create or replace function public.account_overview()
returns table (user_id uuid, email text, has_password boolean, confirmed boolean,
               must_change boolean, last_sign_in_at timestamptz, created_at timestamptz, blocked boolean)
language sql
stable
security definer
set search_path = public
as $$
  select u.id, lower(u.email),
         coalesce(u.encrypted_password, '') <> '',
         u.email_confirmed_at is not null,
         coalesce((u.raw_user_meta_data ->> 'must_change_password')::boolean, false),
         u.last_sign_in_at, u.created_at,
         u.banned_until is not null and u.banned_until > now()
  from auth.users u
  where public.is_admin() and u.email is not null
  order by lower(u.email)
  limit 2000;
$$;
revoke all on function public.account_overview() from public, anon;
grant execute on function public.account_overview() to authenticated;

-- Every screenshot of the given tickets, whoever uploaded it (used by api/cleanup.js).
create or replace function public.ticket_files(p_ids text[])
returns table (name text)
language sql
stable
security definer
set search_path = public
as $$
  select o.name from storage.objects o
  where o.bucket_id = 'screenshots' and (storage.foldername(o.name))[2] = any (p_ids);
$$;
revoke all on function public.ticket_files(text[]) from public, anon, authenticated;
grant execute on function public.ticket_files(text[]) to service_role;

-- Every screenshot of one ticket, for a super admin deleting it on the portal.
create or replace function public.admin_ticket_files(p_id text)
returns table (name text)
language sql
stable
security definer
set search_path = public
as $$
  select o.name from storage.objects o
  where public.is_admin() and o.bucket_id = 'screenshots' and (storage.foldername(o.name))[2] = p_id;
$$;
revoke all on function public.admin_ticket_files(text) from public, anon;
grant execute on function public.admin_ticket_files(text) to authenticated;

-- Keep access for people who already submitted before hotel access existed.
insert into public.hotel_members (email, hotel_code, added_by)
select distinct lower(t.owner_email), t.hotel_code, 'auto: existing ticket'
from public.tickets t
where t.owner_email is not null and t.hotel_code ~ '^[A-Z0-9]{2,10}$'
on conflict do nothing;

-- ============================================================
-- 6. Add the Group Digital Marketing reviewers
--    Replace the example address and run this part again whenever
--    the team changes. Remove someone with:
--    delete from public.reviewers where email = 'name@swiss-belhotel.com';
-- ============================================================
-- insert into public.reviewers (email) values
--   ('digitalmarketingmgr2@swiss-belhotel.com')
-- on conflict do nothing;
--
-- After that, reviewers are managed on the portal's Access page by a super admin.
-- Make the first super admin (only needed once):
-- update public.reviewers set role = 'admin' where email = 'digitalmarketingmgr2@swiss-belhotel.com';
