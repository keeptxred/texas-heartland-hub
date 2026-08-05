-- 1. GRANTS: none existed on any explore_* table, so PostgREST could not read them at all.
grant select on table
  public.explore_entity_types,
  public.explore_entities,
  public.explore_locations,
  public.explore_categories,
  public.explore_entity_categories,
  public.explore_tags,
  public.explore_entity_tags,
  public.explore_media,
  public.explore_entity_media,
  public.explore_sources,
  public.explore_entity_sources,
  public.explore_amenities,
  public.explore_entity_amenities,
  public.explore_activities,
  public.explore_entity_activities,
  public.explore_relationship_types,
  public.explore_entity_relationships,
  public.explore_park_profiles,
  public.explore_lake_profiles,
  public.explore_campground_profiles,
  public.explore_species_profiles,
  public.explore_business_profiles,
  public.explore_search_index,
  public.explore_entity_slug_history
to anon, authenticated;

grant all on table
  public.explore_entity_types,
  public.explore_entities,
  public.explore_locations,
  public.explore_categories,
  public.explore_entity_categories,
  public.explore_tags,
  public.explore_entity_tags,
  public.explore_media,
  public.explore_entity_media,
  public.explore_sources,
  public.explore_entity_sources,
  public.explore_amenities,
  public.explore_entity_amenities,
  public.explore_activities,
  public.explore_entity_activities,
  public.explore_relationship_types,
  public.explore_entity_relationships,
  public.explore_park_profiles,
  public.explore_lake_profiles,
  public.explore_campground_profiles,
  public.explore_species_profiles,
  public.explore_business_profiles,
  public.explore_search_index,
  public.explore_entity_slug_history,
  public.explore_entity_versions,
  public.explore_observations,
  public.explore_entity_reviews,
  public.explore_duplicate_candidates,
  public.explore_search_synonyms,
  public.explore_saved_searches,
  public.explore_trips,
  public.explore_import_sources,
  public.explore_import_jobs,
  public.explore_import_records,
  public.explore_import_revisions,
  public.explore_import_rollbacks
to service_role;

-- 2. Public read policies for profile tables + search index, scoped to public/verified rows.
create policy "Public Explore park profiles are readable"
  on public.explore_park_profiles for select to anon, authenticated
  using (exists (
    select 1 from public.explore_entities e
    where e.id = explore_park_profiles.entity_id
      and e.visibility = 'public'
      and e.status in ('published','verified')
  ));

create policy "Public Explore lake profiles are readable"
  on public.explore_lake_profiles for select to anon, authenticated
  using (exists (
    select 1 from public.explore_entities e
    where e.id = explore_lake_profiles.entity_id
      and e.visibility = 'public'
      and e.status in ('published','verified')
  ));

create policy "Public Explore campground profiles are readable"
  on public.explore_campground_profiles for select to anon, authenticated
  using (exists (
    select 1 from public.explore_entities e
    where e.id = explore_campground_profiles.entity_id
      and e.visibility = 'public'
      and e.status in ('published','verified')
  ));

create policy "Public Explore search index is readable"
  on public.explore_search_index for select to anon, authenticated
  using (visibility = 'public' and status in ('published','verified'));

-- 3. Additive taxonomy keys (no synonyms of existing keys).
insert into public.explore_entity_types (key, name, plural_name, description, sort_order)
values
  ('reservoir','Reservoir','Reservoirs','Man-made impoundment managed for water supply, flood control, or recreation',60),
  ('spring','Spring','Springs','Natural spring or artesian water feature',61),
  ('cavern','Cavern','Caverns','Developed show cave open to visitors',62),
  ('cave','Cave','Caves','Undeveloped or wild cave feature',63),
  ('beach','Beach','Beaches','Coastal or lakeside beach access',64),
  ('island','Island','Islands','Barrier or inland island',65),
  ('natural_area','Natural Area','Natural Areas','State natural area or protected natural landscape',66),
  ('wildlife_refuge','Wildlife Refuge','Wildlife Refuges','National or state wildlife refuge or management area',67),
  ('national_monument','National Monument','National Monuments','National monument administered by a federal agency',68),
  ('national_preserve','National Preserve','National Preserves','National preserve administered by the National Park Service',69),
  ('national_seashore','National Seashore','National Seashores','National seashore administered by the National Park Service',70),
  ('museum','Museum','Museums','Museum or interpretive center',71),
  ('mission','Mission','Missions','Spanish colonial mission site',72),
  ('battlefield','Battlefield','Battlefields','Historic battlefield site',73),
  ('monument','Monument','Monuments','Commemorative monument or marker',74),
  ('scenic_drive','Scenic Drive','Scenic Drives','Designated scenic driving route',75),
  ('swimming_hole','Swimming Hole','Swimming Holes','Natural swimming area',76),
  ('waterfall','Waterfall','Waterfalls','Waterfall feature',77),
  ('winery','Winery','Wineries','Winery or vineyard open to visitors',78),
  ('brewery','Brewery','Breweries','Brewery or taproom open to visitors',79)
on conflict (key) do nothing;