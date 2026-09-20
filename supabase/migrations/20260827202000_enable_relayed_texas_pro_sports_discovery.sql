-- Replace the disabled raw-Google pro-sports discovery source with the tested
-- fixed-allowlist Supabase RSS relay. This adds discovery coverage only; normal
-- Texas relevance, scoring, routing, review, and publication safeguards remain
-- authoritative.
UPDATE public.content_sources
SET
  rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=google-pro-sports',
  enabled = true,
  notes = concat_ws(' | ', nullif(notes, ''), 'Routed through fixed ktr-rss-relay after direct Google transport proved unreliable; relay probe returned HTTP 200 with current pro-sports items.')
WHERE source_name = 'Texas Pro Sports — Daily Discovery';
