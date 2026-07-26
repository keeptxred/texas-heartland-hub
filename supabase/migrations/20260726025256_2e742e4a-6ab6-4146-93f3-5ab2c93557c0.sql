-- Restore the Explore Texas public read layer + trip sharing.
-- Idempotent: uses IF NOT EXISTS / CREATE OR REPLACE where safe.

create extension if not exists pg_trgm;

-- ============================================================
-- explore_trips (saved + shareable itineraries)
-- ============================================================
create table if not exists public.explore_trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  share_token text unique,
  is_public boolean not null default false,
  title text not null check (char_length(title) between 1 and 160),
  starts_on date,
  ends_on date,
  preferences jsonb not null default '{}'::jsonb,
  itinerary jsonb not null default '{"days":[]}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists explore_trips_owner_idx on public.explore_trips(owner_id, updated_at desc);

grant select, insert, update, delete on public.explore_trips to authenticated;
grant select on public.explore_trips to anon;
grant all on public.explore_trips to service_role;

alter table public.explore_trips enable row level security;

drop policy if exists "Owners manage Explore trips" on public.explore_trips;
create policy "Owners manage Explore trips" on public.explore_trips
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "Shared Explore trips are readable" on public.explore_trips;
create policy "Shared Explore trips are readable" on public.explore_trips
  for select using (is_public and share_token is not null);

-- ============================================================
-- Public read policies on Explore tables
-- ============================================================
drop policy if exists "Public Explore entities are readable" on public.explore_entities;
create policy "Public Explore entities are readable" on public.explore_entities
  for select to anon, authenticated
  using (visibility = 'public' and status in ('published', 'verified'));

drop policy if exists "Public Explore entity types are readable" on public.explore_entity_types;
create policy "Public Explore entity types are readable" on public.explore_entity_types
  for select to anon, authenticated using (is_active);

drop policy if exists "Public Explore locations are readable" on public.explore_locations;
create policy "Public Explore locations are readable" on public.explore_locations
  for select to anon, authenticated using (
    exists (select 1 from public.explore_entities e where e.id = entity_id and e.visibility = 'public' and e.status in ('published','verified'))
  );

drop policy if exists "Public Explore media are readable" on public.explore_media;
create policy "Public Explore media are readable" on public.explore_media
  for select to anon, authenticated using (is_active);

drop policy if exists "Public Explore entity media are readable" on public.explore_entity_media;
create policy "Public Explore entity media are readable" on public.explore_entity_media
  for select to anon, authenticated using (
    exists (select 1 from public.explore_entities e where e.id = entity_id and e.visibility = 'public' and e.status in ('published','verified'))
  );

drop policy if exists "Public Explore amenities are readable" on public.explore_amenities;
create policy "Public Explore amenities are readable" on public.explore_amenities
  for select to anon, authenticated using (is_active);

drop policy if exists "Public Explore entity amenities are readable" on public.explore_entity_amenities;
create policy "Public Explore entity amenities are readable" on public.explore_entity_amenities
  for select to anon, authenticated using (
    exists (select 1 from public.explore_entities e where e.id = entity_id and e.visibility = 'public' and e.status in ('published','verified'))
  );

drop policy if exists "Public Explore activities are readable" on public.explore_activities;
create policy "Public Explore activities are readable" on public.explore_activities
  for select to anon, authenticated using (is_active);

drop policy if exists "Public Explore entity activities are readable" on public.explore_entity_activities;
create policy "Public Explore entity activities are readable" on public.explore_entity_activities
  for select to anon, authenticated using (
    exists (select 1 from public.explore_entities e where e.id = entity_id and e.visibility = 'public' and e.status in ('published','verified'))
  );

drop policy if exists "Public Explore categories are readable" on public.explore_categories;
create policy "Public Explore categories are readable" on public.explore_categories
  for select to anon, authenticated using (is_active);

drop policy if exists "Public Explore entity categories are readable" on public.explore_entity_categories;
create policy "Public Explore entity categories are readable" on public.explore_entity_categories
  for select to anon, authenticated using (
    exists (select 1 from public.explore_entities e where e.id = entity_id and e.visibility = 'public' and e.status in ('published','verified'))
  );

drop policy if exists "Public Explore tags are readable" on public.explore_tags;
create policy "Public Explore tags are readable" on public.explore_tags
  for select to anon, authenticated using (is_active);

drop policy if exists "Public Explore entity tags are readable" on public.explore_entity_tags;
create policy "Public Explore entity tags are readable" on public.explore_entity_tags
  for select to anon, authenticated using (
    exists (select 1 from public.explore_entities e where e.id = entity_id and e.visibility = 'public' and e.status in ('published','verified'))
  );

