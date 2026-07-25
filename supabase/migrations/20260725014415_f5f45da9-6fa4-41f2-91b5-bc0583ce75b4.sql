CREATE OR REPLACE FUNCTION public.explore_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.explore_entity_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  name text NOT NULL, plural_name text NOT NULL,
  description text, icon_key text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.explore_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type_id uuid NOT NULL REFERENCES public.explore_entity_types(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  alternate_names text[] NOT NULL DEFAULT '{}',
  short_description text, long_description text, summary text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','imported','validated','reviewed','published','verified','archived')),
  visibility text NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal','unlisted','public')),
  source_confidence smallint NOT NULL DEFAULT 0 CHECK (source_confidence BETWEEN 0 AND 100),
  featured boolean NOT NULL DEFAULT false,
  popularity_score numeric(10,4) NOT NULL DEFAULT 0 CHECK (popularity_score >= 0),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz, verified_at timestamptz, archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entities_public_requires_published CHECK (visibility <> 'public' OR status IN ('published','verified')),
  CONSTRAINT explore_entities_published_timestamp CHECK (published_at IS NULL OR status IN ('published','verified','archived')),
  CONSTRAINT explore_entities_verified_timestamp CHECK (verified_at IS NULL OR status IN ('verified','archived'))
);

CREATE TABLE public.explore_entity_slug_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  replaced_at timestamptz NOT NULL DEFAULT now(),
  replaced_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reason text
);

CREATE TABLE public.explore_relationship_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  name text NOT NULL, reverse_name text NOT NULL, description text,
  is_symmetric boolean NOT NULL DEFAULT false,
  default_weight numeric(8,4) NOT NULL DEFAULT 1 CHECK (default_weight >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.explore_entity_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_type_id uuid NOT NULL REFERENCES public.explore_relationship_types(id) ON DELETE RESTRICT,
  source_entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  target_entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  weight numeric(8,4) NOT NULL DEFAULT 1 CHECK (weight >= 0),
  priority text NOT NULL DEFAULT 'secondary' CHECK (priority IN ('primary','secondary','nearby','regional','suggested')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  effective_from timestamptz, effective_until timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_relationship_no_self_reference CHECK (source_entity_id <> target_entity_id),
  CONSTRAINT explore_relationship_valid_dates CHECK (effective_until IS NULL OR effective_from IS NULL OR effective_until > effective_from),
  CONSTRAINT explore_relationship_unique UNIQUE (relationship_type_id, source_entity_id, target_entity_id)
);

CREATE TABLE public.explore_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('government','academic','nonprofit','commercial','partner','community','internal','ai')),
  base_url text, publisher text, license_name text, license_url text,
  default_confidence smallint NOT NULL DEFAULT 0 CHECK (default_confidence BETWEEN 0 AND 100),
  is_authoritative boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_sources_name_publisher_unique UNIQUE NULLS NOT DISTINCT (name, publisher)
);

CREATE TABLE public.explore_entity_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES public.explore_sources(id) ON DELETE RESTRICT,
  source_url text, external_id text,
  field_paths text[] NOT NULL DEFAULT '{}',
  confidence smallint NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  retrieved_at timestamptz, verified_at timestamptz, notes text,
  raw_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entity_sources_unique UNIQUE NULLS NOT DISTINCT (entity_id, source_id, external_id, source_url)
);

CREATE TABLE public.explore_entity_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  version integer NOT NULL CHECK (version > 0),
  snapshot jsonb NOT NULL, change_summary text,
  change_source text NOT NULL DEFAULT 'manual' CHECK (change_source IN ('manual','import','system','ai')),
  changed_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entity_versions_unique UNIQUE (entity_id, version)
);

CREATE TABLE public.explore_import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_key text NOT NULL CHECK (connector_key ~ '^[a-z][a-z0-9_]*$'),
  source_id uuid REFERENCES public.explore_sources(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','completed','completed_with_warnings','failed','cancelled')),
  started_at timestamptz, completed_at timestamptz,
  records_received integer NOT NULL DEFAULT 0 CHECK (records_received >= 0),
  entities_created integer NOT NULL DEFAULT 0 CHECK (entities_created >= 0),
  entities_updated integer NOT NULL DEFAULT 0 CHECK (entities_updated >= 0),
  entities_unchanged integer NOT NULL DEFAULT 0 CHECK (entities_unchanged >= 0),
  warnings_count integer NOT NULL DEFAULT 0 CHECK (warnings_count >= 0),
  errors_count integer NOT NULL DEFAULT 0 CHECK (errors_count >= 0),
  cursor_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_details jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_import_jobs_valid_dates CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at)
);

