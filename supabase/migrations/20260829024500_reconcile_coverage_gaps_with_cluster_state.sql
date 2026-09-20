-- Reconcile legacy feed-row coverage-gap reporting with the normalized
-- newsroom cluster/research pipeline. This changes observability only: it does
-- not modify feed rows, publication eligibility, rewrite readiness, or article
-- records.

create or replace view public.news_coverage_gaps as
with cluster_state as (
  select
    i.feed_item_id,
    bool_or(coalesce(p.status, '') = 'PUBLISHED') as cluster_published,
    max(coalesce(rp.source_count, 0)) as packet_source_count
  from public.news_story_cluster_items i
  left join public.news_publish_candidates p on p.cluster_id = i.cluster_id
  left join public.news_research_packets rp on rp.cluster_id = i.cluster_id
  group by i.feed_item_id
), eligible as (
  select
    f.id,
    f.title,
    f.source,
    f.link,
    f.pub_date,
    f.internal_slug,
    f.viral_score,
    f.classification_confidence,
    f.texas_relevance_score,
    f.source_reputation_score,
    f.routing_type,
    case
      when f.internal_slug is not null and btrim(f.internal_slug) <> '' then 'covered'
      when coalesce(f.cluster_json->>'publication_readiness', '') = 'hold_for_corroboration'
           and coalesce(cs.packet_source_count, 0) >= 2
        then 'corroborated_review_hold'
      when left(coalesce(f.cluster_json->>'publication_readiness', ''), 5) = 'hold_'
        then 'held_for_corroboration'
      when coalesce(f.texas_relevance_score::integer, 0) < 40 then 'low_texas_relevance'
      when coalesce(f.source_reputation_score::integer, 0) < 55 then 'low_source_reputation'
      when coalesce(f.classification_confidence, 0::real) < 0.60 then 'low_classification_confidence'
      when coalesce(f.viral_score::integer, 0) < 55 then 'below_article_score'
      when f.routing_type = any (array['FACEBOOK_ONLY'::text, 'REEL_CANDIDATE'::text]) then 'routing_gate'
      else 'article_generation_or_publish_gap'
    end as gap_reason,
    coalesce(f.viral_score::integer, 0) as coverage_priority,
    f.pillar_slug,
    f.pillar_classified_at,
    lower(regexp_replace(btrim(f.title), '[^a-zA-Z0-9]+'::text, ' '::text, 'g'::text)) as story_key
  from public.texas_news_feed f
  left join cluster_state cs on cs.feed_item_id = f.id
  where f.target_site = 'keeptxred'
    and (f.internal_slug is null or btrim(f.internal_slug) = '')
    and f.pub_date >= now() - interval '7 days'
    and not coalesce(cs.cluster_published, false)
    and (
      coalesce(f.texas_relevance_score::integer, 0) >= 40
      or coalesce(f.viral_score::integer, 0) >= 55
      or f.routing_type = any (array['SEO_ARTICLE'::text, 'BOTH'::text])
    )
    and coalesce((f.viral_signals->>'source_contamination')::boolean, false) = false
    and coalesce(f.viral_signals->>'exclusion_reason', '') not ilike '%utility%'
    and lower(btrim(f.title)) <> all (array[
      'map'::text,
      'cameras'::text,
      'incidents'::text,
      'file viewing information'::text,
      'contracting opportunities'::text,
      '- texas workforce commission'::text,
      'texas 10 most wanted - tx dps'::text,
      'still wanted - tx dps'::text
    ])
    and lower(btrim(f.title)) !~ '^(fugitive|captured|sex offender|criminal illegal immigrant) details id [0-9]+$'
), ranked as (
  select
    eligible.*,
    row_number() over (
      partition by eligible.story_key
      order by eligible.coverage_priority desc,
        coalesce(eligible.source_reputation_score::integer, 0) desc,
        coalesce(eligible.classification_confidence, 0::real) desc,
        eligible.pub_date,
        eligible.id
    ) as story_rank
  from eligible
)
select
  id,
  title,
  source,
  link,
  pub_date,
  internal_slug,
  viral_score,
  classification_confidence,
  texas_relevance_score,
  source_reputation_score,
  routing_type,
  gap_reason,
  coverage_priority,
  pillar_slug,
  pillar_classified_at
from ranked
where story_rank = 1;

comment on view public.news_coverage_gaps is
  'Deduplicated KeepTXRed coverage gaps reconciled with normalized cluster publication and research-packet corroboration state. Corroborated review holds remain review-only; published clusters are not reported as gaps.';
