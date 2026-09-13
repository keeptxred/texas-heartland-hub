-- BULK_ARTICLE_MAINTENANCE
-- Enforce one visual-readiness contract for every published article hero.
-- Generated images, licensed archive photos, Wikimedia images, and manually
-- selected external images must carry visual-validation provenance before they
-- can become the canonical ready hero. Authoritative official graphics may use
-- the explicit authoritative-image-exempt marker.

ALTER TABLE public.daily_articles
  ADD COLUMN IF NOT EXISTS image_candidate_url text,
  ADD COLUMN IF NOT EXISTS image_candidate_alt_text text,
  ADD COLUMN IF NOT EXISTS image_validation_history jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE OR REPLACE FUNCTION public.article_hero_has_visual_readiness_provenance(note text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, public
AS $$
  SELECT coalesce(note, '') ILIKE '%cloudflare-vision ok:%'
      OR coalesce(note, '') ILIKE 'authoritative-image-exempt:%'
      OR coalesce(note, '') ILIKE 'verified-shared-hero:%';
$$;

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
      -- Never replace a previously validated hero with an unvalidated candidate.
      NEW.featured_image_url := OLD.featured_image_url;
      NEW.image_url := OLD.image_url;
      NEW.image_alt_text := OLD.image_alt_text;
      NEW.image_generation_status := OLD.image_generation_status;
      NEW.image_validation_note := OLD.image_validation_note;
    ELSE
      -- Fail closed when no prior validated hero exists. The candidate remains
      -- available for the readiness-audit worker, while public rendering falls
      -- back to the neutral site image until the candidate passes or is replaced.
      NEW.featured_image_url := NULL;
      IF NEW.image_url IS NULL OR NEW.image_url = candidate_url THEN
        NEW.image_url := NULL;
      END IF;
      NEW.image_alt_text := NULL;
      NEW.image_generation_status := 'pending';
      NEW.image_validation_note := 'hero-readiness hold: candidate requires visual validation before publication';
    END IF;
  END IF;

  IF public.article_hero_has_visual_readiness_provenance(NEW.image_validation_note)
     AND nullif(btrim(coalesce(NEW.featured_image_url, '')), '') IS NOT NULL
  THEN
    NEW.quality_flags := array_remove(coalesce(NEW.quality_flags, '{}'::text[]), 'image_requires_visual_validation');
    IF NEW.image_candidate_url = NEW.featured_image_url THEN
      NEW.image_candidate_url := NULL;
      NEW.image_candidate_alt_text := NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_article_hero_visual_readiness ON public.daily_articles;
CREATE TRIGGER trg_enforce_article_hero_visual_readiness
BEFORE INSERT OR UPDATE OF featured_image_url, image_url, image_alt_text, image_generation_status, image_validation_note
ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_article_hero_visual_readiness();

CREATE INDEX IF NOT EXISTS daily_articles_image_candidate_url_idx
  ON public.daily_articles (published_at DESC)
  WHERE image_candidate_url IS NOT NULL;

COMMENT ON FUNCTION public.article_hero_has_visual_readiness_provenance(text) IS
  'True only for article heroes that passed Cloudflare visual validation, use an explicit authoritative official-graphic exemption, or reuse a previously validated shared hero.';

COMMENT ON FUNCTION public.enforce_article_hero_visual_readiness() IS
  'Quarantines unvalidated ready hero assignments, preserves a prior validated hero when available, and keeps superseded validation notes in image_validation_history.';

COMMENT ON COLUMN public.daily_articles.image_candidate_url IS
  'Pending hero candidate held outside the canonical featured_image_url until visual-readiness validation passes.';

COMMENT ON COLUMN public.daily_articles.image_validation_history IS
  'Append-only audit trail of replaced or quarantined hero-image validation notes.';
