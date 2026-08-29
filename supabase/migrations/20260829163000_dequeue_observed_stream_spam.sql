-- De-queue already-ingested low-value rows that predate the matching
-- isLowValueTitle() guards. Preserve feed history and any source attribution;
-- no published article is deleted by this migration.

update public.texas_news_feed
set
  ready_for_rewrite = false,
  target_site = 'review',
  target_section = 'Unclassified',
  viral_score = 0,
  classification_confidence = 1,
  viral_scored_at = now(),
  viral_signals = coalesce(viral_signals, '{}'::jsonb) || jsonb_build_object(
    'low_value_content', true,
    'auto_publish_eligible', false,
    'editorial_lane', 'REVIEW',
    'exclusion_reason', 'Observed stream-spam or utility-page headline'
  )
where internal_slug is null
  and (
    lower(trim(title)) ~ '^\[?watchlive\]?'
    or lower(trim(title)) ~ 'live\s+tv\s+coverage'
    or lower(trim(title)) ~ '^build a button!?$'
  );
