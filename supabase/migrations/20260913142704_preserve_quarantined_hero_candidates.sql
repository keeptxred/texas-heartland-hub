CREATE OR REPLACE FUNCTION public.enforce_article_hero_visual_readiness()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
DECLARE
  candidate_url text;
  candidate_alt text;
  candidate_note text;
  old_ready boolean := false;
  new_ready boolean := false;
  candidate_was_quarantined boolean := false;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    old_ready := nullif(btrim(coalesce(OLD.featured_image_url, '')), '') IS NOT NULL
      AND lower(coalesce(OLD.image_generation_status, '')) = 'ready'
      AND public.article_hero_has_visual_readiness_provenance(OLD.image_validation_note);

    IF OLD.image_validation_note IS DISTINCT FROM NEW.image_validation_note
       AND nullif(btrim(coalesce(OLD.image_validation_note, '')), '') IS NOT NULL
    THEN
      NEW.image_validation_history := coalesce(OLD.image_validation_history, '[]'::jsonb)
        || jsonb_build_array(jsonb_build_object(
          'at', now(),
          'event', 'validation_note_replaced',
          'url', OLD.featured_image_url,
          'note', left(OLD.image_validation_note, 1000)
        ));
    END IF;
  END IF;

  new_ready := nullif(btrim(coalesce(NEW.featured_image_url, '')), '') IS NOT NULL
    AND lower(coalesce(NEW.image_generation_status, '')) = 'ready'
    AND public.article_hero_has_visual_readiness_provenance(NEW.image_validation_note);

  IF nullif(btrim(coalesce(NEW.featured_image_url, '')), '') IS NOT NULL
     AND lower(coalesce(NEW.image_generation_status, '')) = 'ready'
     AND NOT new_ready
  THEN
    candidate_was_quarantined := true;
    candidate_url := NEW.featured_image_url;
    candidate_alt := NEW.image_alt_text;
    candidate_note := NEW.image_validation_note;

    NEW.image_candidate_url := candidate_url;
    NEW.image_candidate_alt_text := candidate_alt;
    NEW.quality_flags := ARRAY(
      SELECT DISTINCT flag
      FROM unnest(coalesce(NEW.quality_flags, '{}'::text[]) || ARRAY['image_requires_visual_validation']::text[]) AS flag
    );
    NEW.image_validation_history := coalesce(NEW.image_validation_history, '[]'::jsonb)
      || jsonb_build_array(jsonb_build_object(
        'at', now(),
        'event', 'unvalidated_candidate_quarantined',
        'url', candidate_url,
        'note', left(coalesce(candidate_note, 'No validation note supplied.'), 1000)
      ));

    IF TG_OP = 'UPDATE' AND old_ready THEN
      NEW.featured_image_url := OLD.featured_image_url;
      NEW.image_url := OLD.image_url;
      NEW.image_alt_text := OLD.image_alt_text;
      NEW.image_generation_status := OLD.image_generation_status;
      NEW.image_validation_note := OLD.image_validation_note;
    ELSE
      NEW.featured_image_url := NULL;
      IF NEW.image_url IS NULL OR NEW.image_url = candidate_url THEN
        NEW.image_url := NULL;
      END IF;
      NEW.image_alt_text := NULL;
      NEW.image_generation_status := 'pending';
      NEW.image_validation_note := 'hero-readiness hold: candidate requires visual validation before publication';
    END IF;
  END IF;

  IF NOT candidate_was_quarantined
     AND public.article_hero_has_visual_readiness_provenance(NEW.image_validation_note)
     AND nullif(btrim(coalesce(NEW.featured_image_url, '')), '') IS NOT NULL
  THEN
    NEW.quality_flags := array_remove(coalesce(NEW.quality_flags, '{}'::text[]), 'image_requires_visual_validation');
    NEW.image_candidate_url := NULL;
    NEW.image_candidate_alt_text := NULL;
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.enforce_article_hero_visual_readiness() IS
  'Quarantines unvalidated ready hero assignments, preserves prior validated heroes and pending candidates, clears superseded candidates after a validated replacement, and keeps validation history.';
