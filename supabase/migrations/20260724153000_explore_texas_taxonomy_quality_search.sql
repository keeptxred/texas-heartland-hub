-- Explore Texas Phase II, Step 1C
-- Taxonomy, observations, reviews, duplicate resolution, saved searches,
-- synonyms, and internal search-index infrastructure.
-- Internal only: RLS is enabled and only service_role receives access.

CREATE TABLE public.explore_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.explore_categories(id) ON DELETE SET NULL,
  key text NOT NULL UNIQUE CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  name text NOT NULL,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  icon_key text,
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
  description text,
  tag_group text,
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
  title text,
  value_text text,
  value_number numeric,
  unit text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  observed_at timestamptz NOT NULL,
  expires_at timestamptz,
  confidence smallint NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 100),
  review_status text NOT NULL DEFAULT 'needs_review' CHECK (review_status IN ('needs_review','validated','rejected','expired')),
  reviewed_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  source_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_observations_valid_expiration CHECK (expires_at IS NULL OR expires_at > observed_at),
  CONSTRAINT explore_observations_review_consistency CHECK (
    (reviewed_at IS NULL AND reviewed_by_user_id IS NULL)
    OR review_status IN ('validated','rejected','expired')
  )
);

CREATE TABLE public.explore_entity_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.explore_entities(id) ON DELETE CASCADE,
  review_type text NOT NULL DEFAULT 'editorial' CHECK (review_type IN ('editorial','factual','legal','media','seo','import')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','approved','changes_requested','rejected','cancelled')),
  assigned_to_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  due_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT explore_entity_reviews_valid_dates CHECK (
    (started_at IS NULL OR started_at >= created_at)
    AND (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at)
  )
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
  CONSTRAINT explore_duplicate_candidates_resolution CHECK (
    (status = 'pending' AND resolved_at IS NULL)
    OR status IN ('merged','not_duplicate','deferred')
  )
);

CREATE TABLE public.explore_saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  query_text text,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_key text,
  is_shared boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.explore_search_synonyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  normalized_term text NOT NULL,
  synonym text NOT NULL,
  synonym_normalized text NOT NULL,
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
  entity_type_key text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  alternate_names text[] NOT NULL DEFAULT '{}',
  category_names text[] NOT NULL DEFAULT '{}',
  tag_names text[] NOT NULL DEFAULT '{}',
  location_text text,
  searchable_text text NOT NULL DEFAULT '',
  document tsvector NOT NULL DEFAULT ''::tsvector,
  popularity_score numeric(10,4) NOT NULL DEFAULT 0,
  source_confidence smallint NOT NULL DEFAULT 0 CHECK (source_confidence BETWEEN 0 AND 100),
  visibility text NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal','unlisted','public')),
  status text NOT NULL,
  indexed_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_explore_entity_categories_one_primary
  ON public.explore_entity_categories (entity_id)
  WHERE is_primary = true;
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

CREATE OR REPLACE FUNCTION public.explore_search_index_document_refresh()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.document :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.alternate_names, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.category_names, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tag_names, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.location_text, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.searchable_text, '')), 'C');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_explore_search_index_document
BEFORE INSERT OR UPDATE OF name, alternate_names, category_names, tag_names, location_text, searchable_text
ON public.explore_search_index
FOR EACH ROW EXECUTE FUNCTION public.explore_search_index_document_refresh();

CREATE TRIGGER trg_explore_categories_updated_at
BEFORE UPDATE ON public.explore_categories
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_tags_updated_at
BEFORE UPDATE ON public.explore_tags
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_observations_updated_at
BEFORE UPDATE ON public.explore_observations
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_entity_reviews_updated_at
BEFORE UPDATE ON public.explore_entity_reviews
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_duplicate_candidates_updated_at
BEFORE UPDATE ON public.explore_duplicate_candidates
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_saved_searches_updated_at
BEFORE UPDATE ON public.explore_saved_searches
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_search_synonyms_updated_at
BEFORE UPDATE ON public.explore_search_synonyms
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();
CREATE TRIGGER trg_explore_search_index_updated_at
BEFORE UPDATE ON public.explore_search_index
FOR EACH ROW EXECUTE FUNCTION public.explore_set_updated_at();

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

CREATE POLICY "service_role manages explore categories" ON public.explore_categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore tags" ON public.explore_tags FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore entity categories" ON public.explore_entity_categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore entity tags" ON public.explore_entity_tags FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore observations" ON public.explore_observations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore entity reviews" ON public.explore_entity_reviews FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore duplicate candidates" ON public.explore_duplicate_candidates FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore saved searches" ON public.explore_saved_searches FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore search synonyms" ON public.explore_search_synonyms FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role manages explore search index" ON public.explore_search_index FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO public.explore_categories (key, name, slug, sort_order) VALUES
  ('outdoors', 'Outdoors', 'outdoors', 10),
  ('water_recreation', 'Water Recreation', 'water-recreation', 20),
  ('camping', 'Camping', 'camping', 30),
  ('wildlife', 'Wildlife', 'wildlife', 40),
  ('history', 'History', 'history', 50),
  ('family_travel', 'Family Travel', 'family-travel', 60),
  ('scenic', 'Scenic', 'scenic', 70),
  ('food_and_lodging', 'Food & Lodging', 'food-and-lodging', 80)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.explore_tags (key, name, slug, tag_group) VALUES
  ('kid_friendly', 'Kid Friendly', 'kid-friendly', 'audience'),
  ('pet_friendly', 'Pet Friendly', 'pet-friendly', 'access'),
  ('wheelchair_accessible', 'Wheelchair Accessible', 'wheelchair-accessible', 'access'),
  ('free_admission', 'Free Admission', 'free-admission', 'cost'),
  ('kayaking', 'Kayaking', 'kayaking', 'activity'),
  ('bird_watching', 'Bird Watching', 'bird-watching', 'activity'),
  ('dark_sky', 'Dark Sky', 'dark-sky', 'experience'),
  ('historic', 'Historic', 'historic', 'experience'),
  ('scenic_drive', 'Scenic Drive', 'scenic-drive', 'activity')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.explore_search_synonyms
  (term, normalized_term, synonym, synonym_normalized, relationship, is_bidirectional)
VALUES
  ('Texas Parks and Wildlife Department', 'texas parks and wildlife department', 'TPWD', 'tpwd', 'abbreviation', true),
  ('Bluebonnets', 'bluebonnets', 'Blue Bonnets', 'blue bonnets', 'misspelling', true),
  ('Lyndon B. Johnson', 'lyndon b johnson', 'LBJ', 'lbj', 'abbreviation', true)
ON CONFLICT (normalized_term, synonym_normalized, relationship) DO NOTHING;
