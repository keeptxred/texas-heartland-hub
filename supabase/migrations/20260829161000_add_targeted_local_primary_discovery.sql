-- Add four site-constrained discovery paths for Texas stories that broad regional
-- and topic queries demonstrably missed. These sources remain review-visible at
-- reputation 60, below the 65 automatic-source threshold.
--
-- Transport stays on the existing fixed Supabase Google RSS relay so these feeds
-- inherit the existing Google rotation/retry policy. No publication gate changes.

WITH sources(platform, source_name, source_url, rss_url, category, notes, source_reputation_score, source_quality_reason, enabled) AS (
  VALUES
    (
      'rss',
      'ABC13 Houston — Site Discovery',
      'https://abc13.com/',
      'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=google-primary-abc13-houston',
      'Local',
      'Site-constrained discovery for ABC13 Houston civic, public-safety, county, and metro news missed by broader Houston/topic queries.',
      60,
      'Established Houston local newsroom; site-constrained discovery is review-visible only (below 65 automatic-source threshold)',
      true
    ),
    (
      'rss',
      'KGNS Laredo — Site Discovery',
      'https://www.kgns.tv/news/local/',
      'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=google-primary-kgns-laredo',
      'Local',
      'Site-constrained discovery for KGNS Laredo and Webb County local/crime/civic reporting missed by the broad South Texas feed.',
      60,
      'Established Laredo local broadcaster; site-constrained discovery is review-visible only (below 65 automatic-source threshold)',
      true
    ),
    (
      'rss',
      'Messer Texas Press Releases — Site Discovery',
      'https://www.messer-us.com/press-releases',
      'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=google-primary-messer-texas',
      'Business',
      'First-party site-constrained discovery for Texas Messer investments and facilities, using a 30-day window for slow-burn business developments.',
      60,
      'First-party corporate press source; review-visible only (below 65 automatic-source threshold)',
      true
    ),
    (
      'rss',
      'Ector County Library Press — Site Discovery',
      'https://ector.lib.tx.us/press/',
      'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=google-primary-ector-library',
      'Non-Political',
      'First-party site-constrained discovery for Ector County Library grants, gifts, campaigns, and resource-center developments, using a 30-day window.',
      60,
      'First-party local library press source; review-visible only (below 65 automatic-source threshold)',
      true
    )
)
INSERT INTO public.content_sources (
  platform,
  source_name,
  source_url,
  rss_url,
  category,
  notes,
  source_reputation_score,
  source_quality_reason,
  enabled
)
SELECT
  s.platform,
  s.source_name,
  s.source_url,
  s.rss_url,
  s.category,
  s.notes,
  s.source_reputation_score,
  s.source_quality_reason,
  s.enabled
FROM sources s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.content_sources existing
  WHERE existing.source_name = s.source_name
     OR lower(existing.rss_url) = lower(s.rss_url)
);

UPDATE public.content_sources AS existing
SET
  platform = s.platform,
  source_url = s.source_url,
  rss_url = s.rss_url,
  category = s.category,
  notes = s.notes,
  source_reputation_score = 60,
  source_quality_reason = s.source_quality_reason,
  enabled = true,
  updated_at = now()
FROM sources s
WHERE existing.source_name = s.source_name;
