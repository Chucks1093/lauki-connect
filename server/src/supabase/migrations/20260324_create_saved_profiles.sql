create extension if not exists pgcrypto;

create table if not exists public.saved_profiles (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null,
  profile_id text not null,
  profile_name text not null,
  profile_role text not null,
  profile_company text not null,
  profile_location text,
  profile_score integer,
  profile_reason text,
  profile_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (wallet_address, profile_id)
);

create index if not exists saved_profiles_wallet_address_idx
  on public.saved_profiles (wallet_address, created_at desc);
