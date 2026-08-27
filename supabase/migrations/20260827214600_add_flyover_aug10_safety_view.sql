create or replace view public.flyover_aug10_reconciliation_health as
select
  r.story_key,
  r.expected_site,
  r.disposition,
  r.feed_id,
  r.feed_title,
  r.published_slug,
  r.evidence_note,
  r.last_verified_at,
  f.target_site as actual_target_site,
  f.target_section as actual_target_section,
  f.ready_for_rewrite,
  coalesce((f.viral_signals->>'auto_publish_eligible')::boolean,false) as auto_publish_eligible,
  f.internal_slug,
  case
    when r.disposition='review_ready' then f.id is not null and f.target_site=r.expected_site
    when r.disposition='published' then r.published_slug is not null
    when r.disposition in ('source_needed','out_of_scope') then true
    else false
  end as disposition_consistent,
  case
    when r.disposition='review_ready' then coalesce(f.ready_for_rewrite,false)=false and coalesce((f.viral_signals->>'auto_publish_eligible')::boolean,false)=false and f.internal_slug is null
    else true
  end as publication_hold_safe
from public.flyover_aug10_reconciliation r
left join public.texas_news_feed f on f.id=r.feed_id;

grant select on public.flyover_aug10_reconciliation_health to service_role;
revoke all on public.flyover_aug10_reconciliation_health from anon,authenticated;

comment on view public.flyover_aug10_reconciliation_health is
  'Safety/status projection for the 23-story Aug. 10 Flyover benchmark. Review-ready rows must remain correctly routed, rewrite-disabled, auto-publish-ineligible and unlinked.';
