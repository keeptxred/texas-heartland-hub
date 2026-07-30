
CREATE OR REPLACE FUNCTION public.explore_merge_entities(
  p_survivor_id uuid,
  p_loser_id uuid,
  p_resolved_by uuid DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $fn$
DECLARE
  v_survivor public.explore_entities%ROWTYPE;
  v_loser    public.explore_entities%ROWTYPE;
  v_loser_slug text;
  v_max_version int;
  v_snapshot jsonb;
  v_counts jsonb := '{}'::jsonb;
  v_rows int;
BEGIN
  IF p_survivor_id IS NULL OR p_loser_id IS NULL THEN
    RAISE EXCEPTION 'Survivor and loser entity IDs are required'
      USING ERRCODE = '22004';
  END IF;

  IF p_survivor_id = p_loser_id THEN
    RAISE EXCEPTION 'Cannot merge an entity into itself (%).', p_survivor_id
      USING ERRCODE = '22023';
  END IF;

  -- Lock rows in a deterministic order to avoid deadlocks between concurrent merges.
  IF p_survivor_id < p_loser_id THEN
    SELECT * INTO v_survivor FROM public.explore_entities WHERE id = p_survivor_id FOR UPDATE;
    SELECT * INTO v_loser    FROM public.explore_entities WHERE id = p_loser_id    FOR UPDATE;
  ELSE
    SELECT * INTO v_loser    FROM public.explore_entities WHERE id = p_loser_id    FOR UPDATE;
    SELECT * INTO v_survivor FROM public.explore_entities WHERE id = p_survivor_id FOR UPDATE;
  END IF;

  IF v_survivor.id IS NULL THEN
    RAISE EXCEPTION 'Survivor entity % not found', p_survivor_id USING ERRCODE = 'P0002';
  END IF;
  IF v_loser.id IS NULL THEN
    RAISE EXCEPTION 'Loser entity % not found', p_loser_id USING ERRCODE = 'P0002';
  END IF;
  IF v_survivor.status = 'archived' THEN
    RAISE EXCEPTION 'Survivor entity % is archived and cannot be a merge target', p_survivor_id
      USING ERRCODE = '22023';
  END IF;
  IF v_loser.status = 'archived' THEN
    RAISE EXCEPTION 'Loser entity % is already archived', p_loser_id
      USING ERRCODE = '22023';
  END IF;

  v_loser_slug := v_loser.slug;

  -- Snapshot loser for audit
  v_snapshot := to_jsonb(v_loser);

  ------------------------------------------------------------------
  -- Slug history: preserve old slug so URLs still resolve.
  ------------------------------------------------------------------
  -- Move any existing slug history rows from loser -> survivor (skip collisions).
  UPDATE public.explore_entity_slug_history h
     SET entity_id = v_survivor.id
   WHERE h.entity_id = v_loser.id
     AND NOT EXISTS (
       SELECT 1 FROM public.explore_entity_slug_history h2
        WHERE h2.slug = h.slug AND h2.id <> h.id
     );
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  v_counts := jsonb_set(v_counts, '{slug_history_moved}', to_jsonb(v_rows));

  -- Delete any that would collide (already had that slug elsewhere).
  DELETE FROM public.explore_entity_slug_history WHERE entity_id = v_loser.id;

  -- Free the loser's slug so future entities can reuse it, then archive it into history.
  UPDATE public.explore_entities
     SET slug = 'merged-' || v_loser.id::text
   WHERE id = v_loser.id;

  IF NOT EXISTS (SELECT 1 FROM public.explore_entity_slug_history WHERE slug = v_loser_slug) THEN
    INSERT INTO public.explore_entity_slug_history (entity_id, slug, replaced_by_user_id, reason)
    VALUES (v_survivor.id, v_loser_slug, p_resolved_by,
            'Merged from entity ' || v_loser.id::text || COALESCE(': ' || p_notes, ''));
  END IF;

  ------------------------------------------------------------------
  -- Relationships (directional). Reassign both sides, drop self-refs,
  -- keep richer metadata on collision.
  ------------------------------------------------------------------
  -- Source-side reassignment
  UPDATE public.explore_entity_relationships r
     SET source_entity_id = v_survivor.id
   WHERE r.source_entity_id = v_loser.id
     AND r.target_entity_id <> v_survivor.id
     AND NOT EXISTS (
       SELECT 1 FROM public.explore_entity_relationships r2
        WHERE r2.relationship_type_id = r.relationship_type_id
          AND r2.source_entity_id = v_survivor.id
          AND r2.target_entity_id = r.target_entity_id
     );

  -- Target-side reassignment
  UPDATE public.explore_entity_relationships r
     SET target_entity_id = v_survivor.id
   WHERE r.target_entity_id = v_loser.id
     AND r.source_entity_id <> v_survivor.id
     AND NOT EXISTS (
       SELECT 1 FROM public.explore_entity_relationships r2
        WHERE r2.relationship_type_id = r.relationship_type_id
          AND r2.source_entity_id = r.source_entity_id
          AND r2.target_entity_id = v_survivor.id
     );

  -- Delete leftovers: self-refs and unresolvable collisions.
  DELETE FROM public.explore_entity_relationships
   WHERE source_entity_id = v_loser.id
      OR target_entity_id = v_loser.id
      OR source_entity_id = target_entity_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  v_counts := jsonb_set(v_counts, '{relationships_pruned}', to_jsonb(v_rows));

  ------------------------------------------------------------------
  -- One-to-one profile tables — keep survivor's if present, else transfer.
  ------------------------------------------------------------------
  UPDATE public.explore_lake_profiles SET entity_id = v_survivor.id
   WHERE entity_id = v_loser.id
     AND NOT EXISTS (SELECT 1 FROM public.explore_lake_profiles WHERE entity_id = v_survivor.id);
  DELETE FROM public.explore_lake_profiles WHERE entity_id = v_loser.id;

  UPDATE public.explore_park_profiles SET entity_id = v_survivor.id
   WHERE entity_id = v_loser.id
     AND NOT EXISTS (SELECT 1 FROM public.explore_park_profiles WHERE entity_id = v_survivor.id);
  DELETE FROM public.explore_park_profiles WHERE entity_id = v_loser.id;

  UPDATE public.explore_campground_profiles SET entity_id = v_survivor.id
   WHERE entity_id = v_loser.id
     AND NOT EXISTS (SELECT 1 FROM public.explore_campground_profiles WHERE entity_id = v_survivor.id);
  DELETE FROM public.explore_campground_profiles WHERE entity_id = v_loser.id;

  UPDATE public.explore_species_profiles SET entity_id = v_survivor.id
   WHERE entity_id = v_loser.id
     AND NOT EXISTS (SELECT 1 FROM public.explore_species_profiles WHERE entity_id = v_survivor.id);
  DELETE FROM public.explore_species_profiles WHERE entity_id = v_loser.id;

  UPDATE public.explore_business_profiles SET entity_id = v_survivor.id
   WHERE entity_id = v_loser.id
     AND NOT EXISTS (SELECT 1 FROM public.explore_business_profiles WHERE entity_id = v_survivor.id);
  DELETE FROM public.explore_business_profiles WHERE entity_id = v_loser.id;

  ------------------------------------------------------------------
  -- Locations (entity_id UNIQUE — one per entity). Transfer only if survivor lacks one.
  ------------------------------------------------------------------
  UPDATE public.explore_locations SET entity_id = v_survivor.id
   WHERE entity_id = v_loser.id
     AND NOT EXISTS (SELECT 1 FROM public.explore_locations WHERE entity_id = v_survivor.id);
  DELETE FROM public.explore_locations WHERE entity_id = v_loser.id;

  ------------------------------------------------------------------
  -- Many-to-many join tables. Reassign, skipping collisions.
  ------------------------------------------------------------------
  UPDATE public.explore_entity_media m
     SET entity_id = v_survivor.id
   WHERE m.entity_id = v_loser.id
     AND NOT EXISTS (
       SELECT 1 FROM public.explore_entity_media m2
        WHERE m2.entity_id = v_survivor.id
          AND m2.media_id = m.media_id
          AND m2.role = m.role
     );
  DELETE FROM public.explore_entity_media WHERE entity_id = v_loser.id;

  UPDATE public.explore_entity_amenities a
     SET entity_id = v_survivor.id
   WHERE a.entity_id = v_loser.id
     AND NOT EXISTS (
       SELECT 1 FROM public.explore_entity_amenities a2
        WHERE a2.entity_id = v_survivor.id AND a2.amenity_id = a.amenity_id
     );
  DELETE FROM public.explore_entity_amenities WHERE entity_id = v_loser.id;

  UPDATE public.explore_entity_activities a
     SET entity_id = v_survivor.id
   WHERE a.entity_id = v_loser.id
     AND NOT EXISTS (
       SELECT 1 FROM public.explore_entity_activities a2
        WHERE a2.entity_id = v_survivor.id AND a2.activity_id = a.activity_id
     );
  DELETE FROM public.explore_entity_activities WHERE entity_id = v_loser.id;

  UPDATE public.explore_entity_categories c
     SET entity_id = v_survivor.id
   WHERE c.entity_id = v_loser.id
     AND NOT EXISTS (
       SELECT 1 FROM public.explore_entity_categories c2
        WHERE c2.entity_id = v_survivor.id AND c2.category_id = c.category_id
     );
  DELETE FROM public.explore_entity_categories WHERE entity_id = v_loser.id;

  UPDATE public.explore_entity_tags t
     SET entity_id = v_survivor.id
   WHERE t.entity_id = v_loser.id
     AND NOT EXISTS (
       SELECT 1 FROM public.explore_entity_tags t2
        WHERE t2.entity_id = v_survivor.id AND t2.tag_id = t.tag_id
     );
  DELETE FROM public.explore_entity_tags WHERE entity_id = v_loser.id;

  UPDATE public.explore_entity_sources s
     SET entity_id = v_survivor.id
   WHERE s.entity_id = v_loser.id
     AND NOT EXISTS (
       SELECT 1 FROM public.explore_entity_sources s2
        WHERE s2.entity_id = v_survivor.id
          AND s2.source_id = s.source_id
          AND s2.external_id IS NOT DISTINCT FROM s.external_id
          AND s2.source_url IS NOT DISTINCT FROM s.source_url
     );
  DELETE FROM public.explore_entity_sources WHERE entity_id = v_loser.id;

  UPDATE public.explore_observations SET entity_id = v_survivor.id WHERE entity_id = v_loser.id;
  UPDATE public.explore_entity_reviews SET entity_id = v_survivor.id WHERE entity_id = v_loser.id;

  ------------------------------------------------------------------
  -- Version history — renumber to sit after survivor's current max.
  ------------------------------------------------------------------
  SELECT COALESCE(MAX(version), 0) INTO v_max_version
    FROM public.explore_entity_versions WHERE entity_id = v_survivor.id;

  UPDATE public.explore_entity_versions v
     SET entity_id = v_survivor.id,
         version = v_max_version + v.version
   WHERE v.entity_id = v_loser.id;

  -- Search index — one row per entity, refresh trigger on survivor's entity will rebuild.
  DELETE FROM public.explore_search_index WHERE entity_id = v_loser.id;

  ------------------------------------------------------------------
  -- Duplicate candidates: resolve any pending ones that reference the loser.
  ------------------------------------------------------------------
  UPDATE public.explore_duplicate_candidates
     SET status = 'merged',
         resolved_by_user_id = COALESCE(resolved_by_user_id, p_resolved_by),
         resolved_at = COALESCE(resolved_at, now()),
         resolution_notes = COALESCE(resolution_notes,
           'Auto-resolved: entity ' || v_loser.id::text || ' merged into ' || v_survivor.id::text),
         updated_at = now()
   WHERE (entity_a_id = v_loser.id OR entity_b_id = v_loser.id)
     AND status = 'pending';

  ------------------------------------------------------------------
  -- Record audit version on survivor and archive the loser.
  ------------------------------------------------------------------
  INSERT INTO public.explore_entity_versions (entity_id, version, snapshot, change_summary, change_source, changed_by_user_id)
  VALUES (
    v_survivor.id,
    v_max_version + COALESCE((SELECT MAX(version) FROM public.explore_entity_versions WHERE entity_id = v_survivor.id AND version > v_max_version), 0) + 1,
    jsonb_build_object('merged_from', v_snapshot, 'notes', p_notes),
    'Merged entity ' || v_loser.id::text || ' (' || v_loser_slug || ') into survivor',
    'merge',
    p_resolved_by
  );

  UPDATE public.explore_entities
     SET status = 'archived',
         visibility = 'internal',
         archived_at = now(),
         updated_at = now(),
         version = version + 1
   WHERE id = v_loser.id;

  UPDATE public.explore_entities
     SET updated_at = now(),
         version = version + 1
   WHERE id = v_survivor.id;

  RETURN jsonb_build_object(
    'survivor_id', v_survivor.id,
    'loser_id', v_loser.id,
    'archived_slug', v_loser_slug,
    'resolved_by', p_resolved_by,
    'counts', v_counts,
    'merged_at', now()
  );
END;
$fn$;

COMMENT ON FUNCTION public.explore_merge_entities(uuid, uuid, uuid, text) IS
'Atomically merges the loser Explore entity into the survivor: reassigns all related rows (locations, media, amenities, activities, tags, categories, sources, observations, reviews, relationships, one-to-one profiles, slug history, versions), archives the loser, preserves the loser slug in slug history, records a version snapshot on the survivor, and resolves related duplicate candidates. Restricted to service_role.';

REVOKE ALL ON FUNCTION public.explore_merge_entities(uuid, uuid, uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.explore_merge_entities(uuid, uuid, uuid, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.explore_merge_entities(uuid, uuid, uuid, text) TO service_role;

------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.explore_merge_duplicate_candidate(
  p_candidate_id uuid,
  p_survivor_id uuid,
  p_resolved_by uuid DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $fn$
DECLARE
  v_candidate public.explore_duplicate_candidates%ROWTYPE;
  v_loser_id uuid;
  v_merge_result jsonb;
BEGIN
  IF p_candidate_id IS NULL OR p_survivor_id IS NULL THEN
    RAISE EXCEPTION 'candidate_id and survivor_id are required' USING ERRCODE = '22004';
  END IF;

  SELECT * INTO v_candidate
    FROM public.explore_duplicate_candidates
   WHERE id = p_candidate_id
   FOR UPDATE;

  IF v_candidate.id IS NULL THEN
    RAISE EXCEPTION 'Duplicate candidate % not found', p_candidate_id USING ERRCODE = 'P0002';
  END IF;
  IF v_candidate.status <> 'pending' THEN
    RAISE EXCEPTION 'Duplicate candidate % is already %', p_candidate_id, v_candidate.status
      USING ERRCODE = '22023';
  END IF;

  IF p_survivor_id = v_candidate.entity_a_id THEN
    v_loser_id := v_candidate.entity_b_id;
  ELSIF p_survivor_id = v_candidate.entity_b_id THEN
    v_loser_id := v_candidate.entity_a_id;
  ELSE
    RAISE EXCEPTION 'Survivor % is not part of duplicate candidate %', p_survivor_id, p_candidate_id
      USING ERRCODE = '22023';
  END IF;

  v_merge_result := public.explore_merge_entities(p_survivor_id, v_loser_id, p_resolved_by, p_notes);

  UPDATE public.explore_duplicate_candidates
     SET status = 'merged',
         resolved_by_user_id = p_resolved_by,
         resolved_at = now(),
         resolution_notes = COALESCE(p_notes, resolution_notes),
         updated_at = now()
   WHERE id = p_candidate_id;

  RETURN jsonb_build_object(
    'candidate_id', p_candidate_id,
    'merge', v_merge_result
  );
END;
$fn$;

COMMENT ON FUNCTION public.explore_merge_duplicate_candidate(uuid, uuid, uuid, text) IS
'Admin-facing entrypoint that resolves an explore_duplicate_candidates row by merging its two entities. Validates the survivor belongs to the candidate, runs explore_merge_entities atomically, and marks the candidate as merged. Restricted to service_role.';

REVOKE ALL ON FUNCTION public.explore_merge_duplicate_candidate(uuid, uuid, uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.explore_merge_duplicate_candidate(uuid, uuid, uuid, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.explore_merge_duplicate_candidate(uuid, uuid, uuid, text) TO service_role;
