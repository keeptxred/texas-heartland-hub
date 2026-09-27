-- Repair discovery/routing gaps exposed by the Sep. 20-27, 2026 Texas Flyover benchmark.
-- Texas Flyover remains discovery-only: it may suggest an underlying story, but it is
-- never allowed to satisfy the substantive source gate by itself.
--
-- This migration adds only genuinely missing recurring sources and deterministic
-- routing for high-confidence story classes observed across the five-issue audit.
-- Existing source, extraction, corroboration, ownership, publication, image and
-- quality gates remain authoritative.

WITH sources(platform, source_name, source_url, rss_url, category, notes, source_reputation_score, enabled) AS (
  VALUES
    (
      'rss',
      'San Antonio Report',
      'https://sanantonioreport.org/',
      'https://sanantonioreport.org/feed/',
      'San Antonio',
      'Independent nonprofit San Antonio local reporting. Added after the Sep. 20-27 Flyover audit exposed repeat culture, history, development and community gaps.',
      90::smallint,
      true
    ),
    (
      'web',
      'METRO Houston — Official News and Service Updates',
      'https://www.ridemetro.org/about/news-media/news-releases',
      NULL,
      'Houston',
      'Official primary-source reference for Houston transit service, fares and project changes. No generic current news RSS was verified during the Flyover audit.',
      100::smallint,
      true
    ),
    (
      'web',
      'Texas State Historical Association — Handbook of Texas',
      'https://www.tshaonline.org/handbook',
      NULL,
      'History',
      'Authoritative Texas history reference used to corroborate durable history and heritage stories discovered through local reporting.',
      98::smallint,
      true
    ),
    (
      'newsletter',
      'The Texas Flyover — Discovery Benchmark',
      'https://thetexasflyover.com/',
      NULL,
      'Discovery',
      'Discovery-only benchmark from the subscribed Texas Flyover email. Never treat newsletter copy as substantive evidence; recover the original or independent source before publication.',
      40::smallint,
      true
    )
)
INSERT INTO public.content_sources
  (platform, source_name, source_url, rss_url, category, notes, source_reputation_score, enabled)
SELECT s.*
FROM sources s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.content_sources existing
  WHERE lower(existing.source_name) = lower(s.source_name)
     OR (
       s.rss_url IS NOT NULL
       AND existing.rss_url IS NOT NULL
       AND lower(existing.rss_url) = lower(s.rss_url)
     )
);

UPDATE public.content_sources
SET enabled = true,
    notes = CASE
      WHEN source_name = 'The Texas Flyover — Discovery Benchmark'
        THEN 'Discovery-only benchmark from the subscribed Texas Flyover email. Never treat newsletter copy as substantive evidence; recover the original or independent source before publication.'
      ELSE notes
    END,
    source_reputation_score = CASE
      WHEN source_name = 'The Texas Flyover — Discovery Benchmark' THEN 40
      WHEN source_name = 'San Antonio Report' THEN greatest(coalesce(source_reputation_score, 0), 90)
      WHEN source_name = 'METRO Houston — Official News and Service Updates' THEN greatest(coalesce(source_reputation_score, 0), 100)
      WHEN source_name = 'Texas State Historical Association — Handbook of Texas' THEN greatest(coalesce(source_reputation_score, 0), 98)
      ELSE source_reputation_score
    END
WHERE source_name IN (
  'San Antonio Report',
  'METRO Houston — Official News and Service Updates',
  'Texas State Historical Association — Handbook of Texas',
  'The Texas Flyover — Discovery Benchmark'
);

CREATE OR REPLACE FUNCTION public.route_flyover_five_authority_gaps()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  h text := lower(
    coalesce(new.title,'') || ' ' ||
    coalesce(new.description,'') || ' ' ||
    coalesce(new.source,'') || ' ' ||
    coalesce(new.trend_source,'')
  );
  locked boolean := coalesce((new.viral_signals->>'routing_lock')::boolean, false);
  safe_source boolean := coalesce(new.source_reputation_score, 0) >= 60;
  strong_texas boolean := coalesce(new.texas_relevance_score, 0) >= 70;