CREATE INDEX idx_explore_entities_type_status ON public.explore_entities (entity_type_id, status);
CREATE INDEX idx_explore_entities_visibility_status ON public.explore_entities (visibility, status);
CREATE INDEX idx_explore_entities_name_lower ON public.explore_entities (lower(name));
CREATE INDEX idx_explore_entities_alternate_names_gin ON public.explore_entities USING gin (alternate_names);
CREATE INDEX idx_explore_entities_featured ON public.explore_entities (featured, popularity_score DESC) WHERE featured = true;
CREATE INDEX idx_explore_entity_slug_history_entity ON public.explore_entity_slug_history (entity_id, replaced_at DESC);
CREATE INDEX idx_explore_relationships_source ON public.explore_entity_relationships (source_entity_id, relationship_type_id) WHERE is_active = true;
CREATE INDEX idx_explore_relationships_target ON public.explore_entity_relationships (target_entity_id, relationship_type_id) WHERE is_active = true;
CREATE INDEX idx_explore_relationships_metadata_gin ON public.explore_entity_relationships USING gin (metadata);
CREATE INDEX idx_explore_entity_sources_entity ON public.explore_entity_sources (entity_id);
CREATE INDEX idx_explore_entity_sources_source ON public.explore_entity_sources (source_id);
CREATE INDEX idx_explore_entity_versions_entity ON public.explore_entity_versions (entity_id, version DESC);
CREATE INDEX idx_explore_import_jobs_connector_created ON public.explore_import_jobs (connector_key, created_at DESC);
CREATE INDEX idx_explore_import_jobs_status ON public.explore_import_jobs (status, created_at DESC);

CREATE TRIGGER trg_explore_entity_types_updated_at BEFORE UPDATE ON public.explore_entity_types FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entities_updated_at BEFORE UPDATE ON public.explore_entities FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_relationship_types_updated_at BEFORE UPDATE ON public.explore_relationship_types FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entity_relationships_updated_at BEFORE UPDATE ON public.explore_entity_relationships FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_sources_updated_at BEFORE UPDATE ON public.explore_sources FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entity_sources_updated_at BEFORE UPDATE ON public.explore_entity_sources FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_import_jobs_updated_at BEFORE UPDATE ON public.explore_import_jobs FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

ALTER TABLE public.explore_entity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entity_slug_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_relationship_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entity_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entity_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entity_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_import_jobs ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.explore_entity_types TO service_role;
GRANT ALL ON public.explore_entities TO service_role;
GRANT ALL ON public.explore_entity_slug_history TO service_role;
GRANT ALL ON public.explore_relationship_types TO service_role;
GRANT ALL ON public.explore_entity_relationships TO service_role;
GRANT ALL ON public.explore_sources TO service_role;
GRANT ALL ON public.explore_entity_sources TO service_role;
GRANT ALL ON public.explore_entity_versions TO service_role;
GRANT ALL ON public.explore_import_jobs TO service_role;

