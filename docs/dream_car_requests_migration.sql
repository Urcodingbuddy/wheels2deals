-- Run this in the Supabase SQL Editor to create the dream_car_requests table

create table if not exists public.dream_car_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  full_name   text not null,
  phone       text not null,
  brand       text not null,
  model       text,
  budget      text,
  year_range  text,
  timeline    text,
  notes       text,

  status      text not null default 'new'  -- new | contacted | fulfilled
);

-- Allow anonymous inserts (public concierge form — no auth required)
alter table public.dream_car_requests enable row level security;

create policy "Anyone can submit a dream car request"
  on public.dream_car_requests
  for insert
  to anon, authenticated
  with check (true);

-- Admins can read all rows
create policy "Admins can read dream car requests"
  on public.dream_car_requests
  for select
  to authenticated
  using (true);
