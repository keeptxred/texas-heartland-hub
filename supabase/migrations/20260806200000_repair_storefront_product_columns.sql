-- Repair migration for environments where the original storefront-content
-- migration was committed but not applied before the public storefront API
-- began selecting the per-site columns.

alter table public.products
  add column if not exists keeptxred_title text,
  add column if not exists texasdefined_title text,
  add column if not exists keeptxred_description text,
  add column if not exists texasdefined_description text,
  add column if not exists keeptxred_image_url text,
  add column if not exists texasdefined_image_url text;

comment on column public.products.keeptxred_title is
  'Optional KeepTXRed storefront title; falls back to shared title.';
comment on column public.products.texasdefined_title is
  'Optional TexasDefined storefront title; falls back to shared title.';
comment on column public.products.keeptxred_description is
  'Optional KeepTXRed storefront description; falls back to shared description.';
comment on column public.products.texasdefined_description is
  'Optional TexasDefined storefront description; falls back to shared description.';
comment on column public.products.keeptxred_image_url is
  'Optional KeepTXRed primary storefront image; falls back to shared image_url.';
comment on column public.products.texasdefined_image_url is
  'Optional TexasDefined primary storefront image; falls back to shared image_url.';

-- Force PostgREST to refresh its schema cache immediately after migration.
notify pgrst, 'reload schema';
