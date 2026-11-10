-- Original-publisher coverage extension for independent Texas community,
-- transport/visitor infrastructure and Texas veteran-economy research stories.
-- Both endpoints were probed against production Supabase HTTP: true HTTP 200
-- RSS XML with parsed <item>, <link> and <pubDate> (IDs 24213 and 24212).
-- No Bing/Google scraper or guessed endpoint is introduced.
-- Source registration is NOT verification, editorial readiness or publication.
WITH sources(platform, source_name, source_url, rss_url, category, notes, enabled, source_reputation_score, source_quality_reason) AS (
  VALUES
    (
      'rss',
      'City of McKinney — Official News Flash RSS',
      'https://www.mckinneytexas.org/',
      'https://www.mckinneytexas.org/RSSFeed.aspx?ModID=1&CID=All-newsflash.xml',
      'City Government',
      'Confirmed live official City of McKinney CivicPlus feed, dated newsflash items. Future airport, transit, community and city announcements: follow the original municipal link. Short calendar promos remain subject to the normal substantive-article rejection.',
      true, 100,
      'Original municipal notices only. Does not independently corroborate third-party claims and does not qualify a short announcement for publication.'
    ),
    (
      'rss',
      'PenFed Foundation — Original Veteran Research Releases',
      'https://penfedfoundation.org/',
      'https://penfedfoundation.org/feed/',
      'Business',
      'Confirmed live dated primary nonprofit announcements including the Top U.S. Cities for Veteran Entrepreneurs research program. Filter national results strictly for meaningful verified Texas relevance; do not fabricate rankings or reproduce the full study.',
      true, 82,
      'Original publishing organization for veteran research; primary evidence of its own methodology and ranking, not an independent external confirmation.'
    )
)
INSERT INTO public.content_sources(
 platform,source_name,source_url,rss_url,category,notes,enabled,
 source_reputation_score,source_quality_reason
)
SELECT s.*
FROM sources s
WHERE NOT EXISTS (
 SELECT 1 FROM public.content_sources c
 WHERE lower(c.source_name)=lower(s.source_name)
    OR lower(coalesce(c.rss_url,''))=lower(s.rss_url)
);

-- Never alter old source records, published slugs, quality flags, manual
-- decisions or blocked Google News feeds. Discovery remains review-gated.

DO $check$
BEGIN
 IF NOT EXISTS (
  SELECT 1 FROM public.content_sources
  WHERE source_name='City of McKinney — Official News Flash RSS'
    AND rss_url='https://www.mckinneytexas.org/RSSFeed.aspx?ModID=1&CID=All-newsflash.xml'
    AND enabled
 ) THEN RAISE EXCEPTION 'Verified official McKinney feed missing or disabled'; END IF;
 IF NOT EXISTS (
  SELECT 1 FROM public.content_sources
  WHERE source_name='PenFed Foundation — Original Veteran Research Releases'
    AND rss_url='https://penfedfoundation.org/feed/'
    AND enabled
 ) THEN RAISE EXCEPTION 'Verified PenFed direct release feed missing or disabled'; END IF;
END $check$;
