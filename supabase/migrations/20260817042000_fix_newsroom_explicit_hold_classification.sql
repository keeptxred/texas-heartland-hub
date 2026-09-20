create or replace view public.news_coverage_gaps as
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
  case
    when internal_slug is not null and btrim(internal_slug) <> '' then 'covered'::text
    when coalesce(cluster_json ->> 'publication_readiness', '') like 'hold\_%' escape '\' then 'held_for_corroboration'::text
    when coalesce(texas_relevance_score::integer, 0) < 40 then 'low_texas_relevance'::text
    when coalesce(source_reputation_score::integer, 0) < 55 then 'low_source_reputation'::text
    when coalesce(classification_confidence, 0::real) < 0.60::double precision then 'low_classification_confidence'::text
    when coalesce(viral_score::integer, 0) < 55 then 'below_article_score'::text
    when routing_type = any (array['FACEBOOK_ONLY'::text, 'REEL_CANDIDATE'::text]) then 'routing_gate'::text
    else 'article_generation_or_publish_gap'::text
  end as gap_reason,
  greatest(coalesce(texas_relevance_score::integer, 0), coalesce(viral_score::integer, 0)) as coverage_priority,
  pillar_slug,
  pillar_classified_at
from public.texas_news_feed
where (internal_slug is null or btrim(internal_slug) = '')
  and pub_date >= (now() - interval '7 days')
  and (
    coalesce(texas_relevance_score::integer, 0) >= 40
    or coalesce(viral_score::integer, 0) >= 55
    or routing_type = any (array['SEO_ARTICLE'::text, 'BOTH'::text])
  );
