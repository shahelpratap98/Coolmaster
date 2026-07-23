-- CoolMaster — promo management schema, RLS, and storage.
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- No service-role key is required anywhere in the app: admin rights are a row
-- in public.admins, checked by the SECURITY DEFINER function public.is_admin().

-- ============================ ADMINS ============================
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- Intentionally NO policies: the table is unreadable/unwritable through the API.
-- Membership is only ever checked via public.is_admin() below.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ============================ PROMOS ============================
create table if not exists public.promos (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  badge             text,
  description       text not null,
  price_or_discount text,
  image_path        text,
  starts_at         timestamptz,
  ends_at           timestamptz,
  is_active         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists promos_created_at_idx on public.promos (created_at desc);
create index if not exists promos_is_active_idx  on public.promos (is_active);
create index if not exists promos_window_idx     on public.promos (starts_at, ends_at);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists promos_set_updated_at on public.promos;
create trigger promos_set_updated_at
  before update on public.promos
  for each row execute function public.set_updated_at();

alter table public.promos enable row level security;

-- Anyone may read a promo only while it is "visible" (active + within window).
drop policy if exists promos_public_read on public.promos;
create policy promos_public_read on public.promos
  for select to anon, authenticated
  using (
    is_active
    and (starts_at is null or starts_at <= now())
    and (ends_at   is null or ends_at   >= now())
  );

-- Admins may read every promo (drafts, scheduled, expired).
drop policy if exists promos_admin_read on public.promos;
create policy promos_admin_read on public.promos
  for select to authenticated
  using (public.is_admin());

-- Only admins may create/update/delete (DB-level backstop against IDOR).
drop policy if exists promos_admin_write on public.promos;
create policy promos_admin_write on public.promos
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================ STORAGE ============================
insert into storage.buckets (id, name, public)
values ('promo-images', 'promo-images', true)
on conflict (id) do nothing;

drop policy if exists "promo images public read" on storage.objects;
create policy "promo images public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'promo-images');

drop policy if exists "promo images admin insert" on storage.objects;
create policy "promo images admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'promo-images' and public.is_admin());

drop policy if exists "promo images admin update" on storage.objects;
create policy "promo images admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'promo-images' and public.is_admin());

drop policy if exists "promo images admin delete" on storage.objects;
create policy "promo images admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'promo-images' and public.is_admin());

-- ============================ CREATE THE ADMIN ============================
-- 1. Supabase Dashboard → Authentication → Users → "Add user"
--    (enter the owner's email + a strong password; tick "Auto Confirm User").
-- 2. Then run this once, replacing the email:
--
--    insert into public.admins (user_id)
--    select id from auth.users where email = 'owner@coolmaster.co.nz'
--    on conflict do nothing;
