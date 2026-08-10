alter table public.products
  add column if not exists publish_keeptxred boolean not null default false,
  add column if not exists publish_texasdefined boolean not null default false,
  add column if not exists keeptxred_category text,
  add column if not exists texasdefined_category text,
  add column if not exists keeptxred_collections text[] not null default '{}',
  add column if not exists texasdefined_collections text[] not null default '{}',
  add column if not exists keeptxred_featured boolean not null default false,
  add column if not exists texasdefined_featured boolean not null default false,
  add column if not exists keeptxred_display_order integer not null default 0,
  add column if not exists texasdefined_display_order integer not null default 0;

-- Preserve the current KeepTXRed catalog when the migration is first applied.
update public.products
set
  publish_keeptxred = is_active,
  keeptxred_category = coalesce(keeptxred_category, category),
  keeptxred_collections = case when cardinality(keeptxred_collections) = 0 then coalesce(collections, '{}') else keeptxred_collections end,
  keeptxred_featured = is_featured
where source = 'printify';

create index if not exists products_publish_keeptxred_idx
  on public.products (publish_keeptxred, keeptxred_display_order, synced_at desc)
  where source = 'printify';

create index if not exists products_publish_texasdefined_idx
  on public.products (publish_texasdefined, texasdefined_display_order, synced_at desc)
  where source = 'printify';

comment on column public.products.publish_keeptxred is 'Whether the product appears on KeepTXRed.com';
comment on column public.products.publish_texasdefined is 'Whether the product appears on TexasDefined.com';