CREATE POLICY "sr_explore_entity_types" ON public.explore_entity_types FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_explore_entities" ON public.explore_entities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_explore_slug_history" ON public.explore_entity_slug_history FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_explore_relationship_types" ON public.explore_relationship_types FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_explore_relationships" ON public.explore_entity_relationships FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_explore_sources" ON public.explore_sources FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_explore_entity_sources" ON public.explore_entity_sources FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_explore_entity_versions" ON public.explore_entity_versions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_explore_import_jobs" ON public.explore_import_jobs FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO public.explore_entity_types (key, name, plural_name, sort_order) VALUES
  ('state','State','States',10),('region','Region','Regions',20),('county','County','Counties',30),
  ('city','City','Cities',40),('lake','Lake','Lakes',50),('river','River','Rivers',60),
  ('state_park','State Park','State Parks',70),('national_park','National Park','National Parks',80),
  ('campground','Campground','Campgrounds',90),('historic_site','Historic Site','Historic Sites',100),
  ('trail','Trail','Trails',110),('fish','Fish','Fish',120),('bird','Bird','Birds',130),
  ('wildflower','Wildflower','Wildflowers',140),('tree','Tree','Trees',150),
  ('animal','Animal','Animals',160),('business','Business','Businesses',170),
  ('restaurant','Restaurant','Restaurants',180),('hotel','Hotel','Hotels',190),
  ('event','Event','Events',200),('law','Law','Laws',210),('agency','Agency','Agencies',220)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.explore_relationship_types (key, name, reverse_name, is_symmetric, default_weight) VALUES
  ('located_in','Located in','Contains',false,1),('contains','Contains','Located in',false,1),
  ('near','Near','Near',true,0.8),('flows_through','Flows through','Has waterway',false,1),
  ('habitat_for','Habitat for','Found in',false,1),('managed_by','Managed by','Manages',false,1),
  ('operated_by','Operated by','Operates',false,1),('part_of','Part of','Contains part',false,1),
  ('connects_to','Connects to','Connects to',true,1),('offers','Offers','Offered by',false,1),
  ('supports','Supports','Supported by',false,1),('protects','Protects','Protected by',false,1),
  ('regulates','Regulates','Regulated by',false,1),('nearby_to','Nearby to','Nearby to',true,0.8),
  ('recommended_with','Recommended with','Recommended with',true,0.7)
ON CONFLICT (key) DO NOTHING;

CREATE TABLE public.explore_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL UNIQUE REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  address_line_1 text, address_line_2 text, city text, county text,
  state_code text NOT NULL DEFAULT 'TX' CHECK (state_code ~ '^[A-Z]{2}$'),
  postal_code text,
  latitude numeric(9,6) CHECK (latitude BETWEEN -90 AND 90),
  longitude numeric(9,6) CHECK (longitude BETWEEN -180 AND 180),
  elevation_feet numeric(10,2),
  timezone text NOT NULL DEFAULT 'America/Chicago',
  directions text, map_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_locations_coordinates_together CHECK ((latitude IS NULL AND longitude IS NULL) OR (latitude IS NOT NULL AND longitude IS NOT NULL))
);

CREATE TABLE public.explore_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES public.explore_sources(id) ON DELETE SET NULL,
  media_type text NOT NULL CHECK (media_type IN ('image','video','audio','document','map')),
  storage_bucket text, storage_path text, external_url text,
  title text, alt_text text, caption text, credit_text text, photographer text,
  license_name text, license_url text,
  width integer CHECK (width IS NULL OR width > 0),
  height integer CHECK (height IS NULL OR height > 0),
  file_size_bytes bigint CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
  mime_type text,
  checksum_sha256 text CHECK (checksum_sha256 IS NULL OR checksum_sha256 ~ '^[a-fA-F0-9]{64}$'),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_media_has_location CHECK (storage_path IS NOT NULL OR external_url IS NOT NULL),
  CONSTRAINT explore_media_storage_complete CHECK (storage_path IS NULL OR storage_bucket IS NOT NULL)
);

CREATE TABLE public.explore_entity_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES public.explore_media(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'gallery' CHECK (role IN ('hero','gallery','thumbnail','map','document','logo','seasonal')),
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entity_media_unique UNIQUE (entity_id, media_id, role)
);
CREATE UNIQUE INDEX idx_explore_entity_media_one_primary_role ON public.explore_entity_media (entity_id, role) WHERE is_primary = true;

CREATE TABLE public.explore_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  name text NOT NULL, description text,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('general','camping','boating','accessibility','family','food','lodging','safety','utilities','recreation')),
  icon_key text, is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.explore_entity_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  amenity_id uuid NOT NULL REFERENCES public.explore_amenities(id) ON DELETE RESTRICT,
  availability text NOT NULL DEFAULT 'available' CHECK (availability IN ('available','limited','seasonal','unavailable','unknown')),
  quantity integer CHECK (quantity IS NULL OR quantity >= 0),
  fee_required boolean, notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entity_amenities_unique UNIQUE (entity_id, amenity_id)
);

