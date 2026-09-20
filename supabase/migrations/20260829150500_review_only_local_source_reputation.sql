-- Several established Texas local outlets are producing high-relevance newsroom rows
-- but remain classified at the unreviewable default reputation score of 45 because
-- their configured source names do not match the generic classifier vocabulary.
--
-- Keep this correction deliberately below the 65-point automatic-source threshold:
-- 60 is sufficient for editorial review/rewrite eligibility while preserving all
-- existing auto-publish, relevance, source-quality, and post-rewrite safeguards.

UPDATE public.content_sources
SET
  source_reputation_score = 60,
  source_quality_reason = 'Established Texas local/newsroom source; review-visible only (below 65 automatic-source threshold)',
  updated_at = now()
WHERE source_name IN (
  'Houston Public Media',
  'KENS 5 — San Antonio Local',
  'KPRC 2 Click2Houston',
  'KSAT 12 — San Antonio Local',
  'KVIA ABC-7 — El Paso Local',
  'San Antonio Current',
  'Texas Public Radio'
);

-- ingest-feeds has a hard-coded KSAT source name that intentionally differs from
-- the content_sources display name. score-viral reads reputation registry rows
-- regardless of enabled state, so add a disabled scoring alias without creating
-- a duplicate ingestion source.
INSERT INTO public.content_sources (
  platform,
  source_name,
  source_url,
  category,
  notes,
  source_reputation_score,
  source_quality_reason,
  enabled
)
SELECT
  'registry',
  'KSAT San Antonio Local',
  'https://www.ksat.com/',
  'San Antonio',
  'Scoring-only alias for the hard-coded KSAT direct ingestion source; disabled to avoid duplicate fetching.',
  60,
  'Established Texas local/newsroom source; review-visible only (below 65 automatic-source threshold)',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources WHERE source_name = 'KSAT San Antonio Local'
);

UPDATE public.content_sources
SET
  source_reputation_score = 60,
  source_quality_reason = 'Established Texas local/newsroom source; review-visible only (below 65 automatic-source threshold)',
  enabled = false,
  updated_at = now()
WHERE source_name = 'KSAT San Antonio Local'
  AND platform = 'registry';
