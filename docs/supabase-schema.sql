create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  subcategory text not null,
  brand text not null,
  price numeric not null default 0,
  old_price numeric,
  rating numeric,
  rating_count integer,
  sales_count integer,
  image_url text not null,
  affiliate_url text not null,
  palette jsonb not null default '[]'::jsonb,
  offers jsonb not null default '[]'::jsonb,
  price_history jsonb not null default '[]'::jsonb,
  found_minutes_ago integer not null default 1,
  tags jsonb not null default '[]'::jsonb,
  description text not null,
  source text,
  last_verified_at timestamptz,
  network text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cardinal_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  checked_links integer not null default 0,
  accepted integer not null default 0,
  rejected integer not null default 0,
  notes jsonb not null default '[]'::jsonb
);

create table if not exists public.cardinal_drafts (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.cardinal_runs(id) on delete set null,
  name text,
  affiliate_url text,
  original_url text,
  network text,
  payload jsonb not null default '{}'::jsonb,
  rejection_reasons jsonb not null default '[]'::jsonb,
  status text not null default 'needs_enrichment',
  created_at timestamptz not null default now()
);

create table if not exists public.telegram_posts (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  channel_id text not null,
  message_id bigint,
  status text not null default 'queued',
  score integer not null default 0,
  caption text,
  error text,
  posted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.click_events (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  source text not null default 'site',
  user_agent text,
  referer text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.cardinal_runs enable row level security;
alter table public.cardinal_drafts enable row level security;
alter table public.telegram_posts enable row level security;
alter table public.click_events enable row level security;

create policy "Produtos publicados podem ser lidos publicamente"
  on public.products for select
  using (status = 'published');

create policy "Service role gerencia produtos"
  on public.products for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role gerencia execucoes Cardinal"
  on public.cardinal_runs for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role gerencia rascunhos Cardinal"
  on public.cardinal_drafts for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role gerencia posts Telegram"
  on public.telegram_posts for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role gerencia cliques"
  on public.click_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

grant usage on schema public to anon, authenticated, service_role;
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
grant all on public.cardinal_runs to service_role;
grant all on public.cardinal_drafts to service_role;
grant all on public.telegram_posts to service_role;
grant all on public.click_events to service_role;

select pg_notify('pgrst', 'reload schema');