CREATE TABLE public.explore_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  name text NOT NULL, description text,
  category text NOT NULL DEFAULT 'outdoors' CHECK (category IN ('outdoors','water','wildlife','history','family','sports','scenic','education','food','lodging')),
  icon_key text, is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.explore_entity_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  activity_id uuid NOT NULL REFERENCES public.explore_activities(id) ON DELETE RESTRICT,
  suitability text NOT NULL DEFAULT 'available' CHECK (suitability IN ('excellent','good','available','limited','seasonal','not_allowed','unknown')),
  best_months smallint[] NOT NULL DEFAULT '{}',
  skill_level text CHECK (skill_level IS NULL OR skill_level IN ('beginner','intermediate','advanced','all_levels')),
  fee_required boolean, permit_required boolean, notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entity_activities_unique UNIQUE (entity_id, activity_id),
  CONSTRAINT explore_entity_activities_valid_months CHECK (best_months <@ ARRAY[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[])
);

CREATE TABLE public.explore_lake_profiles (
  entity_id uuid PRIMARY KEY REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  surface_area_acres numeric(14,2) CHECK (surface_area_acres IS NULL OR surface_area_acres >= 0),
  shoreline_miles numeric(12,2) CHECK (shoreline_miles IS NULL OR shoreline_miles >= 0),
  max_depth_feet numeric(10,2) CHECK (max_depth_feet IS NULL OR max_depth_feet >= 0),
  average_depth_feet numeric(10,2) CHECK (average_depth_feet IS NULL OR average_depth_feet >= 0),
  water_type text CHECK (water_type IS NULL OR water_type IN ('freshwater','saltwater','brackish')),
  reservoir boolean, dam_name text, managing_authority text, water_level_source_url text,
  swimming_allowed boolean, fishing_allowed boolean, boating_allowed boolean, wake_restrictions text,
  profile_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_lake_profile_depths CHECK (max_depth_feet IS NULL OR average_depth_feet IS NULL OR max_depth_feet >= average_depth_feet)
);