drop policy if exists "Public Explore relationships are readable" on public.explore_entity_relationships;
create policy "Public Explore relationships are readable" on public.explore_entity_relationships
  for select to anon, authenticated using (
    is_active
    and exists (select 1 from public.explore_entities e where e.id = source_entity_id and e.visibility = 'public' and e.status in ('published','verified'))
    and exists (select 1 from public.explore_entities e where e.id = target_entity_id and e.visibility = 'public' and e.status in ('published','verified'))
  );

drop policy if exists "Validated Explore observations are readable" on public.explore_observations;
create policy "Validated Explore observations are readable" on public.explore_observations
  for select to anon, authenticated using (
    review_status = 'validated'
    and (expires_at is null or expires_at >= now())
    and exists (select 1 from public.explore_entities e where e.id = entity_id and e.visibility = 'public' and e.status in ('published','verified'))
  );

drop policy if exists "Public Explore sources are readable" on public.explore_sources;
create policy "Public Explore sources are readable" on public.explore_sources
  for select to anon, authenticated using (is_active);

drop policy if exists "Public Explore entity sources are readable" on public.explore_entity_sources;
create policy "Public Explore entity sources are readable" on public.explore_entity_sources
  for select to anon, authenticated using (
    exists (select 1 from public.explore_entities e where e.id = entity_id and e.visibility = 'public' and e.status in ('published','verified'))
  );

drop policy if exists "Public Explore slug history is readable" on public.explore_entity_slug_history;
create policy "Public Explore slug history is readable" on public.explore_entity_slug_history
  for select to anon, authenticated using (
    exists (select 1 from public.explore_entities e where e.id = entity_id and e.visibility = 'public' and e.status in ('published','verified'))
  );

-- ============================================================
-- Public views
-- ============================================================
drop view if exists public.explore_public_entities;
create view public.explore_public_entities
with (security_invoker = true)
as
select
  e.id,
  et.key as entity_type,
  e.name,
  e.slug,
  e.alternate_names,
  e.summary,
  e.long_description as description,
  l.city,
  l.county,
  l.map_metadata ->> 'region' as region,
  l.latitude::double precision as latitude,
  l.longitude::double precision as longitude,
  hero.external_url as hero_image_url,
  hero.alt_text as hero_image_alt,
  coalesce(am.amenities, '{}'::text[]) as amenities,
  coalesce(ac.activities, '{}'::text[]) as activities,
  null::boolean as is_family_friendly,
  null::boolean as is_pet_friendly,
  null::boolean as is_accessible,
  coalesce(am.fee_required, ac.fee_required) as fee_required,
  src.source_url as official_url,
  null::text as phone,
  null::text as email,
  jsonb_strip_nulls(jsonb_build_object(
    'line1', l.address_line_1, 'line2', l.address_line_2, 'city', l.city,
    'county', l.county, 'state', l.state_code, 'postalCode', l.postal_code
  )) as address,
  '{}'::jsonb as profile,
  null::jsonb as hours,
  null::jsonb as fees,
  null::jsonb as regulations,
  null::jsonb as seasonal_guidance,
  coalesce(cat.categories, '{}'::text[]) as categories,
  coalesce(tg.tags, '{}'::text[]) as tags,
  src.source_url,
  src.source_name,
  src.source_updated_at,
  e.featured as is_featured,
  e.popularity_score,
  e.status,
  e.visibility,
  e.updated_at
from public.explore_entities e
join public.explore_entity_types et on et.id = e.entity_type_id
left join public.explore_locations l on l.entity_id = e.id
left join lateral (
  select m.external_url, m.alt_text
  from public.explore_entity_media em
  join public.explore_media m on m.id = em.media_id
  where em.entity_id = e.id and em.role = 'hero' and m.is_active
  order by em.is_primary desc, em.sort_order, em.created_at
  limit 1
) hero on true
left join lateral (
  select array_agg(a.key order by a.sort_order, a.key) as amenities,
         bool_or(ea.fee_required) filter (where ea.fee_required is not null) as fee_required
  from public.explore_entity_amenities ea
  join public.explore_amenities a on a.id = ea.amenity_id
  where ea.entity_id = e.id and a.is_active and ea.availability <> 'unavailable'
) am on true
left join lateral (
  select array_agg(a.key order by a.sort_order, a.key) as activities,
         bool_or(ea.fee_required) filter (where ea.fee_required is not null) as fee_required
  from public.explore_entity_activities ea
  join public.explore_activities a on a.id = ea.activity_id
  where ea.entity_id = e.id and a.is_active and ea.suitability <> 'not_allowed'
) ac on true
left join lateral (
  select array_agg(c.key order by c.sort_order, c.key) as categories
  from public.explore_entity_categories ec
  join public.explore_categories c on c.id = ec.category_id
  where ec.entity_id = e.id and c.is_active
) cat on true
left join lateral (
  select array_agg(t.key order by t.key) as tags
  from public.explore_entity_tags etg
  join public.explore_tags t on t.id = etg.tag_id
  where etg.entity_id = e.id and t.is_active
) tg on true
left join lateral (
  select es.source_url, s.name as source_name, es.retrieved_at as source_updated_at
  from public.explore_entity_sources es
  join public.explore_sources s on s.id = es.source_id
  where es.entity_id = e.id
  order by s.is_authoritative desc, es.confidence desc, es.updated_at desc
  limit 1
) src on true
where e.visibility = 'public' and e.status in ('published', 'verified');

