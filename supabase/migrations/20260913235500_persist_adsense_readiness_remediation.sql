-- Persist the September 13 AdSense-readiness data remediation so production,
-- preview, and future restored environments converge on the same reviewed state.
-- This does not lower any quality threshold or restore any quarantined article.

UPDATE public.daily_articles
SET content_quality_score = 75,
    quality_flags = ARRAY(
      SELECT DISTINCT flag
      FROM unnest(COALESCE(quality_flags, ARRAY[]::text[]) || ARRAY['missing_why_this_matters']) AS flag
    )
WHERE slug IN (
  '2026-09-04-denton-191-turtles-shipment',
  '2026-09-04-fort-worth-kindergartner-school-safety',
  '2026-09-04-paxton-financial-disclosures-ethics',
  '2026-09-04-tesla-cybercab-austin-launch',
  '2026-09-04-texas-am-core-curriculum-sb37',
  '2026-09-04-texas-food-insecurity-one-in-five',
  '2026-09-04-texas-sboe-social-studies-standards',
  '2026-09-04-texas-school-voucher-2b-request',
  '2026-09-04-trinity-county-deer-viral-video'
)
AND content_quality_score IS NULL;

UPDATE public.daily_articles
SET content_quality_score = 60,
    quality_flags = ARRAY(
      SELECT DISTINCT flag
      FROM unnest(
        COALESCE(quality_flags, ARRAY[]::text[])
        || ARRAY['thin_body', 'missing_why_this_matters', 'site_boundary_violation']
      ) AS flag
    )
WHERE slug = '2026-09-04-desoto-handshake-viral-backlash'
AND content_quality_score IS NULL;

UPDATE public.daily_articles
SET dek = 'Abbott appointed 10 members to the Trinity River Authority board, filling terms through 2027 and 2029 as the agency oversees water resources across the Trinity River Basin.',
    content_quality_score = 88,
    quality_flags = array_remove(COALESCE(quality_flags, ARRAY[]::text[]), 'weak_dek')
WHERE slug = '2026-09-10-governor-abbott-appoints-ten-to-trinity-river-authority-board-of-directors'
AND (
  content_quality_score = 68
  OR 'weak_dek' = ANY(COALESCE(quality_flags, ARRAY[]::text[]))
);

UPDATE public.daily_articles
SET dek = 'Jimmy Kimmel says FCC equal-time pressure led ABC to keep his James Talarico interview off television and move it to YouTube during the 2026 Texas Senate race.',
    content_quality_score = 88,
    quality_flags = array_remove(COALESCE(quality_flags, ARRAY[]::text[]), 'weak_dek')
WHERE slug = '2026-09-11-jimmy-kimmel-won-t-air-james-talarico-interview-due-to-fcc-threats'
AND (
  content_quality_score = 68
  OR 'weak_dek' = ANY(COALESCE(quality_flags, ARRAY[]::text[]))
);
