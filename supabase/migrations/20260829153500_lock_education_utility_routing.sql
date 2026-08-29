-- Align static TEA/TPRS utility rows with the standard non-news quarantine
-- contract: retain history, clear stale SEO routing metadata, and prevent later
-- generic routing updates from making them editorial candidates again.

update public.texas_news_feed
set
  target_site = 'review',
  target_section = 'Unclassified',
  routing_type = null,
  ready_for_rewrite = false,
  viral_score = 0,
  classification_confidence = 1,
  viral_scored_at = coalesce(viral_scored_at, now()),
  viral_signals = coalesce(viral_signals, '{}'::jsonb) || jsonb_build_object(
    'low_value_title', true,
    'auto_publish_eligible', false,
    'editorial_lane', 'REVIEW',
    'final_quality_guard', true,
    'routing_lock', true,
    'routing_locked_site', 'review',
    'routing_locked_section', 'Unclassified',
    'exclusion_reason', 'Static Texas Education Agency/reporting utility page is not a newsroom story'
  )
where trend_source = 'Texas Education Primary Sources — Google News'
  and internal_slug is null
  and texasdefined_slug is null
  and (
    lower(btrim(title)) = 'tea'
    or lower(btrim(title)) ~ '^(?:[0-9]{4}-[0-9]{2}[[:space:]]+)?texas performance reporting system[[:space:]]*\(tprs\)$'
  );
