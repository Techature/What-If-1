-- Run in Supabase: SQL Editor → New query → paste → Run
-- Table for local http://localhost:8080/?cloud=1 (maps to readRecords("Finders"))

create table if not exists public.finders (
  id text primary key,
  name text not null default '',
  image text default '',
  kind text default '',
  address text default '',
  status text default ''
);

alter table public.finders enable row level security;

create policy "finders_select_anon"
  on public.finders for select to anon using (true);

create policy "finders_insert_anon"
  on public.finders for insert to anon with check (true);

create policy "finders_update_anon"
  on public.finders for update to anon using (true) with check (true);