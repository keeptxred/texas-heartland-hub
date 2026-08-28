-- Reconcile the Aug. 10 Flyover Nueces history recovery with its intended
-- TexasDefined destination while preserving the explicit editorial hold.
-- This changes routing metadata only; it does not publish or make the row
-- rewrite/auto-publish eligible.

update public.texas_news_feed
set
  target_site = 'texasdefined',
  target_section = 'Texas History',
  ready_for_rewrite = false,
  viral_signals = coalesce(viral_signals, '{}'::jsonb) || jsonb_build_object(
    'editorial_lane', 'REVIEW',
    'auto_publish_eligible', false,
    'flyover_aug10_reconciliation', true
  )
where title = 'Battle of the Nueces: Confederate soldiers attack German Unionists fleeing Texas in 1862'
  and trend_source like 'Texas Flyover Aug 10%'
  and internal_slug is null;
