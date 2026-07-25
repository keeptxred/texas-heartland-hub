-- Explore Texas Phase II, Step 3
-- Transactional duplicate entity merge service.

CREATE OR REPLACE FUNCTION public.explore_merge_entities(
  p_candidate_id uuid,
  p_survivor_entity_id uuid,
  p_merged_entity_id uuid,
  p_resolution_notes text DEFAULT NULL,
  p_resolved_by_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_candidate public.explore_duplicate_candidates%ROWTYPE;
  v_survivor public.explore_entities%ROWTYPE;
  v_merged public.explore_entities%ROWTYPE;
  v_archived_slug text;
  v_now timestamptz := now();
BEGIN
  IF p_survivor_entity_id = p_merged_entity_id THEN
    RAISE EXCEPTION 'Survivor and merged entity must be different.' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_candidate
  FROM public.explore_duplicate_candidates
  WHERE id = p_candidate_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Duplicate candidate % was not found.', p_candidate_id USING ERRCODE = 'P0002';
  END IF;

  IF v_candidate.status <> 'pending' THEN
    RAISE EXCEPTION 'Duplicate candidate % is no longer pending.', p_candidate_id USING ERRCODE = '55000';
  END IF;

  IF NOT (
    (v_candidate.entity_a_id = p_survivor_entity_id AND v_candidate.entity_b_id = p_merged_entity_id)
    OR
    (v_candidate.entity_b_id = p_survivor_entity_id AND v_candidate.entity_a_id = p_merged_entity_id)
  ) THEN
    RAISE EXCEPTION 'The selected entities do not match duplicate candidate %.', p_candidate_id USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_survivor
  FROM public.explore_entities
  WHERE id = p_survivor_entity_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Survivor entity % was not found.', p_survivor_entity_id USING ERRCODE = 'P0002';
  END IF;

  SELECT * INTO v_merged
  FROM public.explore_entities
  WHERE id = p_merged_entity_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Merged entity % was not found.', p_merged_entity_id USING ERRCODE = 'P0002';
  END IF;

  IF v_survivor.entity_type_id <> v_merged.entity_type_id THEN
    RAISE EXCEPTION 'Entities of different types cannot be merged.' USING ERRCODE = '22023';
  END IF;

  IF v_merged.status = 'archived' THEN
    RAISE EXCEPTION 'Merged entity % is already archived.', p_merged_entity_id USING ERRCODE = '55000';
  END IF;

  -- Preserve the losing entity state and the survivor state before mutation.
  INSERT INTO public.explore_entity_versions (
    entity_id,
    version,
    snapshot,
    change_summary,
    change_source,
    changed_by_user_id
  ) VALUES (
    p_survivor_entity_id,
    v_survivor.version + 1,
    to_jsonb(v_survivor),
    format('Pre-merge snapshot before absorbing entity %s', p_merged_entity_id),
    'system',
    p_resolved_by_user_id
  );

  -- Merge source attribution.
  INSERT INTO public.explore_entity_sources (
    entity_id, source_id, source_url, external_id, field_paths, confidence,
    retrieved_at, verified_at, notes, raw_metadata, created_at, updated_at
  )
  SELECT
    p_survivor_entity_id, source_id, source_url, external_id, field_paths, confidence,
    retrieved_at, verified_at, notes, raw_metadata, created_at, v_now
  FROM public.explore_entity_sources
  WHERE entity_id = p_merged_entity_id
  ON CONFLICT ON CONSTRAINT explore_entity_sources_unique DO UPDATE SET
    field_paths = ARRAY(
      SELECT DISTINCT value
      FROM unnest(public.explore_entity_sources.field_paths || EXCLUDED.field_paths) AS value
    ),
    confidence = GREATEST(public.explore_entity_sources.confidence, EXCLUDED.confidence),
    retrieved_at = GREATEST(public.explore_entity_sources.retrieved_at, EXCLUDED.retrieved_at),
    verified_at = GREATEST(public.explore_entity_sources.verified_at, EXCLUDED.verified_at),
    notes = concat_ws(E'\n', public.explore_entity_sources.notes, EXCLUDED.notes),
    raw_metadata = public.explore_entity_sources.raw_metadata || EXCLUDED.raw_metadata,
    updated_at = v_now;
  DELETE FROM public.explore_entity_sources WHERE entity_id = p_merged_entity_id;

  -- Merge media while avoiding partial-primary-index collisions.
  INSERT INTO public.explore_entity_media (
    entity_id, media_id, role, sort_order, is_primary, metadata, created_at, updated_at
  )
  SELECT p_survivor_entity_id, media_id, role, sort_order, false, metadata, created_at, v_now
  FROM public.explore_entity_media
  WHERE entity_id = p_merged_entity_id
  ON CONFLICT ON CONSTRAINT explore_entity_media_unique DO UPDATE SET
    sort_order = LEAST(public.explore_entity_media.sort_order, EXCLUDED.sort_order),
    metadata = public.explore_entity_media.metadata || EXCLUDED.metadata,
    updated_at = v_now;
  DELETE FROM public.explore_entity_media WHERE entity_id = p_merged_entity_id;

  INSERT INTO public.explore_entity_amenities (
    entity_id, amenity_id, availability, quantity, fee_required, notes, metadata,
    verified_at, created_at, updated_at
  )
  SELECT p_survivor_entity_id, amenity_id, availability, quantity, fee_required, notes,
    metadata, verified_at, created_at, v_now
  FROM public.explore_entity_amenities
  WHERE entity_id = p_merged_entity_id
  ON CONFLICT ON CONSTRAINT explore_entity_amenities_unique DO UPDATE SET
    quantity = GREATEST(public.explore_entity_amenities.quantity, EXCLUDED.quantity),
    fee_required = COALESCE(public.explore_entity_amenities.fee_required, EXCLUDED.fee_required),
    notes = concat_ws(E'\n', public.explore_entity_amenities.notes, EXCLUDED.notes),
    metadata = public.explore_entity_amenities.metadata || EXCLUDED.metadata,
    verified_at = GREATEST(public.explore_entity_amenities.verified_at, EXCLUDED.verified_at),
    updated_at = v_now;
  DELETE FROM public.explore_entity_amenities WHERE entity_id = p_merged_entity_id;

  INSERT INTO public.explore_entity_activities (
    entity_id, activity_id, suitability, best_months, skill_level, fee_required,
    permit_required, notes, metadata, verified_at, created_at, updated_at
  )
  SELECT p_survivor_entity_id, activity_id, suitability, best_months, skill_level,
    fee_required, permit_required, notes, metadata, verified_at, created_at, v_now
  FROM public.explore_entity_activities
  WHERE entity_id = p_merged_entity_id
  ON CONFLICT ON CONSTRAINT explore_entity_activities_unique DO UPDATE SET
    best_months = ARRAY(
      SELECT DISTINCT value
      FROM unnest(public.explore_entity_activities.best_months || EXCLUDED.best_months) AS value
      ORDER BY value
    ),
    skill_level = COALESCE(public.explore_entity_activities.skill_level, EXCLUDED.skill_level),
    fee_required = COALESCE(public.explore_entity_activities.fee_required, EXCLUDED.fee_required),
    permit_required = COALESCE(public.explore_entity_activities.permit_required, EXCLUDED.permit_required),
    notes = concat_ws(E'\n', public.explore_entity_activities.notes, EXCLUDED.notes),
    metadata = public.explore_entity_activities.metadata || EXCLUDED.metadata,
    verified_at = GREATEST(public.explore_entity_activities.verified_at, EXCLUDED.verified_at),
    updated_at = v_now;
  DELETE FROM public.explore_entity_activities WHERE entity_id = p_merged_entity_id;

  INSERT INTO public.explore_entity_categories (entity_id, category_id, is_primary, sort_order, created_at)
  SELECT p_survivor_entity_id, category_id, false, sort_order, created_at
  FROM public.explore_entity_categories
  WHERE entity_id = p_merged_entity_id
  ON CONFLICT (entity_id, category_id) DO UPDATE SET
    sort_order = LEAST(public.explore_entity_categories.sort_order, EXCLUDED.sort_order);
  DELETE FROM public.explore_entity_categories WHERE entity_id = p_merged_entity_id;

  INSERT INTO public.explore_entity_tags (entity_id, tag_id, source, confidence, created_at)
  SELECT p_survivor_entity_id, tag_id, source, confidence, created_at
  FROM public.explore_entity_tags
  WHERE entity_id = p_merged_entity_id
  ON CONFLICT (entity_id, tag_id) DO UPDATE SET
    confidence = GREATEST(public.explore_entity_tags.confidence, EXCLUDED.confidence);
  DELETE FROM public.explore_entity_tags WHERE entity_id = p_merged_entity_id;

  UPDATE public.explore_observations SET entity_id = p_survivor_entity_id, updated_at = v_now
  WHERE entity_id = p_merged_entity_id;
  UPDATE public.explore_entity_reviews SET entity_id = p_survivor_entity_id, updated_at = v_now
  WHERE entity_id = p_merged_entity_id;

  -- Rebuild all incoming and outgoing graph edges around the survivor.
  INSERT INTO public.explore_entity_relationships (
    relationship_type_id, source_entity_id, target_entity_id, weight, priority,
    metadata, effective_from, effective_until, is_active, created_at, updated_at
  )
  SELECT
    relationship_type_id,
    CASE WHEN source_entity_id = p_merged_entity_id THEN p_survivor_entity_id ELSE source_entity_id END,
    CASE WHEN target_entity_id = p_merged_entity_id THEN p_survivor_entity_id ELSE target_entity_id END,
    weight, priority, metadata, effective_from, effective_until, is_active, created_at, v_now
  FROM public.explore_entity_relationships
  WHERE source_entity_id = p_merged_entity_id OR target_entity_id = p_merged_entity_id
  AND NOT (
    CASE WHEN source_entity_id = p_merged_entity_id THEN p_survivor_entity_id ELSE source_entity_id END
    =
    CASE WHEN target_entity_id = p_merged_entity_id THEN p_survivor_entity_id ELSE target_entity_id END
  )
  ON CONFLICT ON CONSTRAINT explore_relationship_unique DO UPDATE SET
    weight = GREATEST(public.explore_entity_relationships.weight, EXCLUDED.weight),
    metadata = public.explore_entity_relationships.metadata || EXCLUDED.metadata,
    effective_from = LEAST(public.explore_entity_relationships.effective_from, EXCLUDED.effective_from),
    effective_until = GREATEST(public.explore_entity_relationships.effective_until, EXCLUDED.effective_until),
    is_active = public.explore_entity_relationships.is_active OR EXCLUDED.is_active,
    updated_at = v_now;
  DELETE FROM public.explore_entity_relationships
  WHERE source_entity_id = p_merged_entity_id OR target_entity_id = p_merged_entity_id;

  -- Preserve the old public slug as history for the survivor, then free it on the archive record.
  INSERT INTO public.explore_entity_slug_history (
    entity_id, slug, replaced_at, replaced_by_user_id, reason
  ) VALUES (
    p_survivor_entity_id,
    v_merged.slug,
    v_now,
    p_resolved_by_user_id,
    format('Merged duplicate entity %s into %s', p_merged_entity_id, p_survivor_entity_id)
  )
  ON CONFLICT (slug) DO UPDATE SET
    entity_id = EXCLUDED.entity_id,
    replaced_at = EXCLUDED.replaced_at,
    replaced_by_user_id = EXCLUDED.replaced_by_user_id,
    reason = EXCLUDED.reason;

  v_archived_slug := v_merged.slug || '-merged-' || left(replace(p_merged_entity_id::text, '-', ''), 12);

  UPDATE public.explore_entities
  SET
    alternate_names = ARRAY(
      SELECT DISTINCT value
      FROM unnest(v_survivor.alternate_names || v_merged.alternate_names || ARRAY[v_merged.name]) AS value
      WHERE nullif(trim(value), '') IS NOT NULL
    ),
    short_description = COALESCE(v_survivor.short_description, v_merged.short_description),
    long_description = COALESCE(v_survivor.long_description, v_merged.long_description),
    summary = COALESCE(v_survivor.summary, v_merged.summary),
    source_confidence = GREATEST(v_survivor.source_confidence, v_merged.source_confidence),
    featured = v_survivor.featured OR v_merged.featured,
    popularity_score = GREATEST(v_survivor.popularity_score, v_merged.popularity_score),
    version = v_survivor.version + 1,
    updated_at = v_now
  WHERE id = p_survivor_entity_id;

  UPDATE public.explore_entities
  SET
    slug = v_archived_slug,
    status = 'archived',
    visibility = 'internal',
    featured = false,
    archived_at = v_now,
    updated_at = v_now
  WHERE id = p_merged_entity_id;

  DELETE FROM public.explore_search_index WHERE entity_id = p_merged_entity_id;

  UPDATE public.explore_duplicate_candidates
  SET
    status = 'merged',
    resolution_notes = nullif(trim(p_resolution_notes), ''),
    resolved_by_user_id = p_resolved_by_user_id,
    resolved_at = v_now,
    updated_at = v_now
  WHERE id = p_candidate_id;

  UPDATE public.explore_duplicate_candidates
  SET
    status = 'deferred',
    resolution_notes = concat_ws(E'\n', resolution_notes, format('Automatically deferred because entity %s was merged into %s.', p_merged_entity_id, p_survivor_entity_id)),
    resolved_by_user_id = p_resolved_by_user_id,
    resolved_at = v_now,
    updated_at = v_now
  WHERE id <> p_candidate_id
    AND status = 'pending'
    AND (entity_a_id = p_merged_entity_id OR entity_b_id = p_merged_entity_id);

  RETURN jsonb_build_object(
    'candidateId', p_candidate_id,
    'survivorEntityId', p_survivor_entity_id,
    'mergedEntityId', p_merged_entity_id,
    'archivedSlug', v_archived_slug,
    'mergedAt', v_now
  );
END;
$$;

REVOKE ALL ON FUNCTION public.explore_merge_entities(uuid, uuid, uuid, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.explore_merge_entities(uuid, uuid, uuid, text, uuid) TO service_role;
