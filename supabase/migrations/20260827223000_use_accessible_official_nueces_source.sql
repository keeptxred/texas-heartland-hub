-- Replace the extractor-blocked TSHA URL for the Aug. 10 Nueces benchmark row
-- with an accessible official Texas State Library and Archives Commission page.
-- Keep the story review-held and publication-ineligible.

update public.texas_news_feed f
set source = 'Texas State Library and Archives Commission',
    link = 'https://www.tsl.texas.gov/exhibits/civilwar/dissent.html',
    ready_for_rewrite = false,
    viral_signals = coalesce(f.viral_signals,'{}'::jsonb) || jsonb_build_object(
      'editorial_lane','REVIEW',
      'auto_publish_eligible',false,
      'source_access_verified',true,
      'source_access_note','Official Texas State Library Civil War dissent exhibit is HTTP-accessible to production review tooling'
    )
where f.id = (
  select feed_id from public.flyover_aug10_reconciliation
  where story_key='nueces-1862-history'
)
and f.internal_slug is null;

update public.flyover_aug10_reconciliation
set evidence_note='Official Texas State Library and Archives Commission Civil War dissent exhibit recovered as an accessible primary source for the Nueces history item; story remains editorial-review held and unpublished.',
    last_verified_at=now(),
    updated_at=now()
where story_key='nueces-1862-history'
  and disposition='review_ready';
