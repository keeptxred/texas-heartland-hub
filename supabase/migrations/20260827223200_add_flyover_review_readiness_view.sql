-- Give operators a durable, read-only readiness projection for the Aug. 10
-- benchmark without adding the old stories to the live publish-candidate queue.

create or replace view public.flyover_aug10_review_readiness as
select
  r.story_key,
  r.expected_site,
  r.disposition,
  r.feed_id,
  r.feed_title,
  f.source,
  f.link,
  f.target_site,
  f.target_section,
  f.internal_slug,
  f.ready_for_rewrite,
  coalesce((f.viral_signals->>'auto_publish_eligible')::boolean,false) as auto_publish_eligible,
  coalesce(f.viral_signals->>'source_access_mode',
    case when coalesce((f.viral_signals->>'source_access_verified')::boolean,false) then 'production_fetch_verified' else 'standard' end
  ) as source_access_mode,
  length(coalesce(f.extracted_body,'')) as extracted_chars,
  f.source_count,
  f.source_reputation_score,
  f.texas_relevance_score,
  case
    when r.disposition <> 'review_ready' then 'not_review_hold'
    when f.internal_slug is not null then 'linked_or_published'
    when f.ready_for_rewrite then 'unsafe_ready_flag'
    when coalesce((f.viral_signals->>'auto_publish_eligible')::boolean,false) then 'unsafe_auto_publish_flag'
    when f.viral_signals->>'source_access_mode' = 'browser_verified_extractor_blocked' then 'verified_browser_only'
    when coalesce((f.viral_signals->>'source_access_verified')::boolean,false) then 'verified_production_fetch'
    else 'verified_source_pending_extraction'
  end as review_readiness
from public.flyover_aug10_reconciliation r
left join public.texas_news_feed f on f.id=r.feed_id;

grant select on public.flyover_aug10_review_readiness to anon, authenticated, service_role;

comment on view public.flyover_aug10_review_readiness is
  'Read-only readiness projection for the 23-story Aug. 10 Flyover benchmark. Review-held rows remain outside live publish candidates.';
