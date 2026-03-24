create table if not exists public.auth_nonces (
  nonce text primary key,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists auth_nonces_created_at_idx
  on public.auth_nonces (created_at desc);
