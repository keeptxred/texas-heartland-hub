-- Persist the recovered Aug. 10 Texas Flyover St. Louis encephalitis source as a
-- review-held newsroom candidate. This migration never publishes content.
-- Exact source: KIII report republished by Yahoo on Aug. 9, 2026.

with upserted as (
  insert into public.texas_news_feed (
    title, source, link, description, pub_date, trend_source,
    target_site, target_section, viral_score, classification_confidence,
    viral_scored_at, ready_for_rewrite, viral_signals
  ) values (
    'Corpus Christi man survives rare St. Louis encephalitis after 11-week battle',
    'KIII',
    'https://www.yahoo.com/news/videos/corpus-christi-man-survives-rare-034246292.html',
    'KIII report republished by Yahoo on Aug. 9, 2026: a 79-year-old Corpus Christi man is recovering after contracting St. Louis encephalitis and spending 11 weeks in the hospital following an infected mosquito bite.',
    '2026-08-09 03:42:00+00',
    'Texas Flyover Aug 10 source recovery',
    'keeptxred',
    'Texas News',
    0,
    1,
    now(),
    false,
    jsonb_build_object(
      'editorial_lane','REVIEW',
      'auto_publish_eligible',false,
      'source_recovery',true,
      'source_recovery_note','KIII report republished by Yahoo; exact Corpus Christi St. Louis encephalitis story recovered after expanded-source audit'
    )
  )
  on conflict (link) do update set
    trend_source = excluded.trend_source,
    target_site = case when public.texas_news_feed.internal_slug is null then 'keeptxred' else public.texas_news_feed.target_site end,
    target_section = case when public.texas_news_feed.internal_slug is null then 'Texas News' else public.texas_news_feed.target_section end,
    ready_for_rewrite = case when public.texas_news_feed.internal_slug is null then false else public.texas_news_feed.ready_for_rewrite end,
    viral_signals = case
      when public.texas_news_feed.internal_slug is null then
        coalesce(public.texas_news_feed.viral_signals,'{}'::jsonb) || excluded.viral_signals
      else public.texas_news_feed.viral_signals
    end
  returning id,title,internal_slug
), candidate as (
  select id,title from upserted where internal_slug is null
  union all
  select id,title from public.texas_news_feed
  where link='https://www.yahoo.com/news/videos/corpus-christi-man-survives-rare-034246292.html'
    and internal_slug is null
  limit 1
)
update public.flyover_aug10_reconciliation r
set disposition='review_ready',
    feed_id=c.id,
    feed_title=c.title,
    evidence_note='Exact source recovered: KIII report republished by Yahoo on Aug. 9, 2026 identifies a 79-year-old Corpus Christi man recovering from St. Louis encephalitis after an 11-week hospitalization. Candidate remains review-held; no publication performed.',
    last_verified_at=now(),
    updated_at=now()
from candidate c
where r.story_key='st-louis-encephalitis'
  and r.disposition <> 'published';
