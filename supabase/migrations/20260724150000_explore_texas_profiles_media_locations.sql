-- Explore Texas Phase II, Step 1B
-- Locations, media, amenities, activities, and initial entity profile tables.
-- Internal only: RLS is enabled and only service_role receives access.

CREATE TABLE public.explore_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL UNIQUE REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  address_line_1 text,
  address_line_2 text,
  city text,
  county text,
  state_code text NOT NULL DEFAULT 'TX' CHECK (state_code ~ '^[A-Z]{2}$'),
  postal_code text,
  latitude numeric(9,6) CHECK (latitude BETWEEN -90 AND 90),
  longitude numeric(9,6) CHECK (longitude BETWEEN -180 AND 180),
  elevation_feet numeric(10,2),
  timezone text NOT NULL DEFAULT 'America/Chicago',
  directions text,
  map_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_locations_coordinates_together CHECK (
    (latitude IS NULL AND longitude IS NULL) OR
    (latitude IS NOT NULL AND longitude IS NOT NULL)
  )
);

CREATE TABLE public.explore_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES public.explore_sources(id) ON DELETE SET NULL,
  media_type text NOT NULL CHECK (media_type IN ('image','video','audio','document','map')),
  storage_bucket text,
  storage_path text,
  external_url text,
  title text,
  alt_text text,
  caption text,
  credit_text text,
  photographer text,
  license_name text,
  license_url text,
  width integer CHECK (width IS NULL OR width > 0),
  height integer CHECK (height IS NULL OR height > 0),
  file_size_bytes bigint CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
  mime_type text,
  checksum_sha256 text CHECK (checksum_sha256 IS NULL OR checksum_sha256 ~ '^[a-fA-F0-9]{64}$'),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_media_has_location CHECK (
    storage_path IS NOT NULL OR external_url IS NOT NULL
  ),
  CONSTRAINT explore_media_storage_complete CHECK (
    storage_path IS NULL OR storage_bucket IS NOT NULL
  )
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

CREATE UNIQUE INDEX idx_explore_entity_media_one_primary_role
  ON public.explore_entity_media (entity_id, role)
  WHERE is_primary = true;

CREATE TABLE public.explore_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('general','camping','boating','accessibility','family','food','lodging','safety','utilities','recreation')),
  icon_key text,
  is_active boolean NOT NULL DEFAULT true,
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
  fee_required boolean,
  notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entity_amenities_unique UNIQUE (entity_id, amenity_id)
);

CREATE TABLE public.explore_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'outdoors' CHECK (category IN ('outdoors','water','wildlife','history','family','sports','scenic','education','food','lodging')),
  icon_key text,
  is_active boolean NOT NULL DEFAULT true,
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
  fee_required boolean,
  permit_required boolean,
  notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entity_activities_unique UNIQUE (entity_id, activity_id),
  CONSTRAINT explore_entity_activities_valid_months CHECK (
    best_months <@ ARRAY[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[]
  )
);

CREATE TABLE public.explore_lake_profiles (
  entity_id uuid PRIMARY KEY REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  surface_area_acres numeric(14,2) CHECK (surface_area_acres IS NULL OR surface_area_acres >= 0),
  shoreline_miles numeric(12,2) CHECK (shoreline_miles IS NULL OR shoreline_miles >= 0),
  max_depth_feet numeric(10,2) CHECK (max_depth_feet IS NULL OR max_depth_feet >= 0),
  average_depth_feet numeric(10,2) CHECK (average_depth_feet IS NULL OR average_depth_feet >= 0),
  water_type text CHECK (water_type IS NULL OR water_type IN ('freshwater','saltwater','brackish')),
  reservoir boolean,
  dam_name text,
  managing_authority text,
  water_level_source_url text,
  swimming_allowed boolean,
  fishing_allowed boolean,
  boating_allowed boolean,
  wake_restrictions text,
  profile_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_lake_profile_depths CHECK (
    max_depth_feet IS NULL OR average_depth_feet IS NULL OR max_depth_feet >= average_depth_feet
  )
);

CREATE TABLE public.explore_park_profiles (
  entity_id uuid PRIMARY KEY REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  park_type text CHECK (park_type IS NULL OR park_type IN ('state','national','county','city','regional','historic','recreation_area','wildlife_refuge','other')),
  acreage numeric(14,2) CHECK (acreage IS NULL OR acreage >= 0),
  managing_authority text,
  official_park_id text,
  entrance_fee_cents integer CHECK (entrance_fee_cents IS NULL OR entrance_fee_cents >= 0),
  fee_notes text,
  reservations_required boolean,
  reservations_url text,
  operating_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  pets_allowed boolean,
  camping_available boolean,
  visitor_center_available boolean,
  playground_available boolean,
  restrooms_available boolean,
  accessibility_notes text,
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
  electric_hookups boolean,
  water_hookups boolean,
  sewer_hookups boolean,
  dump_station boolean,
  potable_water boolean,
  showers boolean,
  restrooms boolean,
  fire_rings boolean,
  picnic_tables boolean,
  wifi boolean,
  laundry boolean,
  generators_allowed boolean,
  reservation_url text,
  nightly_fee_min_cents integer CHECK (nightly_fee_min_cents IS NULL OR nightly_fee_min_cents >= 0),
  nightly_fee_max_cents integer CHECK (nightly_fee_max_cents IS NULL OR nightly_fee_max_cents >= 0),
  profile_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_campground_site_totals CHECK (
    total_sites IS NULL OR
    coalesce(tent_sites,0) + coalesce(rv_sites,0) + coalesce(group_sites,0) <= total_sites
  ),
  CONSTRAINT explore_campground_fee_range CHECK (
    nightly_fee_max_cents IS NULL OR nightly_fee_min_cents IS NULL OR nightly_fee_max_cents >= nightly_fee_min_cents
  )
);

