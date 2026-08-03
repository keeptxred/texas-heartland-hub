import { SHARED_ENTITIES } from '../../src/shared/texas-platform/entities.ts';
import { entitiesNeedingReview, entityQuality } from '../../src/shared/texas-platform/quality.ts';

const rows = SHARED_ENTITIES.map((entity) => ({ entity, quality: entityQuality(entity) }));
const average = rows.length
  ? Math.round(rows.reduce((total, row) => total + row.quality.score, 0) / rows.length)
  : 0;
const current = rows.filter((row) => row.quality.freshness === 'current').length;
const reviewSoon = rows.filter((row) => row.quality.freshness === 'review-soon').length;
const stale = rows.filter((row) => row.quality.freshness === 'stale').length;
const unknown = rows.filter((row) => row.quality.freshness === 'unknown').length;

console.log(`Shared entity quality: ${average}% average across ${rows.length} entities.`);
console.log(`Freshness: ${current} current, ${reviewSoon} review soon, ${stale} stale, ${unknown} unknown.`);

const needsReview = entitiesNeedingReview(SHARED_ENTITIES).slice(0, 25);
if (!needsReview.length) {
  console.log('No shared entities currently require review.');
  process.exit(0);
}

console.log(`Top ${needsReview.length} review priorities:`);
for (const { entity, quality } of needsReview) {
  const missing = quality.missing.length ? `; missing ${quality.missing.join(', ')}` : '';
  console.log(`  - ${entity.id}: ${quality.score}% (${quality.freshness}${missing})`);
}
