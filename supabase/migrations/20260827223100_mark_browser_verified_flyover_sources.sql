-- Preserve strong sources that production HTTP extraction cannot fetch. These
-- stories stay source-verified and editorial-review held; do not substitute a
-- weaker source merely to obtain an HTTP 200 from the extractor.

update public.texas_news_feed f
set ready_for_rewrite = false,
    viral_signals = coalesce(f.viral_signals,'{}'::jsonb) || jsonb_build_object(
      'editorial_lane','REVIEW',
      'auto_publish_eligible',false,
      'source_access_mode','browser_verified_extractor_blocked'
    )
where f.id in (
  select feed_id from public.flyover_aug10_reconciliation
  where story_key in ('caseys-pak-a-sak','richardson-lego-public-safety')
)
and f.internal_slug is null;

update public.flyover_aug10_reconciliation
set evidence_note = case story_key
  when 'caseys-pak-a-sak' then 'Source claim independently verified in browser-accessible coverage including C-Store Dive; production extractor receives HTTP 403. Keep editorial-review held rather than substituting weaker evidence.'
  when 'richardson-lego-public-safety' then 'Official Richardson Police/City evidence independently verified in browser-accessible pages; production extractor receives HTTP 403. Keep editorial-review held rather than weakening source quality.'
  else evidence_note end,
  last_verified_at=now(),
  updated_at=now()
where story_key in ('caseys-pak-a-sak','richardson-lego-public-safety')
  and disposition='review_ready';
