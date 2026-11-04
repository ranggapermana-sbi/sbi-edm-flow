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
-- nobody reads or writes this table from the app; manage it in the Supabase dashboard

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
      and t.owner = auth.uid()
      and (
        t.state = 'draft'
        or (r.status = 'revision' and r.at >= coalesce(t.submitted_at, ''))
      )
  );
$$;

-- ---------- tickets policies ----------
drop policy if exists "tickets: read own or as reviewer" on public.tickets;
create policy "tickets: read own or as reviewer" on public.tickets
  for select to authenticated
  using (owner = auth.uid() or public.is_reviewer());

drop policy if exists "tickets: hotel creates own" on public.tickets;
create policy "tickets: hotel creates own" on public.tickets
  for insert to authenticated
  with check (owner = auth.uid() and ticket is null);

drop policy if exists "tickets: hotel edits own while editable" on public.tickets;
create policy "tickets: hotel edits own while editable" on public.tickets
  for update to authenticated
  using (public.can_edit_ticket(id))
  with check (owner = auth.uid());

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
  using (owner = auth.uid() or public.is_reviewer());

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
  select * into t from public.tickets where id = p_id and owner = auth.uid();
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
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_reviewer())
  );

-- ============================================================
-- 6. Add the Group Digital Marketing reviewers
--    Replace the example address and run this part again whenever
--    the team changes. Remove someone with:
--    delete from public.reviewers where email = 'name@swiss-belhotel.com';
-- ============================================================
-- insert into public.reviewers (email) values
--   ('digitalmarketingmgr2@swiss-belhotel.com')
-- on conflict do nothing;