BEGIN
  IF new.internal_slug IS NOT NULL OR new.texasdefined_slug IS NOT NULL OR locked THEN
    RETURN new;
  END IF;

  -- Current/public-affairs classes remain KeepTXRed.
  IF h ~ '(attorney general.*data center.*water|data center.*water.*(investigat|survey)|annex(ing|ation).*(new mexico|nm)|new mexico count(y|ies).*(texas|annex)|community connector.*(metro|houston)|metro.*community connector|transit.*fare.*houston)' THEN
    new.target_site := 'keeptxred';
    new.target_section := CASE
      WHEN h ~ '(data center|water)' THEN 'Business'
      ELSE 'Texas News'
    END;
    IF safe_source AND strong_texas THEN
      new.classification_confidence := greatest(coalesce(new.classification_confidence, 0), 0.85);
    END IF;
    RETURN new;
  END IF;

  -- Material redevelopment is business coverage, not a generic review item.
  IF h ~ '(greenspoint mall.*(redevelop|citynorth)|\$150m.*citynorth|industrial park.*greenspoint)' THEN
    new.target_site := 'keeptxred';
    new.target_section := 'Business';
    IF safe_source AND strong_texas THEN
      new.classification_confidence := greatest(coalesce(new.classification_confidence, 0), 0.85);
    END IF;
    RETURN new;
  END IF;

  -- Deterministic non-political TexasDefined classes seen repeatedly in the audit.
  IF h ~ '(friesenhahn.*cave|ice age cave.*san antonio|fossil.*cave.*san antonio|paleontolog.*san antonio)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'History';
  ELSIF h ~ '(inbound books|author-led.*co-?op|publishing co-?op.*san antonio|san antonio authors?.*publishing)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
  ELSIF h ~ '(robot mowers?.*(cemetery|taylor)|cemetery.*robot mowers?)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
  ELSIF h ~ '(kfc.*(open house|concept|test).*texas|open house restaurant.*kfc)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Food & Drink';
  ELSIF h ~ '(muertos fest|día de los muertos.*hemisfair|dia de los muertos.*hemisfair)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
  ELSIF h ~ '(athena.*owlet|owlet.*released.*(wild|wildflower)|great horned owl.*released)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Explore';
  ELSIF h ~ '(avelo.*mckinney|mckinney.*avelo|mckinney national airport.*(route|destination|commercial passenger))' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Explore';
  ELSIF h ~ '(state fair of texas|big tex)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
  ELSIF h ~ '(historic.*cemetery.*headstone|cemetery.*236.*headstone|restor.*cemetery.*(temple|belton))' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'History';
  ELSIF h ~ '(tarleton state.*rodeo|rodeo athlete.*tarleton)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Sports';
  ELSE
    RETURN new;
  END IF;

  -- A deterministic ownership match may raise classification confidence enough
  -- for the existing ready queue, but only for reputable, strongly Texas rows.
  -- It does not set ready_for_rewrite, routing_type, extracted_body, reputation,
  -- relevance, or any publication flag.
  IF safe_source AND strong_texas THEN
    new.classification_confidence := greatest(coalesce(new.classification_confidence, 0), 0.85);
  END IF;

  RETURN new;
END;
$function$;

DROP TRIGGER IF EXISTS zz_route_flyover_five_authority_gaps ON public.texas_news_feed;
CREATE TRIGGER zz_route_flyover_five_authority_gaps
BEFORE INSERT OR UPDATE OF title, description, source, trend_source, target_site, target_section,
  source_reputation_score, texas_relevance_score, classification_confidence
ON public.texas_news_feed
FOR EACH ROW
EXECUTE FUNCTION public.route_flyover_five_authority_gaps();

-- Re-run the complete trigger chain only for recent, unpublished rows relevant
-- to the audited story classes. Later zzz* quality guards remain authoritative.
UPDATE public.texas_news_feed
SET title = title
WHERE pub_date >= timestamptz '2026-09-20 00:00:00+00'
  AND internal_slug IS NULL
  AND texasdefined_slug IS NULL
  AND lower(coalesce(title,'') || ' ' || coalesce(description,'')) ~
    '(data center.*water|annex(ing|ation).*(new mexico|nm)|new mexico count(y|ies)|community connector|greenspoint mall|citynorth|friesenhahn|ice age cave|inbound books|publishing co-?op|robot mower|kfc.*open house|muertos fest|athena.*owlet|mckinney.*avelo|avelo.*mckinney|state fair of texas|big tex|cemetery.*headstone|tarleton state.*rodeo|rodeo athlete.*tarleton)';

COMMENT ON FUNCTION public.route_flyover_five_authority_gaps() IS
  'Routes high-confidence story classes and source gaps found by the Sep. 20-27 2026 Texas Flyover reverse-engineering audit without weakening existing quality/publication gates.';
