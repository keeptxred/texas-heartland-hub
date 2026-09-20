-- Keep coverage-gap alerts focused on editorial Texas stories rather than
-- deterministic utility/navigation pages or explicitly quarantined syndication.

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
    when internal_slug is not null and btrim(internal_slug) <> '' then 'covered'
    when coalesce(cluster_json->>'publication_readiness','') like 'hold\_%' escape '\' then 'held_for_corroboration'
    when coalesce(texas_relevance_score::integer,0) < 40 then 'low_texas_relevance'
    when coalesce(source_reputation_score::integer,0) < 55 then 'low_source_reputation'
    when coalesce(classification_confidence,0) < 0.60 then 'low_classification_confidence'
    when coalesce(viral_score::integer,0) < 55 then 'below_article_score'
    when routing_type = any(array['FACEBOOK_ONLY'::text,'REEL_CANDIDATE'::text]) then 'routing_gate'
    else 'article_generation_or_publish_gap'
  end as gap_reason,
  greatest(coalesce(texas_relevance_score::integer,0),coalesce(viral_score::integer,0)) as coverage_priority,
  pillar_slug,
  pillar_classified_at
from public.texas_news_feed
where target_site='keeptxred'
  and (internal_slug is null or btrim(internal_slug)='')
  and pub_date >= now()-interval '7 days'
  and (
    coalesce(texas_relevance_score::integer,0) >= 40
    or coalesce(viral_score::integer,0) >= 55
    or routing_type = any(array['SEO_ARTICLE'::text,'BOTH'::text])
  )
  and coalesce((viral_signals->>'source_contamination')::boolean,false)=false
  and coalesce(viral_signals->>'exclusion_reason','') not ilike '%utility%'
  and lower(btrim(title)) not in (
    'map','cameras','incidents','file viewing information','contracting opportunities',
    '- texas workforce commission','texas 10 most wanted - tx dps','still wanted - tx dps'
  )
  and lower(btrim(title)) !~ '^(fugitive|captured|sex offender|criminal illegal immigrant) details id [0-9]+$';

-- A local outlet can syndicate national/international stories. This exact row
-- was incorrectly scored as Texas-relevant solely because its source was KXAN.
update public.texas_news_feed
set viral_signals=coalesce(viral_signals,'{}'::jsonb)||jsonb_build_object(
      'source_contamination',true,
      'auto_publish_eligible',false,
      'editorial_lane','EXCLUDE',
      'exclusion_reason','non-Texas syndicated story: Swedish school sword attack'
    ),
    ready_for_rewrite=false
where title='Student killed in sword attack at a Swedish school was a 17-year-old girl'
  and internal_slug is null;

comment on view public.news_coverage_gaps is
  'Texas newsroom coverage gaps excluding explicitly quarantined contamination and deterministic utility/navigation/detail pages that are not editorial stories.';
