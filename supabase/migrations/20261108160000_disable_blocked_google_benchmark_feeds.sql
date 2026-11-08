-- 2026-11-08 live probe: ALL seven November Google News RSS discovery feeds
-- returned HTTP 503 with Google's automated-query protection HTML, despite
-- successful deployment of the fixed Supabase relays. Never mark them as
-- operational, waste the rotating ingestion slots or attempt to bypass Google's
-- protections. Retain source definitions for troubleshooting; reactivate only
-- after documented upstream RSS success. First-party KTRE/KCBD HTML sources are
-- registered in the main ingestion route and have date-proven permalinks.
UPDATE public.content_sources
SET enabled = false,
    notes = coalesce(notes,'') ||
      ' [2026-11-08 verification: upstream Google automated-query protection HTTP 503. Disabled until the original publisher RSS returns actual XML.]'
WHERE enabled = true
  AND source_name IN (
    'Texas Community Giving and Food Drives — Google News',
    'Texas Local Utility Disruptions — Google News',
    'Texas Local Business Openings Closings — Google News',
    'Texas Local Federal Investigations — Google News',
    'Texas Space and Starbase Launches — Google News',
    'Texas Attractions and Brand Changes — Google News',
    'Texas Community Art and Naming — Google News'
  );
