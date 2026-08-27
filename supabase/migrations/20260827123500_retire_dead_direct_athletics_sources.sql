-- The hard-coded Longhorns and Texas Tech HTML news-list URLs now return 404.
-- Healthy RSS coverage for both programs remains in content_sources. This migration
-- leaves any historical source rows untouched and documents the operational change.
COMMENT ON TABLE public.content_sources IS 'News discovery source registry. Persistently failing supplemental Google News feeds and dead hard-coded HTML fallbacks are retired without deleting historical attribution; direct/RSS coverage remains preferred.';
