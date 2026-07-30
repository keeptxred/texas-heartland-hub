-- Explore Texas Phase II, Step 1A
-- Core entity, relationship, provenance, versioning, and import infrastructure.
-- Internal only: RLS is enabled and only service_role receives access.

CREATE OR REPLACE FUNCTION public.explore_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.explore_entity_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  name text NOT NULL,
  plural_name text NOT NULL,
  description text,
  icon_key text,
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
  short_description text,
  long_description text,
  summary text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','imported','validated','reviewed','published','verified','archived')),
  visibility text NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal','unlisted','public')),
  source_confidence smallint NOT NULL DEFAULT 0 CHECK (source_confidence BETWEEN 0 AND 100),
  featured boolean NOT NULL DEFAULT false,
  popularity_score numeric(10,4) NOT NULL DEFAULT 0 CHECK (popularity_score >= 0),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz,
  verified_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entities_public_requires_published
    CHECK (visibility <> 'public' OR status IN ('published','verified')),
  CONSTRAINT explore_entities_published_timestamp
    CHECK (published_at IS NULL OR status IN ('published','verified','archived')),
  CONSTRAINT explore_entities_verified_timestamp
    CHECK (verified_at IS NULL OR status IN ('verified','archived'))
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
  name text NOT NULL,
  reverse_name text NOT NULL,
  description text,
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
  effective_from timestamptz,
  effective_until timestamptz,
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
  base_url text,
  publisher text,
  license_name text,
  license_url text,
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
  source_url text,
  external_id text,
  field_paths text[] NOT NULL DEFAULT '{}',
  confidence smallint NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  retrieved_at timestamptz,
  verified_at timestamptz,
  notes text,
  raw_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entity_sources_unique UNIQUE NULLS NOT DISTINCT (entity_id, source_id, external_id, source_url)
);

CREATE TABLE public.explore_entity_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  version integer NOT NULL CHECK (version > 0),
  snapshot jsonb NOT NULL,
  change_summary text,
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
  started_at timestamptz,
  completed_at timestamptz,
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

CREATE TRIGGER trg_explore_entity_types_updated_at
BEFORE UPDATE ON public.explore_entity_types
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

CREATE TRIGGER trg_explore_entities_updated_at
BEFORE UPDATE ON public.explore_entities
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

CREATE TRIGGER trg_explore_relationship_types_updated_at
BEFORE UPDATE ON public.explore_relationship_types
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

CREATE TRIGGER trg_explore_entity_relationships_updated_at
BEFORE UPDATE ON public.explore_entity_relationships
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

CREATE TRIGGER trg_explore_sources_updated_at
BEFORE UPDATE ON public.explore_sources
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

CREATE TRIGGER trg_explore_entity_sources_updated_at
BEFORE UPDATE ON public.explore_entity_sources
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

CREATE TRIGGER trg_explore_import_jobs_updated_at
BEFORE UPDATE ON public.explore_import_jobs
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

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

CREATE POLICY "service_role manages explore entity types"
  ON public.explore_entity_types FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore entities"
  ON public.explore_entities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore slug history"
  ON public.explore_entity_slug_history FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore relationship types"
  ON public.explore_relationship_types FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore relationships"
  ON public.explore_entity_relationships FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore sources"
  ON public.explore_sources FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore entity sources"
  ON public.explore_entity_sources FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore entity versions"
  ON public.explore_entity_versions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore import jobs"
  ON public.explore_import_jobs FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO public.explore_entity_types (key, name, plural_name, sort_order) VALUES
  ('state', 'State', 'States', 10),
  ('region', 'Region', 'Regions', 20),
  ('county', 'County', 'Counties', 30),
  ('city', 'City', 'Cities', 40),
  ('lake', 'Lake', 'Lakes', 50),
  ('river', 'River', 'Rivers', 60),
  ('state_park', 'State Park', 'State Parks', 70),
  ('national_park', 'National Park', 'National Parks', 80),
  ('campground', 'Campground', 'Campgrounds', 90),
  ('historic_site', 'Historic Site', 'Historic Sites', 100),
  ('trail', 'Trail', 'Trails', 110),
  ('fish', 'Fish', 'Fish', 120),
  ('bird', 'Bird', 'Birds', 130),
  ('wildflower', 'Wildflower', 'Wildflowers', 140),
  ('tree', 'Tree', 'Trees', 150),
  ('animal', 'Animal', 'Animals', 160),
  ('business', 'Business', 'Businesses', 170),
  ('restaurant', 'Restaurant', 'Restaurants', 180),
  ('hotel', 'Hotel', 'Hotels', 190),
  ('event', 'Event', 'Events', 200),
  ('law', 'Law', 'Laws', 210),
  ('agency', 'Agency', 'Agencies', 220)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.explore_relationship_types
  (key, name, reverse_name, is_symmetric, default_weight)
VALUES
  ('located_in', 'Located in', 'Contains', false, 1),
  ('contains', 'Contains', 'Located in', false, 1),
  ('near', 'Near', 'Near', true, 0.8),
  ('flows_through', 'Flows through', 'Has waterway', false, 1),
  ('habitat_for', 'Habitat for', 'Found in', false, 1),
  ('managed_by', 'Managed by', 'Manages', false, 1),
  ('operated_by', 'Operated by', 'Operates', false, 1),
  ('part_of', 'Part of', 'Contains part', false, 1),
  ('connects_to', 'Connects to', 'Connects to', true, 1),
  ('offers', 'Offers', 'Offered by', false, 1),
  ('supports', 'Supports', 'Supported by', false, 1),
  ('protects', 'Protects', 'Protected by', false, 1),
  ('regulates', 'Regulates', 'Regulated by', false, 1),
  ('nearby_to', 'Nearby to', 'Nearby to', true, 0.8),
  ('recommended_with', 'Recommended with', 'Recommended with', true, 0.7)
ON CONFLICT (key) DO NOTHING;
