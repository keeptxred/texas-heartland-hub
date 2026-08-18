-- AdSense Phase 4: tighten the KeepTXRed/TexasDefined editorial boundary and
-- make article chronology correct at the storage boundary.
--
-- KeepTXRed owns hard news, politics, government, policy, material business
-- developments, and Texas sports. TexasDefined owns lifestyle, dining,
-- attractions, outdoors, history, travel, and human-interest coverage.

CREATE OR REPLACE FUNCTION public.route_texas_story_to_site()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  haystack text := lower(
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(NEW.source, '')
  );
  is_sports boolean;
  is_hard_news boolean;
  is_material_business boolean;
  is_lifestyle boolean;
BEGIN
  is_sports := haystack ~ '(cowboys|texans|rangers|astros|spurs|mavericks|rockets|stars|dynamo|fc dallas|wnba|college football|high school football|athlete|championship|playoff|roster|injured list|trade deadline|contract extension|recruiting|nil deal)';

  is_hard_news := haystack ~ '(election|vot(e|er|ing)|ballot|candidate|campaign|runoff|legislature|legislation|house bill|senate bill|governor|attorney general|secretary of state|court|judge|lawsuit|ruling|appeal|police|sheriff|dps|crime|shooting|killed|homicide|fentanyl|public safety|emergency|disaster|hurricane|tornado|flood|wildfire|drought|school district|tea |texas education agency|city council|county commissioners|mayor|property tax|appraisal|tax rate|budget|ercot|grid|utility|regulation|regulatory|border security|operation lone star|public health|hospital|outbreak)';

  is_material_business := haystack ~ '(layoff|bankruptcy|acquisition|acquire|merger|headquarters|corporate campus|factory|manufacturing plant|data center|billion-dollar|million-dollar investment|major investment|jobs created|job cuts|workforce reduction|employer|earnings|ipo|public funding|tax incentive|economic development|redevelopment|antitrust|regulatory action)';

  is_lifestyle := haystack ~ '(restaurant|barbecue|bbq|coffee shop|coffee chain|bakery|chef|food hall|dining|brewery|taproom|festival|concert|fair|travel|tourism|road trip|attraction|museum|historic site|texas history|on this day|anniversary|state park|national park|nature center|trail|camping|hiking|lake|reservoir|river|fishing|wildlife|alligator|small town|human interest|community feature|best of texas|ranking|opening soon|grand opening)';

  IF is_sports THEN
    NEW.target_site := 'keeptxred';
    NEW.target_section := 'Sports';
  ELSIF is_hard_news THEN
    NEW.target_site := 'keeptxred';
    NEW.target_section := CASE
      WHEN haystack ~ '(election|vot(e|er|ing)|ballot|candidate|campaign|runoff)' THEN 'Elections'
      WHEN haystack ~ '(legislature|legislation|house bill|senate bill|governor|attorney general|secretary of state|court|judge|lawsuit|ruling|appeal)' THEN 'Politics'
      WHEN is_material_business THEN 'Business'
      ELSE 'Texas News'
    END;
  ELSIF is_material_business THEN
    NEW.target_site := 'keeptxred';
    NEW.target_section := 'Business';
  ELSIF is_lifestyle THEN
    NEW.target_site := 'texasdefined';
    NEW.target_section := CASE
      WHEN haystack ~ '(state park|national park|nature center|trail|camping|hiking|lake|reservoir|river|fishing|wildlife|alligator|travel|tourism|road trip|attraction)' THEN 'Explore'
      WHEN haystack ~ '(texas history|on this day|anniversary|historic site|museum)' THEN 'History'
      WHEN haystack ~ '(restaurant|barbecue|bbq|coffee shop|coffee chain|bakery|chef|food hall|dining|brewery|taproom)' THEN 'Food & Drink'
      ELSE 'Texas Life'
    END;
  ELSE
    NEW.target_site := 'keeptxred';
    NEW.target_section := 'Texas News';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_route_texas_story_to_site ON public.texas_news_feed;
CREATE TRIGGER trg_route_texas_story_to_site
BEFORE INSERT OR UPDATE OF title, description, source
ON public.texas_news_feed
FOR EACH ROW
EXECUTE FUNCTION public.route_texas_story_to_site();

-- Reclassify the existing feed inventory under the tightened boundary.
UPDATE public.texas_news_feed
SET title = title;

