-- Replace three Texas Tribune filtered RSS URLs that have returned HTTP 200
-- with zero parsed items for repeated production checks. The Tribune's current
-- filtered-feed documentation supports topic and series feeds; these slugs match
-- the current State Government, Immigration, and 2026 Texas Elections surfaces.

UPDATE public.content_sources
SET rss_url = CASE source_name
  WHEN 'The Texas Tribune — Government and Politics' THEN
    'https://www.texastribune.org/topics/state-government/feed'
  WHEN 'The Texas Tribune — Border' THEN
    'https://www.texastribune.org/topics/immigration/feed'
  WHEN 'The Texas Tribune — Elections' THEN
    'https://www.texastribune.org/series/texas-2026-election-voting/feed/'
  ELSE rss_url
END,
updated_at = now()
WHERE source_name IN (
  'The Texas Tribune — Government and Politics',
  'The Texas Tribune — Border',
  'The Texas Tribune — Elections'
)
AND rss_url IS DISTINCT FROM CASE source_name
  WHEN 'The Texas Tribune — Government and Politics' THEN
    'https://www.texastribune.org/topics/state-government/feed'
  WHEN 'The Texas Tribune — Border' THEN
    'https://www.texastribune.org/topics/immigration/feed'
  WHEN 'The Texas Tribune — Elections' THEN
    'https://www.texastribune.org/series/texas-2026-election-voting/feed/'
  ELSE rss_url
END;
