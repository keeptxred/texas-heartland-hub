-- Restore the original-source cache boundary following the October 2026
-- newsroom incident. Old multi-source / primary-record / overdue fallback
-- publishing wrote internally assembled writer guidance into
-- texas_news_feed.extracted_body, which is reserved for source-origin text.
-- Synthetic packets must never count as cited evidence.
--
-- Only unlinked KeepTXRed rows whose entire cached body begins with one
-- of the KNOWN synthetic editorial packet markers are reset. Keep the
-- original feeds, exact URLs, metadata, published articles, audit history
-- and all generated drafts intact. Previously published rows are untouched.
-- A cleared cache is NOT fabricated publisher evidence; it must be
-- rehydrated from the original link by the existing 40-fetch-per-run
-- guarded source-page hydrator and pass all usual editorial gates.
WITH invalidated AS (
  UPDATE public.texas_news_feed
  SET extracted_body = NULL
  WHERE target_site = 'keeptxred'
    AND internal_slug IS NULL
    AND (
      ltrim(extracted_body) LIKE 'MULTI-SOURCE STORY PACKET.%'
      OR ltrim(extracted_body) LIKE 'PRIMARY-RECORD-AUGMENTED SOURCE PACKET.%'
      OR ltrim(extracted_body) LIKE 'RELATED OFFICIAL RELEASE SERIES:%'
    )
  RETURNING id
)
DELETE FROM public.newsroom_source_page_fetch_state AS fetch_state
USING invalidated
WHERE fetch_state.feed_item_id = invalidated.id;

-- This repair is intentionally idempotent. Leave already-published content,
-- source links, candidate status, primary-source labeling, and fact-checking
-- constraints unchanged.