CREATE TABLE public.explore_park_profiles (
  entity_id uuid PRIMARY KEY REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  park_type text CHECK (park_type IS NULL OR park_type IN ('state','national','county','city','regional','historic','recreation_area','wildlife_refuge','other')),
  acreage numeric(14,2) CHECK (acreage IS NULL OR acreage >= 0),
  managing_authority text, official_park_id text,
  entrance_fee_cents integer CHECK (entrance_fee_cents IS NULL OR entrance_fee_cents >= 0),
  fee_notes text, reservations_required boolean, reservations_url text,
  operating_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  pets_allowed boolean, camping_available boolean, visitor_center_available boolean,
  playground_available boolean, restrooms_available boolean, accessibility_notes text,
  profile_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.explore_campground_profiles (
  entity_id uuid PRIMARY KEY REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  campground_type text CHECK (campground_type IS NULL OR campground_type IN ('public','private','dispersed','backcountry','rv_park','group','other')),
  managing_authority text,
  total_sites integer CHECK (total_sites IS NULL OR total_sites >= 0),
  tent_sites integer CHECK (tent_sites IS NULL OR tent_sites >= 0),
  rv_sites integer CHECK (rv_sites IS NULL OR rv_sites >= 0),
  group_sites integer CHECK (group_sites IS NULL OR group_sites >= 0),
  max_rv_length_feet integer CHECK (max_rv_length_feet IS NULL OR max_rv_length_feet >= 0),
  electric_hookups boolean, water_hookups boolean, sewer_hookups boolean, dump_station boolean,
  potable_water boolean, showers boolean, restrooms boolean, fire_rings boolean,
  picnic_tables boolean, wifi boolean, laundry boolean, generators_allowed boolean,
  reservation_url text,
  nightly_fee_min_cents integer CHECK (nightly_fee_min_cents IS NULL OR nightly_fee_min_cents >= 0),
  nightly_fee_max_cents integer CHECK (nightly_fee_max_cents IS NULL OR nightly_fee_max_cents >= 0),
  profile_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_campground_site_totals CHECK (total_sites IS NULL OR coalesce(tent_sites,0)+coalesce(rv_sites,0)+coalesce(group_sites,0) <= total_sites),
  CONSTRAINT explore_campground_fee_range CHECK (nightly_fee_max_cents IS NULL OR nightly_fee_min_cents IS NULL OR nightly_fee_max_cents >= nightly_fee_min_cents)
);

CREATE TABLE public.explore_species_profiles (
  entity_id uuid PRIMARY KEY REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  scientific_name text, kingdom text, family text, genus text, species text,
  native_to_texas boolean, conservation_status text,
  game_species boolean, invasive boolean,
  average_length_inches numeric(10,2) CHECK (average_length_inches IS NULL OR average_length_inches >= 0),
  average_weight_pounds numeric(10,2) CHECK (average_weight_pounds IS NULL OR average_weight_pounds >= 0),
  bloom_months smallint[] NOT NULL DEFAULT '{}',
  migration_months smallint[] NOT NULL DEFAULT '{}',
  spawning_months smallint[] NOT NULL DEFAULT '{}',
  habitat_notes text, identification_notes text, safety_notes text,
  profile_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_species_bloom_months CHECK (bloom_months <@ ARRAY[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[]),
  CONSTRAINT explore_species_migration_months CHECK (migration_months <@ ARRAY[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[]),
  CONSTRAINT explore_species_spawning_months CHECK (spawning_months <@ ARRAY[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[])
);

CREATE TABLE public.explore_business_profiles (
  entity_id uuid PRIMARY KEY REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  business_type text, phone text, email text, website_url text, booking_url text,
  price_level smallint CHECK (price_level IS NULL OR price_level BETWEEN 1 AND 4),
  operating_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  permanently_closed boolean NOT NULL DEFAULT false,
  claimed boolean NOT NULL DEFAULT false,
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_explore_locations_city_county ON public.explore_locations (city, county);
CREATE INDEX idx_explore_locations_coordinates ON public.explore_locations (latitude, longitude) WHERE latitude IS NOT NULL;
CREATE INDEX idx_explore_locations_postal_code ON public.explore_locations (postal_code);
CREATE INDEX idx_explore_media_source ON public.explore_media (source_id);
CREATE INDEX idx_explore_media_checksum ON public.explore_media (checksum_sha256) WHERE checksum_sha256 IS NOT NULL;
CREATE INDEX idx_explore_media_metadata_gin ON public.explore_media USING gin (metadata);
CREATE INDEX idx_explore_entity_media_entity ON public.explore_entity_media (entity_id, role, sort_order);
CREATE INDEX idx_explore_entity_media_media ON public.explore_entity_media (media_id);
CREATE INDEX idx_explore_entity_amenities_entity ON public.explore_entity_amenities (entity_id, availability);
CREATE INDEX idx_explore_entity_activities_entity ON public.explore_entity_activities (entity_id, suitability);
CREATE INDEX idx_explore_entity_activities_months_gin ON public.explore_entity_activities USING gin (best_months);
CREATE INDEX idx_explore_species_scientific_name ON public.explore_species_profiles (lower(scientific_name));

CREATE TRIGGER trg_explore_locations_updated_at BEFORE UPDATE ON public.explore_locations FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_media_updated_at BEFORE UPDATE ON public.explore_media FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entity_media_updated_at BEFORE UPDATE ON public.explore_entity_media FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_amenities_updated_at BEFORE UPDATE ON public.explore_amenities FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entity_amenities_updated_at BEFORE UPDATE ON public.explore_entity_amenities FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_activities_updated_at BEFORE UPDATE ON public.explore_activities FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entity_activities_updated_at BEFORE UPDATE ON public.explore_entity_activities FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_lake_profiles_updated_at BEFORE UPDATE ON public.explore_lake_profiles FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_park_profiles_updated_at BEFORE UPDATE ON public.explore_park_profiles FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_campground_profiles_updated_at BEFORE UPDATE ON public.explore_campground_profiles FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_species_profiles_updated_at BEFORE UPDATE ON public.explore_species_profiles FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_business_profiles_updated_at BEFORE UPDATE ON public.explore_business_profiles FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

ALTER TABLE public.explore_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entity_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entity_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entity_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_lake_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_park_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_campground_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_species_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_business_profiles ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.explore_locations TO service_role;
GRANT ALL ON public.explore_media TO service_role;
GRANT ALL ON public.explore_entity_media TO service_role;
GRANT ALL ON public.explore_amenities TO service_role;
GRANT ALL ON public.explore_entity_amenities TO service_role;
GRANT ALL ON public.explore_activities TO service_role;
GRANT ALL ON public.explore_entity_activities TO service_role;
GRANT ALL ON public.explore_lake_profiles TO service_role;
GRANT ALL ON public.explore_park_profiles TO service_role;
GRANT ALL ON public.explore_campground_profiles TO service_role;
GRANT ALL ON public.explore_species_profiles TO service_role;
GRANT ALL ON public.explore_business_profiles TO service_role;

CREATE POLICY "sr_locations" ON public.explore_locations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_media" ON public.explore_media FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_entity_media" ON public.explore_entity_media FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_amenities" ON public.explore_amenities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_entity_amenities" ON public.explore_entity_amenities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_activities" ON public.explore_activities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_entity_activities" ON public.explore_entity_activities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_lake_profiles" ON public.explore_lake_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_park_profiles" ON public.explore_park_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_campground_profiles" ON public.explore_campground_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_species_profiles" ON public.explore_species_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_business_profiles" ON public.explore_business_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO public.explore_amenities (key, name, category, sort_order) VALUES
  ('restrooms','Restrooms','general',10),('showers','Showers','camping',20),
  ('potable_water','Potable Water','utilities',30),('electric_hookups','Electric Hookups','camping',40),
  ('water_hookups','Water Hookups','camping',50),('sewer_hookups','Sewer Hookups','camping',60),
  ('dump_station','Dump Station','camping',70),('boat_ramp','Boat Ramp','boating',80),
  ('marina','Marina','boating',90),('playground','Playground','family',100),
  ('picnic_area','Picnic Area','family',110),('visitor_center','Visitor Center','general',120),
  ('accessible_parking','Accessible Parking','accessibility',130),
  ('accessible_restrooms','Accessible Restrooms','accessibility',140),
  ('wifi','Wi-Fi','utilities',150),('laundry','Laundry','camping',160)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.explore_activities (key, name, category, sort_order) VALUES
  ('fishing','Fishing','water',10),('boating','Boating','water',20),
  ('kayaking','Kayaking','water',30),('canoeing','Canoeing','water',40),
  ('swimming','Swimming','water',50),('camping','Camping','outdoors',60),
  ('hiking','Hiking','outdoors',70),('biking','Biking','outdoors',80),
  ('bird_watching','Bird Watching','wildlife',90),
  ('wildlife_viewing','Wildlife Viewing','wildlife',100),
  ('wildflower_viewing','Wildflower Viewing','scenic',110),
  ('photography','Photography','scenic',120),
  ('history_tours','History Tours','history',130),
  ('stargazing','Stargazing','scenic',140),
  ('picnicking','Picnicking','family',150)
ON CONFLICT (key) DO NOTHING;

CREATE TABLE public.explore_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.explore_categories(id) ON DELETE SET NULL,
  key text NOT NULL UNIQUE CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  name text NOT NULL,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text, icon_key text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_categories_no_self_parent CHECK (parent_id IS NULL OR parent_id <> id)
);

CREATE TABLE public.explore_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  name text NOT NULL,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text, tag_group text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.explore_entity_categories (
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.explore_categories(id) ON DELETE CASCADE,
  is_primary boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (entity_id, category_id)
);

CREATE TABLE public.explore_entity_tags (
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.explore_tags(id) ON DELETE CASCADE,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','import','rule','ai')),
  confidence smallint NOT NULL DEFAULT 100 CHECK (confidence BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (entity_id, tag_id)
);

CREATE TABLE public.explore_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  source_id uuid REFERENCES public.explore_sources(id) ON DELETE SET NULL,
  observation_type text NOT NULL CHECK (observation_type ~ '^[a-z][a-z0-9_]*$'),
  title text, value_text text, value_number numeric, unit text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  observed_at timestamptz NOT NULL, expires_at timestamptz,
  confidence smallint NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 100),
  review_status text NOT NULL DEFAULT 'needs_review' CHECK (review_status IN ('needs_review','validated','rejected','expired')),
  reviewed_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz, source_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_observations_valid_expiration CHECK (expires_at IS NULL OR expires_at > observed_at),
  CONSTRAINT explore_observations_review_consistency CHECK ((reviewed_at IS NULL AND reviewed_by_user_id IS NULL) OR review_status IN ('validated','rejected','expired'))
);

CREATE TABLE public.explore_entity_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  review_type text NOT NULL DEFAULT 'editorial' CHECK (review_type IN ('editorial','factual','legal','media','seo','import')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','approved','changes_requested','rejected','cancelled')),
  assigned_to_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  due_at timestamptz, started_at timestamptz, completed_at timestamptz,
  notes text, checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entity_reviews_valid_dates CHECK ((started_at IS NULL OR started_at >= created_at) AND (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at))
);

CREATE TABLE public.explore_duplicate_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_a_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  entity_b_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  similarity_score numeric(6,5) NOT NULL CHECK (similarity_score BETWEEN 0 AND 1),
  matching_fields text[] NOT NULL DEFAULT '{}',
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','merged','not_duplicate','deferred')),
  resolution_notes text,
  resolved_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_duplicate_candidates_distinct CHECK (entity_a_id <> entity_b_id),
  CONSTRAINT explore_duplicate_candidates_ordered CHECK (entity_a_id < entity_b_id),
  CONSTRAINT explore_duplicate_candidates_unique UNIQUE (entity_a_id, entity_b_id),
  CONSTRAINT explore_duplicate_candidates_resolution CHECK ((status = 'pending' AND resolved_at IS NULL) OR status IN ('merged','not_duplicate','deferred'))
);

CREATE TABLE public.explore_saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL, query_text text,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_key text, is_shared boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.explore_search_synonyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL, normalized_term text NOT NULL,
  synonym text NOT NULL, synonym_normalized text NOT NULL,
  relationship text NOT NULL DEFAULT 'equivalent' CHECK (relationship IN ('equivalent','abbreviation','misspelling','broader','narrower')),
  weight numeric(5,4) NOT NULL DEFAULT 1 CHECK (weight > 0),
  is_bidirectional boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_search_synonyms_unique UNIQUE (normalized_term, synonym_normalized, relationship)
);

CREATE TABLE public.explore_search_index (
  entity_id uuid PRIMARY KEY REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  entity_type_key text NOT NULL, name text NOT NULL, slug text NOT NULL,
  alternate_names text[] NOT NULL DEFAULT '{}',
  category_names text[] NOT NULL DEFAULT '{}',
  tag_names text[] NOT NULL DEFAULT '{}',
  location_text text, searchable_text text NOT NULL DEFAULT '',
  document tsvector,
  popularity_score numeric(10,4) NOT NULL DEFAULT 0,
  source_confidence smallint NOT NULL DEFAULT 0 CHECK (source_confidence BETWEEN 0 AND 100),
  visibility text NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal','unlisted','public')),
  status text NOT NULL,
  indexed_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.explore_search_index_document_refresh()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.document :=
    setweight(to_tsvector('english'::regconfig, coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english'::regconfig, coalesce(array_to_string(NEW.alternate_names, ' '), '')), 'A') ||
    setweight(to_tsvector('english'::regconfig, coalesce(array_to_string(NEW.category_names, ' '), '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(array_to_string(NEW.tag_names, ' '), '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(NEW.location_text, '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(NEW.searchable_text, '')), 'C');
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_explore_search_index_document BEFORE INSERT OR UPDATE ON public.explore_search_index FOR EACH ROW EXECUTE FUNCTION public.explore_search_index_document_refresh();

CREATE UNIQUE INDEX idx_explore_entity_categories_one_primary ON public.explore_entity_categories (entity_id) WHERE is_primary = true;
CREATE INDEX idx_explore_categories_parent ON public.explore_categories (parent_id, sort_order);
CREATE INDEX idx_explore_tags_group ON public.explore_tags (tag_group, name);
CREATE INDEX idx_explore_entity_categories_category ON public.explore_entity_categories (category_id, entity_id);
CREATE INDEX idx_explore_entity_tags_tag ON public.explore_entity_tags (tag_id, entity_id);
CREATE INDEX idx_explore_observations_entity_type_time ON public.explore_observations (entity_id, observation_type, observed_at DESC);
CREATE INDEX idx_explore_observations_active ON public.explore_observations (observation_type, expires_at) WHERE review_status = 'validated';
CREATE INDEX idx_explore_entity_reviews_status ON public.explore_entity_reviews (status, due_at, created_at);
CREATE INDEX idx_explore_entity_reviews_entity ON public.explore_entity_reviews (entity_id, created_at DESC);
CREATE INDEX idx_explore_duplicates_pending ON public.explore_duplicate_candidates (similarity_score DESC, created_at) WHERE status = 'pending';
CREATE INDEX idx_explore_saved_searches_owner ON public.explore_saved_searches (owner_user_id, updated_at DESC);
CREATE INDEX idx_explore_synonyms_term ON public.explore_search_synonyms (normalized_term) WHERE is_active = true;
CREATE INDEX idx_explore_synonyms_synonym ON public.explore_search_synonyms (synonym_normalized) WHERE is_active = true;
CREATE INDEX idx_explore_search_document ON public.explore_search_index USING gin (document);
CREATE INDEX idx_explore_search_type_status ON public.explore_search_index (entity_type_key, visibility, status);
CREATE INDEX idx_explore_search_popularity ON public.explore_search_index (popularity_score DESC, source_confidence DESC);

CREATE TRIGGER trg_explore_categories_updated_at BEFORE UPDATE ON public.explore_categories FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_tags_updated_at BEFORE UPDATE ON public.explore_tags FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_observations_updated_at BEFORE UPDATE ON public.explore_observations FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entity_reviews_updated_at BEFORE UPDATE ON public.explore_entity_reviews FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_duplicate_candidates_updated_at BEFORE UPDATE ON public.explore_duplicate_candidates FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_saved_searches_updated_at BEFORE UPDATE ON public.explore_saved_searches FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_search_synonyms_updated_at BEFORE UPDATE ON public.explore_search_synonyms FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_search_index_updated_at BEFORE UPDATE ON public.explore_search_index FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

ALTER TABLE public.explore_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_entity_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_duplicate_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_search_synonyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_search_index ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.explore_categories TO service_role;
GRANT ALL ON public.explore_tags TO service_role;
GRANT ALL ON public.explore_entity_categories TO service_role;
GRANT ALL ON public.explore_entity_tags TO service_role;
GRANT ALL ON public.explore_observations TO service_role;
GRANT ALL ON public.explore_entity_reviews TO service_role;
GRANT ALL ON public.explore_duplicate_candidates TO service_role;
GRANT ALL ON public.explore_saved_searches TO service_role;
GRANT ALL ON public.explore_search_synonyms TO service_role;
GRANT ALL ON public.explore_search_index TO service_role;

CREATE POLICY "sr_categories" ON public.explore_categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_tags" ON public.explore_tags FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_entity_categories" ON public.explore_entity_categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_entity_tags" ON public.explore_entity_tags FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_observations" ON public.explore_observations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_entity_reviews" ON public.explore_entity_reviews FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_duplicate_candidates" ON public.explore_duplicate_candidates FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_saved_searches" ON public.explore_saved_searches FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_search_synonyms" ON public.explore_search_synonyms FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sr_search_index" ON public.explore_search_index FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO public.explore_categories (key, name, slug, sort_order) VALUES
  ('outdoors','Outdoors','outdoors',10),('water_recreation','Water Recreation','water-recreation',20),
  ('camping','Camping','camping',30),('wildlife','Wildlife','wildlife',40),
  ('history','History','history',50),('family_travel','Family Travel','family-travel',60),
  ('scenic','Scenic','scenic',70),('food_and_lodging','Food & Lodging','food-and-lodging',80)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.explore_tags (key, name, slug, tag_group) VALUES
  ('kid_friendly','Kid Friendly','kid-friendly','audience'),
  ('pet_friendly','Pet Friendly','pet-friendly','access'),
  ('wheelchair_accessible','Wheelchair Accessible','wheelchair-accessible','access'),
  ('free_admission','Free Admission','free-admission','cost'),
  ('kayaking','Kayaking','kayaking','activity'),
  ('bird_watching','Bird Watching','bird-watching','activity'),
  ('dark_sky','Dark Sky','dark-sky','experience'),
  ('historic','Historic','historic','experience'),
  ('scenic_drive','Scenic Drive','scenic-drive','activity')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.explore_search_synonyms (term, normalized_term, synonym, synonym_normalized, relationship, is_bidirectional) VALUES
  ('Texas Parks and Wildlife Department','texas parks and wildlife department','TPWD','tpwd','abbreviation',true),
  ('Bluebonnets','bluebonnets','Blue Bonnets','blue bonnets','misspelling',true),
  ('Lyndon B. Johnson','lyndon b johnson','LBJ','lbj','abbreviation',true)
ON CONFLICT (normalized_term, synonym_normalized, relationship) DO NOTHING;