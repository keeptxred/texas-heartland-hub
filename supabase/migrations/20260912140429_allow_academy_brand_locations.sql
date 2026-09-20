alter table public.texasdefined_brand_locations
  drop constraint if exists texasdefined_brand_locations_brand_slug_check;

alter table public.texasdefined_brand_locations
  add constraint texasdefined_brand_locations_brand_slug_check
  check (brand_slug in ('heb', 'bucees', 'academy'));
