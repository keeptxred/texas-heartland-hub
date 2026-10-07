create or replace function public.count_overdue_news_coverage_gaps(p_cutoff timestamptz)
returns bigint
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  with eligible as (
    select
      f.id,
      f.title,
      f.pub_date,
      f.viral_score,
      f.classification_confidence,
      f.texas_relevance_score,
      f.source_reputation_score,
      f.routing_type,
      case
        when f.internal_slug is not null and btrim(f.internal_slug) <> '' then 'covered'
        when coalesce(f.cluster_json->>'publication_readiness','') = 'hold_for_corroboration'
          and coalesce(cs.packet_source_count,0) >= 2 then 'corroborated_review_hold'
        when left(coalesce(f.cluster_json->>'publication_readiness',''),5) = 'hold_' then 'held_for_corroboration'
        when coalesce(f.texas_relevance_score::integer,0) < 40 then 'low_texas_relevance'
        when coalesce(f.source_reputation_score::integer,0) < 55 then 'low_source_reputation'
        when coalesce(f.classification_confidence,0) < 0.60 then 'low_classification_confidence'
        when coalesce(f.viral_score::integer,0) < 55 then 'below_article_score'
        when f.routing_type = any(array['FACEBOOK_ONLY'::text,'REEL_CANDIDATE'::text]) then 'routing_gate'
        else 'article_generation_or_publish_gap'
      end as gap_reason,
      coalesce(f.viral_score::integer,0) as coverage_priority,
      lower(regexp_replace(btrim(f.title),'[^a-zA-Z0-9]+',' ','g')) as story_key
    from public.texas_news_feed f
    left join lateral (
      select
        bool_or(coalesce(pc.status,'') = 'PUBLISHED') as cluster_published,
        max(coalesce(rp.source_count,0)) as packet_source_count
      from public.news_story_cluster_items i
      left join public.news_publish_candidates pc on pc.cluster_id=i.cluster_id
      left join public.news_research_packets rp on rp.cluster_id=i.cluster_id
      where i.feed_item_id=f.id
    ) cs on true
    where f.target_site='keeptxred'
      and (f.internal_slug is null or btrim(f.internal_slug)='')
      and f.pub_date >= now()-interval '7 days'
      and not coalesce(cs.cluster_published,false)
      and (
        coalesce(f.texas_relevance_score::integer,0) >= 40
        or coalesce(f.viral_score::integer,0) >= 55
        or f.routing_type = any(array['SEO_ARTICLE'::text,'BOTH'::text])
      )
      and coalesce((f.viral_signals->>'source_contamination')::boolean,false)=false
      and coalesce(f.viral_signals->>'exclusion_reason','') not ilike '%utility%'
      and lower(btrim(f.title)) <> all(array[
        'map','cameras','incidents','file viewing information','contracting opportunities',
        '- texas workforce commission','texas 10 most wanted - tx dps','still wanted - tx dps'
      ])
      and lower(btrim(f.title)) !~ '^(fugitive|captured|sex offender|criminal illegal immigrant) details id [0-9]+$'
  ),
  ranked as (
    select
      eligible.*,
      row_number() over (
        partition by story_key
        order by coverage_priority desc,
          coalesce(source_reputation_score::integer,0) desc,
          coalesce(classification_confidence,0) desc,
          pub_date,
          id
      ) as story_rank
    from eligible
  )
  select count(*)::bigint
  from ranked
  where story_rank=1
    and gap_reason='article_generation_or_publish_gap'
    and pub_date < p_cutoff;
$$;

revoke all on function public.count_overdue_news_coverage_gaps(timestamptz) from public, anon, authenticated;
grant execute on function public.count_overdue_news_coverage_gaps(timestamptz) to service_role;
