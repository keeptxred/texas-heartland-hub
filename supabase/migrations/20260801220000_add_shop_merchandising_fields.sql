-- Website-specific merchandising controls for Printify-synced products.
-- These fields are intentionally separate from Etsy/Printify publishing state.

alter table public.products
  add column if not exists printify_product_id text,
  add column if not exists category text,
  add column if not exists collections text[] not null default '{}'::text[],
  add column if not exists is_featured boolean not null default false,
  add column if not exists is_new boolean not null default false,
  add column if not exists is_on_sale boolean not null default false;

-- Existing Printify rows use the Printify product id as their primary id.
update public.products
set printify_product_id = id
where source = 'printify'
  and printify_product_id is null;

create unique index if not exists products_printify_product_id_uidx
  on public.products (printify_product_id)
  where printify_product_id is not null;

create index if not exists products_shop_visibility_idx
  on public.products (is_active, category);

create index if not exists products_collections_gin_idx
  on public.products using gin (collections);

comment on column public.products.is_active is
  'Website visibility controlled by Keep TX Red admin; new Printify products default to false.';
comment on column public.products.category is
  'Website product category such as shirts, hoodies, hats, drinkware, stickers, tote-bags, or accessories.';
comment on column public.products.collections is
  'Website merchandising collections; independent from marketplace SEO tags.';
