-- KRIS's broad /news.rss includes Scripps syndicated national/world content.
-- Use its dedicated Local News RSS for the hyperlocal source and quarantine
-- only obvious unlinked syndicated-category rows already ingested from the
-- broad feed. Preserve all feed history and linked/published content.

update public.content_sources
set rss_url = 'https://www.kristv.com/news/local-news.rss',
    updated_at = now()
where source_name = 'KRIS 6 — Corpus Christi Local'
  and enabled = true;

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
    'source_scope_mismatch', true,
    'auto_publish_eligible', false,
    'editorial_lane', 'REVIEW',
    'final_quality_guard', true,
    'routing_lock', true,
    'routing_locked_site', 'review',
    'routing_locked_section', 'Unclassified',
    'exclusion_reason', 'Syndicated non-local KRIS category item from retired broad news feed'
  )
where trend_source = 'KRIS 6 — Corpus Christi Local'
  and internal_slug is null
  and texasdefined_slug is null
  and link ~ '^https?://(www\.)?kristv\.com/(us-news|world|science-and-tech|entertainment)/';
