-- Add a productive Mavericks-specific discovery feed after the prior official
-- mavs.com / NBA RSS guesses were verified dead. This is a discovery source
-- only; existing Texas relevance, scoring, review, source-quality, and
-- publication safeguards remain authoritative.

insert into public.content_sources (
  platform,
  source_name,
  source_url,
  category,
  notes,
  enabled,
  rss_url
)
select
  'rss',
  'Mavs Moneyball',
  'https://www.mavsmoneyball.com/',
  'Sports',
  'Dallas Mavericks team news and analysis Atom feed; discovery only and subject to existing scoring/review/publication gates.',
  true,
  'https://www.mavsmoneyball.com/rss/index.xml'
where not exists (
  select 1
  from public.content_sources
  where source_name = 'Mavs Moneyball'
     or rss_url = 'https://www.mavsmoneyball.com/rss/index.xml'
);
