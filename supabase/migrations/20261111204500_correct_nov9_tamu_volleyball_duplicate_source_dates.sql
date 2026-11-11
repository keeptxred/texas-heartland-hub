-- November 9, 2026 Texas Flyover original sports report reconciliation.
-- Two URLs for one first-party Texas A&M Nov 9 volleyball report:
-- /news/2026/11/9/ and /news/2026/11/09/. The padded variant was
-- previously stamped with *crawl time* and falsely appeared dated Nov 11.
-- Preserve both historical source rows and provenance for audit; prospective
-- URL dedupe is handled by the associated sports-original-source-date module.
-- No candidate, publication, source reputation or canonical story mutation.

UPDATE public.texas_news_feed f
SET ready_for_rewrite=false,
    pub_date=CASE WHEN f.id=6930924 THEN
       (SELECT o.pub_date FROM public.texas_news_feed o WHERE o.id=6898857)
       ELSE f.pub_date END
WHERE f.id IN (6898857,6930924)
  AND f.title='Volleyball in the Polls: November 9'
  AND f.source='Texas A&M Athletics'
  AND f.target_site='texasdefined' AND f.target_section='Sports'
  AND f.link IN (
    'https://12thman.com/news/2026/11/9/volleyball-in-the-polls-november-9',
    'https://12thman.com/news/2026/11/09/volleyball-in-the-polls-november-9'
  )
  AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
  AND length(coalesce(f.extracted_body,''))=0;

DO $assert$
DECLARE exact_rows integer; other_affected integer;
BEGIN
  SELECT count(*) INTO exact_rows
  FROM public.texas_news_feed f
  WHERE f.id IN (6898857,6930924)
    AND f.title='Volleyball in the Polls: November 9'
    AND f.target_site='texasdefined' AND f.target_section='Sports'
    AND f.pub_date=(SELECT o.pub_date FROM public.texas_news_feed o WHERE o.id=6898857)
    AND f.ready_for_rewrite=false
    AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL;
  IF exact_rows<>2 THEN RAISE EXCEPTION 'Original Texas A&M volleyball date reconciliation %/2', exact_rows; END IF;
  SELECT count(*) INTO other_affected
  FROM public.texas_news_feed f
  WHERE f.id IN (6898857,6930924) AND f.source<>'Texas A&M Athletics';
  IF other_affected<>0 THEN RAISE EXCEPTION 'Original volleyball source ownership mismatch'; END IF;
END $assert$;