-- If a feed item is routed (or later rerouted) to TexasDefined, automatically
-- quarantine any existing KeepTXRed article sourced from that feed item. We do
-- not delete history and we never auto-unquarantine if routing later changes.
CREATE OR REPLACE FUNCTION public.quarantine_cross_site_daily_article()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.target_site = 'texasdefined' AND NEW.link IS NOT NULL AND btrim(NEW.link) <> '' THEN
    UPDATE public.daily_articles AS article
       SET quality_flags = ARRAY(
         SELECT DISTINCT flag
         FROM unnest(
           coalesce(article.quality_flags, ARRAY[]::text[])
           || ARRAY['seo_noindex', 'seo_off_topic', 'site_boundary_violation']::text[]
         ) AS flag
       )
     WHERE article.source_url = NEW.link;

    UPDATE public.texas_news_feed
       SET internal_slug = NULL
     WHERE id = NEW.id
       AND internal_slug IS NOT NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_quarantine_cross_site_daily_article ON public.texas_news_feed;
CREATE TRIGGER trg_quarantine_cross_site_daily_article
AFTER INSERT OR UPDATE OF target_site, link
ON public.texas_news_feed
FOR EACH ROW
EXECUTE FUNCTION public.quarantine_cross_site_daily_article();

-- Backfill current cross-site collisions immediately. Phase 2's centralized
-- quarantine policy makes these rows noindex, removes them from sitemaps, and
-- prevents them from appearing in public discovery feeds.
UPDATE public.daily_articles AS article
   SET quality_flags = ARRAY(
     SELECT DISTINCT flag
     FROM unnest(
       coalesce(article.quality_flags, ARRAY[]::text[])
       || ARRAY['seo_noindex', 'seo_off_topic', 'site_boundary_violation']::text[]
     ) AS flag
   )
 WHERE EXISTS (
   SELECT 1
   FROM public.texas_news_feed AS feed
   WHERE feed.link = article.source_url
     AND feed.target_site = 'texasdefined'
 );

UPDATE public.texas_news_feed AS feed
   SET internal_slug = NULL
 WHERE feed.target_site = 'texasdefined'
   AND feed.internal_slug IS NOT NULL;

-- Keep the historical collision audit, but also expose the actionable subset
-- that is still publicly eligible. A quarantined historical row is not an
-- active cross-site publication problem.
CREATE OR REPLACE VIEW public.active_cross_site_publication_collisions AS
SELECT collision.*
FROM public.cross_site_publication_collisions AS collision
JOIN public.daily_articles AS article ON article.slug = collision.slug
WHERE NOT (
  coalesce(article.quality_flags, ARRAY[]::text[])
  && ARRAY[
    'seo_noindex',
    'noindex',
    'seo_off_topic',
    'site_boundary_violation',
    'canonical_duplicate',
    'seo_duplicate'
  ]::text[]
);

-- Article body_json historically stored a date-only `updated` value. That made
-- nearly every cloud article appear to have been updated before its actual
-- publication timestamp. Normalize at write time so every consumer receives a
-- chronologically valid value, not just the article renderer.
CREATE OR REPLACE FUNCTION public.normalize_daily_article_chronology()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  updated_text text;
  updated_value timestamptz;
BEGIN
  IF NEW.published_at IS NULL OR NEW.body_json IS NULL OR jsonb_typeof(NEW.body_json) <> 'object' THEN
    RETURN NEW;
  END IF;

  updated_text := nullif(btrim(NEW.body_json->>'updated'), '');
  updated_value := NULL;

  IF updated_text IS NOT NULL THEN
    BEGIN
      updated_value := updated_text::timestamptz;
    EXCEPTION WHEN others THEN
      updated_value := NULL;
    END;
  END IF;

  IF updated_value IS NULL OR updated_value < NEW.published_at THEN
    NEW.body_json := jsonb_set(
      NEW.body_json,
      '{updated}',
      to_jsonb(NEW.published_at),
      true
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_daily_article_chronology ON public.daily_articles;
CREATE TRIGGER trg_normalize_daily_article_chronology
BEFORE INSERT OR UPDATE OF published_at, body_json
ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.normalize_daily_article_chronology();

-- Re-run every existing structured article through the chronology trigger.
UPDATE public.daily_articles
SET body_json = body_json
WHERE body_json IS NOT NULL
  AND jsonb_typeof(body_json) = 'object';

COMMENT ON FUNCTION public.route_texas_story_to_site() IS
  'Routes hard news/politics/material business/sports to KeepTXRed and lifestyle/dining/outdoors/history/travel to TexasDefined.';
COMMENT ON FUNCTION public.quarantine_cross_site_daily_article() IS
  'Automatically noindexes and removes public discovery for KeepTXRed articles whose source feed is routed to TexasDefined.';
COMMENT ON FUNCTION public.normalize_daily_article_chronology() IS
  'Ensures body_json.updated is valid and never earlier than daily_articles.published_at.';
