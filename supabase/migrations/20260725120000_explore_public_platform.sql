create extension if not exists pg_trgm;

do $$ begin
  create type public.explore_publication_status as enum ('draft', 'review', 'published', 'archived', 'rejected');
exception when duplicate_object then null; end $$;

create table if not exists public.explore_entities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (char_length(entity_type) between 2 and 80),
  name text not null check (char_length(name) between 1 and 240),
  slug text not null unique,
  alternate_names text[] not null default '{}',
  summary text,
  description text,
  status public.explore_publication_status not null default 'draft',
  is_featured boolean not null default false,
  is_family_friendly boolean,
  is_pet_friendly boolean,
  is_accessible boolean,
  fee_required boolean,
  official_url text,
  phone text,
  email text,
  address jsonb,
  city text,
  county text,
  region text,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  hero_image_url text,
  hero_image_alt text,
  profile jsonb not null default '{}',
  hours jsonb,
  fees jsonb,
  regulations jsonb,
  seasonal_guidance jsonb,
  amenities text[] not null default '{}',
  activities text[] not null default '{}',
  categories text[] not null default '{}',
  tags text[] not null default '{}',
  source_url text,
  source_name text,
  source_updated_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_document tsvector generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(alternate_names, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags || categories || activities, ' '), '')), 'B')
  ) stored
);

create table if not exists public.explore_entity_relationships (
  id uuid primary key default gen_random_uuid(),
  source_entity_id uuid not null references public.explore_entities(id) on delete cascade,
  target_entity_id uuid not null references public.explore_entities(id) on delete cascade,
  relationship_type text not null,
  strength smallint not null default 50 check (strength between 0 and 100),
  created_at timestamptz not null default now(),
  unique (source_entity_id, target_entity_id, relationship_type)
);

create table if not exists public.explore_observations (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.explore_entities(id) on delete cascade,
  observation_type text not null,
  title text not null,
  description text,
  severity text check (severity in ('info', 'advisory', 'warning', 'closure')),
  starts_at timestamptz,
  ends_at timestamptz,
  source_url text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.explore_trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  share_token text unique,
  is_public boolean not null default false,
  title text not null check (char_length(title) between 1 and 160),
  starts_on date,
  ends_on date,
  preferences jsonb not null default '{}',
  itinerary jsonb not null default '{"days":[]}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists explore_entities_public_idx on public.explore_entities(status, entity_type, region, county);
create index if not exists explore_entities_search_idx on public.explore_entities using gin(search_document);
create index if not exists explore_entities_name_trgm_idx on public.explore_entities using gin(name gin_trgm_ops);
create index if not exists explore_entities_amenities_idx on public.explore_entities using gin(amenities);
create index if not exists explore_entities_activities_idx on public.explore_entities using gin(activities);
create index if not exists explore_observations_public_idx on public.explore_observations(entity_id, is_public, starts_at desc);
create index if not exists explore_trips_owner_idx on public.explore_trips(owner_id, updated_at desc);

alter table public.explore_entities enable row level security;
alter table public.explore_entity_relationships enable row level security;
alter table public.explore_observations enable row level security;
alter table public.explore_trips enable row level security;

drop policy if exists "Published Explore entities are public" on public.explore_entities;
create policy "Published Explore entities are public" on public.explore_entities
  for select using (status = 'published');

drop policy if exists "Published Explore relationships are public" on public.explore_entity_relationships;
create policy "Published Explore relationships are public" on public.explore_entity_relationships
  for select using (
    exists (select 1 from public.explore_entities e where e.id = source_entity_id and e.status = 'published')
    and exists (select 1 from public.explore_entities e where e.id = target_entity_id and e.status = 'published')
  );

drop policy if exists "Public Explore observations are readable" on public.explore_observations;
create policy "Public Explore observations are readable" on public.explore_observations
  for select using (
    is_public
    and (ends_at is null or ends_at >= now())
    and exists (select 1 from public.explore_entities e where e.id = entity_id and e.status = 'published')
  );

drop policy if exists "Owners manage Explore trips" on public.explore_trips;
create policy "Owners manage Explore trips" on public.explore_trips
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "Shared Explore trips are readable" on public.explore_trips;
create policy "Shared Explore trips are readable" on public.explore_trips
  for select using (is_public and share_token is not null);

do $$ begin
  if to_regprocedure('public.has_role(uuid,public.app_role)') is not null then
    execute 'create policy "Admins manage Explore entities" on public.explore_entities for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))';
    execute 'create policy "Admins manage Explore relationships" on public.explore_entity_relationships for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))';
    execute 'create policy "Admins manage Explore observations" on public.explore_observations for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))';
  end if;
exception when duplicate_object then null; end $$;

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
        else ts_rank_cd(e.search_document, websearch_to_tsquery('english', search_query)) end as text_rank,
      case when near_lat is null or near_lng is null or e.latitude is null or e.longitude is null then null
        else 6371 * 2 * asin(sqrt(
          power(sin(radians(e.latitude - near_lat) / 2), 2) +
          cos(radians(near_lat)) * cos(radians(e.latitude)) *
          power(sin(radians(e.longitude - near_lng) / 2), 2)
        )) end as calculated_distance
    from public.explore_entities e
    where e.status = 'published'
      and (nullif(trim(search_query), '') is null
        or e.search_document @@ websearch_to_tsquery('english', search_query)
        or e.name % search_query)
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
