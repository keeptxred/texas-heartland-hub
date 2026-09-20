-- Give the vetted regional Texas discovery sweeps an explicit registry reputation
-- so scoring can use their trend_source provenance for REVIEW visibility.
-- This does not elevate any underlying publisher's own reputation and cannot
-- grant auto-publish authority; the scoring layer caps provenance lifts at the
-- existing source reputation review floor (55), below the 65 auto-publish gate.

UPDATE public.content_sources
SET
  source_reputation_score = 75,
  source_quality_reason = 'Configured Texas regional discovery feed',
  updated_at = now()
WHERE source_name IN (
  'Texas Panhandle and South Plains — Regional Discovery',
  'West Texas and Permian Basin — Regional Discovery',
  'North Texas and Cross Timbers — Regional Discovery',
  'East Texas and Piney Woods — Regional Discovery',
  'Central Texas and Brazos Valley — Regional Discovery',
  'Gulf Coast and Coastal Bend — Regional Discovery',
  'South Texas and Rio Grande Valley — Regional Discovery',
  'Hill Country and San Antonio Region — Regional Discovery'
)
AND (
  source_reputation_score IS DISTINCT FROM 75
  OR source_quality_reason IS DISTINCT FROM 'Configured Texas regional discovery feed'
);