grant select on public.explore_public_entities to anon, authenticated;

drop view if exists public.explore_public_observations;
create view public.explore_public_observations
with (security_invoker = true)
as
select id, entity_id, observation_type,
  coalesce(title, initcap(replace(observation_type, '_', ' '))) as title,
  coalesce(value_text, payload ->> 'description') as description,
  case when payload ->> 'severity' in ('info','advisory','warning','closure') then payload ->> 'severity' end as severity,
  observed_at as starts_at, expires_at as ends_at, source_url
from public.explore_observations
where review_status = 'validated' and (expires_at is null or expires_at >= now());

grant select on public.explore_public_observations to anon, authenticated;

-- ============================================================
-- Search + autocomplete RPCs
-- ============================================================
create or replace function public.search_explore_entities(
  search_query text default null,
  entity_types text[] default null,
  regions text[] default null,
  counties text[] default null,
  required_activities text[] default null,
  required_amenities text[] default null,
  near_lat double precision default null,
  near_lng double precision default null,
  radius_km double precision default null,
  result_limit integer default 24,
  result_offset integer default 0
) returns table (
  id uuid, entity_type text, name text, slug text, summary text, city text, county text, region text,
  latitude double precision, longitude double precision, hero_image_url text, hero_image_alt text,
  amenities text[], activities text[], is_family_friendly boolean, is_pet_friendly boolean,
  is_accessible boolean, fee_required boolean, rank real, distance_km double precision, total_count bigint
) language sql stable security invoker set search_path = public as $$
  with matched as (
    select e.*,
      case when nullif(trim(search_query), '') is null then 0::real
        else greatest(similarity(e.name, search_query), similarity(coalesce(e.summary, ''), search_query))::real end as text_rank,
      case when near_lat is null or near_lng is null or e.latitude is null or e.longitude is null then null
        else 6371 * 2 * asin(sqrt(
          power(sin(radians(e.latitude - near_lat) / 2), 2) +
          cos(radians(near_lat)) * cos(radians(e.latitude)) *
          power(sin(radians(e.longitude - near_lng) / 2), 2)
        )) end as calculated_distance
    from public.explore_public_entities e
    where (nullif(trim(search_query), '') is null
        or e.name ilike '%' || search_query || '%'
        or e.summary ilike '%' || search_query || '%'
        or search_query % e.name)
      and (entity_types is null or e.entity_type = any(entity_types))
      and (regions is null or e.region = any(regions))
      and (counties is null or e.county = any(counties))
      and (required_activities is null or e.activities @> required_activities)
      and (required_amenities is null or e.amenities @> required_amenities)
  ), bounded as (
    select * from matched
    where radius_km is null or calculated_distance is null or calculated_distance <= radius_km
  )
  select b.id, b.entity_type, b.name, b.slug, b.summary, b.city, b.county, b.region,
    b.latitude, b.longitude, b.hero_image_url, b.hero_image_alt, b.amenities, b.activities,
    b.is_family_friendly, b.is_pet_friendly, b.is_accessible, b.fee_required,
    b.text_rank, b.calculated_distance, count(*) over()
  from bounded b
  order by b.text_rank desc, b.calculated_distance asc nulls last, b.is_featured desc, b.name
  limit least(greatest(result_limit, 1), 100) offset greatest(result_offset, 0);
$$;

grant execute on function public.search_explore_entities(text,text[],text[],text[],text[],text[],double precision,double precision,double precision,integer,integer) to anon, authenticated;

create or replace function public.autocomplete_explore_entities(
  search_query text,
  result_limit integer default 8
) returns table (
  name text,
  slug text,
  entity_type text,
  region text
) language sql stable security invoker set search_path = public as $$
  select e.name, e.slug, e.entity_type, e.region
  from public.explore_public_entities e
  where nullif(trim(search_query), '') is not null
    and (
      e.name ilike '%' || search_query || '%'
      or search_query % e.name
      or exists (
        select 1 from unnest(e.alternate_names) alias
        where alias ilike '%' || search_query || '%'
      )
    )
  order by
    case when lower(e.name) like lower(search_query) || '%' then 0 else 1 end,
    similarity(e.name, search_query) desc,
    e.name
  limit least(greatest(result_limit, 1), 12);
$$;

grant execute on function public.autocomplete_explore_entities(text,integer) to anon, authenticated;
