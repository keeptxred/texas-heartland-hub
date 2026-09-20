-- Prevent any KeepTXRed article package from reaching READY_TO_POST with a
-- stale, non-canonical, or non-ready featured image. quickPublish creates the
-- content package before it calls the Facebook Graph API, so this database
-- boundary blocks every current caller (manual, Viral Radar, and automation)
-- without relying on each UI to remember the same readiness check.

CREATE OR REPLACE FUNCTION public.guard_ktr_facebook_article_image_readiness()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  url_match text[];
  article_slug text;
  article_image_status text;
  article_featured_image text;
  expected_asset_url text;
  requested_asset_url text;
BEGIN
  -- Draft/editing packages and non-image/social-native packages are outside
  -- this boundary. Enforce at the last pre-publish package state instead.
  IF COALESCE(NEW.workflow_status, '') <> 'READY_TO_POST'
     OR COALESCE(NEW.asset_type, '') <> 'IMAGE'
     OR NEW.source_url IS NULL THEN
    RETURN NEW;
  END IF;

  url_match := regexp_match(
    NEW.source_url,
    '^https://(www\.)?keeptxred\.com/news/([a-z0-9-]+)([/?#]|$)',
    'i'
  );
  IF url_match IS NULL THEN
    RETURN NEW;
  END IF;

  article_slug := url_match[2];

  SELECT image_generation_status, featured_image_url
    INTO article_image_status, article_featured_image
  FROM public.daily_articles
  WHERE slug = article_slug
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Facebook publish blocked: KeepTXRed article % does not exist', article_slug
      USING ERRCODE = 'check_violation';
  END IF;

  IF lower(COALESCE(article_image_status, '')) <> 'ready' THEN
    RAISE EXCEPTION 'Facebook publish blocked: article % image status is %, not ready',
      article_slug, COALESCE(article_image_status, 'NULL')
      USING ERRCODE = 'check_violation';
  END IF;

  expected_asset_url := btrim(COALESCE(article_featured_image, ''));
  IF expected_asset_url = '' THEN
    RAISE EXCEPTION 'Facebook publish blocked: article % has no canonical featured image', article_slug
      USING ERRCODE = 'check_violation';
  END IF;
  IF left(expected_asset_url, 1) = '/' THEN
    expected_asset_url := 'https://keeptxred.com' || expected_asset_url;
  END IF;

  requested_asset_url := btrim(COALESCE(NEW.asset_url, ''));
  IF requested_asset_url = '' THEN
    RAISE EXCEPTION 'Facebook publish blocked: article % package has no image asset', article_slug
      USING ERRCODE = 'check_violation';
  END IF;
  IF left(requested_asset_url, 1) = '/' THEN
    requested_asset_url := 'https://keeptxred.com' || requested_asset_url;
  END IF;

  IF requested_asset_url IS DISTINCT FROM expected_asset_url THEN
    RAISE EXCEPTION 'Facebook publish blocked: article % package image is not the canonical featured image', article_slug
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_ktr_facebook_article_image_readiness
  ON public.content_packages;

CREATE TRIGGER guard_ktr_facebook_article_image_readiness
BEFORE INSERT OR UPDATE OF workflow_status, asset_type, asset_url, source_url
ON public.content_packages
FOR EACH ROW
EXECUTE FUNCTION public.guard_ktr_facebook_article_image_readiness();

COMMENT ON FUNCTION public.guard_ktr_facebook_article_image_readiness() IS
  'Blocks KeepTXRed article packages from READY_TO_POST unless daily_articles marks the canonical featured image ready and the package uses that exact image.';
