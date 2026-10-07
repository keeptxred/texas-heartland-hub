create index if not exists texas_news_feed_texasdefined_story_idx
  on public.texas_news_feed (id)
  where target_site = 'texasdefined';

create index if not exists texas_news_feed_texasdefined_ready_idx
  on public.texas_news_feed (pub_date desc, id)
  where target_site = 'texasdefined'
    and texasdefined_slug is null
    and ready_for_rewrite is true
    and coalesce(length(trim(extracted_body)),0) >= 1200
    and coalesce(classification_confidence,0) >= 0.80
    and coalesce(texas_relevance_score::integer,0) >= 70
    and coalesce(source_reputation_score::integer,0) >= 60
    and coalesce(preflight_json->>'status','') <> all(array['HOLD','PUBLICATION_HOLD'])
    and coalesce(preflight_json->>'reason','') <> all(array['HOLD','PUBLICATION_HOLD'])
    and coalesce(trim(preflight_json->>'publicationHoldReason'),'') = '';
