-- Remove static Texas Education Agency/reporting landing pages from the
-- editorial queue without deleting feed history. Future copies are filtered
-- at ingestion by src/lib/low-value-titles.ts.

update public.texas_news_feed
set
  target_site = 'review',
  target_section = 'Unclassified',
  ready_for_rewrite = false,
  viral_score = 0,
  classification_confidence = 1,
  viral_scored_at = coalesce(viral_scored_at, now()),
  viral_signals = coalesce(viral_signals, '{}'::jsonb) || jsonb_build_object(
    'low_value_title', true,
    'auto_publish_eligible', false,
    'editorial_lane', 'REVIEW',
    'exclusion_reason', 'Static Texas Education Agency/reporting utility page is not a newsroom story'
  )
where trend_source = 'Texas Education Primary Sources — Google News'
  and internal_slug is null
  and texasdefined_slug is null
  and (
    lower(btrim(title)) = 'tea'
    or lower(btrim(title)) ~ '^(?:[0-9]{4}-[0-9]{2}[[:space:]]+)?texas performance reporting system[[:space:]]*\(tprs\)$'
  );