CREATE TABLE public.explore_species_profiles (
  entity_id uuid PRIMARY KEY REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  scientific_name text,
  kingdom text,
  family text,
  genus text,
  species text,
  native_to_texas boolean,
  conservation_status text,
  game_species boolean,
  invasive boolean,
  average_length_inches numeric(10,2) CHECK (average_length_inches IS NULL OR average_length_inches >= 0),
  average_weight_pounds numeric(10,2) CHECK (average_weight_pounds IS NULL OR average_weight_pounds >= 0),
  bloom_months smallint[] NOT NULL DEFAULT '{}',
  migration_months smallint[] NOT NULL DEFAULT '{}',
  spawning_months smallint[] NOT NULL DEFAULT '{}',
  habitat_notes text,
  identification_notes text,
  safety_notes text,
  profile_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_species_bloom_months CHECK (bloom_months <@ ARRAY[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[]),
  CONSTRAINT explore_species_migration_months CHECK (migration_months <@ ARRAY[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[]),
  CONSTRAINT explore_species_spawning_months CHECK (spawning_months <@ ARRAY[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[])
);

CREATE TABLE public.explore_business_profiles (
  entity_id uuid PRIMARY KEY REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  business_type text,
  phone text,
  email text,
  website_url text,
  booking_url text,
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

CREATE TRIGGER trg_explore_locations_updated_at BEFORE UPDATE ON public.explore_locations
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_media_updated_at BEFORE UPDATE ON public.explore_media
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entity_media_updated_at BEFORE UPDATE ON public.explore_entity_media
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_amenities_updated_at BEFORE UPDATE ON public.explore_amenities
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entity_amenities_updated_at BEFORE UPDATE ON public.explore_entity_amenities
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_activities_updated_at BEFORE UPDATE ON public.explore_activities
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entity_activities_updated_at BEFORE UPDATE ON public.explore_entity_activities
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_lake_profiles_updated_at BEFORE UPDATE ON public.explore_lake_profiles
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_park_profiles_updated_at BEFORE UPDATE ON public.explore_park_profiles
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_campground_profiles_updated_at BEFORE UPDATE ON public.explore_campground_profiles
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_species_profiles_updated_at BEFORE UPDATE ON public.explore_species_profiles
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_business_profiles_updated_at BEFORE UPDATE ON public.explore_business_profiles
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

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

CREATE POLICY "service_role manages explore locations" ON public.explore_locations
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore media" ON public.explore_media
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore entity media" ON public.explore_entity_media
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore amenities" ON public.explore_amenities
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore entity amenities" ON public.explore_entity_amenities
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore activities" ON public.explore_activities
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore entity activities" ON public.explore_entity_activities
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore lake profiles" ON public.explore_lake_profiles
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore park profiles" ON public.explore_park_profiles
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore campground profiles" ON public.explore_campground_profiles
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore species profiles" ON public.explore_species_profiles
FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore business profiles" ON public.explore_business_profiles
FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO public.explore_amenities (key, name, category, sort_order) VALUES
  ('restrooms', 'Restrooms', 'general', 10),
  ('showers', 'Showers', 'camping', 20),
  ('potable_water', 'Potable Water', 'utilities', 30),
  ('electric_hookups', 'Electric Hookups', 'camping', 40),
  ('water_hookups', 'Water Hookups', 'camping', 50),
  ('sewer_hookups', 'Sewer Hookups', 'camping', 60),
  ('dump_station', 'Dump Station', 'camping', 70),
  ('boat_ramp', 'Boat Ramp', 'boating', 80),
  ('marina', 'Marina', 'boating', 90),
  ('playground', 'Playground', 'family', 100),
  ('picnic_area', 'Picnic Area', 'family', 110),
  ('visitor_center', 'Visitor Center', 'general', 120),
  ('accessible_parking', 'Accessible Parking', 'accessibility', 130),
  ('accessible_restrooms', 'Accessible Restrooms', 'accessibility', 140),
  ('wifi', 'Wi-Fi', 'utilities', 150),
  ('laundry', 'Laundry', 'camping', 160)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.explore_activities (key, name, category, sort_order) VALUES
  ('fishing', 'Fishing', 'water', 10),
  ('boating', 'Boating', 'water', 20),
  ('kayaking', 'Kayaking', 'water', 30),
  ('canoeing', 'Canoeing', 'water', 40),
  ('swimming', 'Swimming', 'water', 50),
  ('camping', 'Camping', 'outdoors', 60),
  ('hiking', 'Hiking', 'outdoors', 70),
  ('biking', 'Biking', 'outdoors', 80),
  ('bird_watching', 'Bird Watching', 'wildlife', 90),
  ('wildlife_viewing', 'Wildlife Viewing', 'wildlife', 100),
  ('wildflower_viewing', 'Wildflower Viewing', 'scenic', 110),
  ('photography', 'Photography', 'scenic', 120),
  ('history_tours', 'History Tours', 'history', 130),
  ('stargazing', 'Stargazing', 'scenic', 140),
  ('picnicking', 'Picnicking', 'family', 150)
ON CONFLICT (key) DO NOTHING;
