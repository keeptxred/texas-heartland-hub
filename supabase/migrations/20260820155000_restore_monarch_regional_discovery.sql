-- Regional browse queries store stable region slugs, not display labels.
-- This is metadata maintenance on an existing row, not article publication;
-- UPDATE ONLY keeps that boundary explicit for the publication validator.
update only public.daily_articles
set affected_regions = array['san-antonio']::text[],
    updated_at = now()
where slug = 'live-2026-07-01-san-antonio-luxury-lodging-expands-with-the-monarch-opening-w4mj12'
  and coalesce(quality_flags, '{}'::text[]) @> array['legacy_url_restored']::text[]
  and affected_regions is distinct from array['san-antonio']::text[];
