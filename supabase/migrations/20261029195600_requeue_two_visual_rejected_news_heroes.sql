-- BULK_ARTICLE_MAINTENANCE
-- Retire exactly two known 2026-10-14 visual-rejected staging candidates.
-- They are NOT an approved hero; retain their prior URLs and validator verdicts
-- in permanent history, then allow the existing OIDC-backed, vision-gated
-- image recovery process to create and validate a NEW replacement.
--
-- Do not set featured_image_url, image_url, ready, or positive vision notes.
-- The identity guard in enforce_article_hero_visual_readiness remains active.
WITH exact_rejections(slug, expected_candidate_url) AS (
  VALUES
    (
      '2026-10-14-house-republicans-pull-3-million-reserved-for-ads-against-henry-cuellar'::text,
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Henry_Cuellar,_official_portrait.jpg'::text
    ),
    (
      '2026-10-14-texas-penalties-for-data-center-violations-are-light-despite-tough-talk-from-abb'::text,
      '/api/public/article-image/2026-08-20-multiple-data-centers-commit-to-comply-with-governor-abbott-s-data-ce.jpg'::text
    )
)
UPDATE public.daily_articles AS article
SET image_validation_history = coalesce(article.image_validation_history, '[]'::jsonb)
      || jsonb_build_array(jsonb_build_object(
        'at', now(),
        'event', 'specific_rejected_candidate_retired_for_vision_gated_replacement',
        'url', article.image_candidate_url,
        'note', left(coalesce(article.image_validation_note, ''), 1000),
        'reason', 'Previously stored image failed article-specific visual match; retain audit record, generate and independently approve a replacement'
      )),
    image_candidate_url = NULL,
    image_candidate_alt_text = NULL,
    image_generation_status = 'failed',
    image_validation_note = 'visual-rejected prior candidate retired for bounded image recovery; no new hero approved'
FROM exact_rejections AS rejected
WHERE article.slug = rejected.slug
  AND article.image_candidate_url = rejected.expected_candidate_url
  AND article.featured_image_url IS NULL
  AND article.image_generation_status = 'failed'
  AND article.image_validation_note LIKE 'stored-cloudflare-vision-v5 rejected:%'
  AND article.published_at IS NOT NULL
  AND article.kind = 'news';
