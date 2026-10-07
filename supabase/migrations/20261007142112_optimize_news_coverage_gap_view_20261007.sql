create index if not exists news_publish_candidates_cluster_status_cover_idx
  on public.news_publish_candidates (cluster_id) include (status);

create index if not exists news_research_packets_cluster_source_count_cover_idx
  on public.news_research_packets (cluster_id) include (source_count);

create or replace view public.news_coverage_gaps
with (security_invoker = true) as
with eligible as (
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
    f.cluster_json,
    f.pillar_slug,
    f.pillar_classified_at,
    lower(regexp_replace(btrim(f.title), '[^a-zA-Z0-9]+'::text, ' '::text, 'g'::text)) as story_key,
    cs.cluster_published,
    cs.packet_source_count
  from public.texas_news_feed f
  left join lateral (
    select
      bool_or(coalesce(p.status, '') = 'PUBLISHED') as cluster_published,
      max(coalesce(rp.source_count, 0)) as packet_source_count
    from public.news_story_cluster_items i
    left join public.news_publish_candidates p on p.cluster_id = i.cluster_id
    left join public.news_research_packets rp on rp.cluster_id = i.cluster_id
    where i.feed_item_id = f.id
  ) cs on true
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
),
classified as (
  select
    eligible.*,
    case
      when internal_slug is not null and btrim(internal_slug) <> '' then 'covered'
      when coalesce(cluster_json->>'publication_readiness', '') = 'hold_for_corroboration'
           and coalesce(packet_source_count, 0) >= 2
        then 'corroborated_review_hold'
      when left(coalesce(cluster_json->>'publication_readiness', ''), 5) = 'hold_'
        then 'held_for_corroboration'
      when coalesce(texas_relevance_score::integer, 0) < 40 then 'low_texas_relevance'
      when coalesce(source_reputation_score::integer, 0) < 55 then 'low_source_reputation'
      when coalesce(classification_confidence, 0::real) < 0.60 then 'low_classification_confidence'
      when coalesce(viral_score::integer, 0) < 55 then 'below_article_score'
      when routing_type = any (array['FACEBOOK_ONLY'::text, 'REEL_CANDIDATE'::text]) then 'routing_gate'
      else 'article_generation_or_publish_gap'
    end as gap_reason,
    coalesce(viral_score::integer, 0) as coverage_priority
  from eligible
),
ranked as (
  select
    classified.*,
    row_number() over (
      partition by story_key
      order by coverage_priority desc,
        coalesce(source_reputation_score::integer, 0) desc,
        coalesce(classification_confidence, 0::real) desc,
        pub_date,
        id
    ) as story_rank
  from classified
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
