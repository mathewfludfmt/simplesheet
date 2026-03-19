create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('internal', 'partner')),
  partner_name text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  campaign_number text not null unique,
  status text,
  updated_source_at timestamptz,
  topo_date date,
  first_class_date date,
  second_class_date date,
  list_size numeric,
  brochure text,
  age text,
  ipa text,
  estimated_income numeric,
  premium_income numeric,
  networth text,
  zip_codes text,
  reg_url text,
  file_manager_link text,
  venue text,
  digital_package text,
  digital boolean not null default false,
  notes text,
  ended boolean not null default false,
  partner_visible boolean not null default false,
  partner_status text,
  manual_budget numeric,
  display_budget numeric,
  social_budget numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_imported_at timestamptz
);

create table if not exists public.campaign_import_runs (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  rows_processed integer not null default 0,
  rows_inserted integer not null default 0,
  rows_updated integer not null default 0,
  rows_failed integer not null default 0,
  status text not null,
  summary_json jsonb
);

create table if not exists public.campaign_import_errors (
  id uuid primary key default gen_random_uuid(),
  import_run_id uuid not null references public.campaign_import_runs(id) on delete cascade,
  row_number integer,
  campaign_number text,
  error_message text not null,
  raw_row_json jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_import_runs enable row level security;
alter table public.campaign_import_errors enable row level security;

create or replace function public.current_role()
returns text language sql stable as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace view public.partner_campaigns as
select
  id,
  campaign_number,
  status,
  partner_status,
  first_class_date,
  second_class_date,
  venue,
  zip_codes,
  estimated_income,
  display_budget,
  social_budget,
  notes
from public.campaigns
where partner_visible = true;

grant select on public.partner_campaigns to authenticated;

create policy "internal full access profiles"
on public.profiles
for all
using (public.current_role() = 'internal' or id = auth.uid())
with check (public.current_role() = 'internal' or id = auth.uid());

create policy "internal full access campaigns"
on public.campaigns
for all
using (public.current_role() = 'internal')
with check (public.current_role() = 'internal');

create policy "partner read visible campaigns"
on public.campaigns
for select
using (public.current_role() = 'partner' and partner_visible = true);

create policy "internal import runs"
on public.campaign_import_runs
for all
using (public.current_role() = 'internal')
with check (public.current_role() = 'internal');

create policy "internal import errors"
on public.campaign_import_errors
for all
using (public.current_role() = 'internal')
with check (public.current_role() = 'internal');
