-- Add verified RSS coverage for two active newsrooms whose legacy hard-coded
-- HTML parsers currently yield zero items. Distinct source names avoid masking
-- the legacy diagnostics until those redundant hard-coded fetches are retired.

insert into public.content_sources (
  platform, source_name, source_url, rss_url, category, notes, enabled,
  source_reputation_score, source_quality_reason
)
select
  'rss',
  'KCEN 6 — Central Texas Local RSS',
  'https://www.kcentv.com/',
  'https://www.kcentv.com/feeds/syndication/rss/news/local',
  'Local',
  'Verified official KCEN/TEGNA local RSS; added after legacy homepage HTML parser yielded zero items.',
  true,
  85,
  'Official local television newsroom RSS feed.'
where not exists (
  select 1 from public.content_sources
  where source_name = 'KCEN 6 — Central Texas Local RSS'
);

insert into public.content_sources (
  platform, source_name, source_url, rss_url, category, notes, enabled,
  source_reputation_score, source_quality_reason
)
select
  'rss',
  'City of Dallas News — Official RSS',
  'https://www.dallascitynews.net/',
  'https://www.dallascitynews.net/feed/',
  'City Government',
  'Verified official City of Dallas News WordPress RSS; added after legacy homepage HTML parser yielded zero items.',
  true,
  100,
  'Official City of Dallas government news feed.'
where not exists (
  select 1 from public.content_sources
  where source_name = 'City of Dallas News — Official RSS'
);
