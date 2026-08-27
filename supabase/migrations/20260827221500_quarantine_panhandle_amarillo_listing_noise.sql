-- Preserve existing feed history but hold the known Amarillo Tribune name-only
-- listing rows that entered through Panhandle regional discovery. These rows
-- have no linked/published slug and descriptions containing only title + source.

update public.texas_news_feed
set target_site = 'review',
    target_section = 'Unclassified',
    ready_for_rewrite = false,
    viral_score = 0,
    viral_scored_at = coalesce(viral_scored_at, now()),
    classification_confidence = 1,
    viral_signals = coalesce(viral_signals, '{}'::jsonb) || jsonb_build_object(
      'listing_noise', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'exclusion_reason', 'Panhandle regional discovery Amarillo Tribune name-only listing'
    )
where trend_source = 'Texas Panhandle and South Plains — Regional Discovery'
  and source = 'Amarillo Tribune'
  and internal_slug is null
  and texasdefined_slug is null
  and length(title) <= 64
  and title !~ '[?!:]'
  and array_length(regexp_split_to_array(btrim(title), '\s+'), 1) between 2 and 6
  and lower(regexp_replace(coalesce(description, ''), '\s+', ' ', 'g')) =
      lower(regexp_replace(title || ' Amarillo Tribune', '\s+', ' ', 'g'));
