import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260827204500_set_regional_discovery_reputation.sql',
  'utf8',
);

const regionalSources = [
  'Texas Panhandle and South Plains — Regional Discovery',
  'West Texas and Permian Basin — Regional Discovery',
  'North Texas and Cross Timbers — Regional Discovery',
  'East Texas and Piney Woods — Regional Discovery',
  'Central Texas and Brazos Valley — Regional Discovery',
  'Gulf Coast and Coastal Bend — Regional Discovery',
  'South Texas and Rio Grande Valley — Regional Discovery',
  'Hill Country and San Antonio Region — Regional Discovery',
];

test('all vetted regional discovery sweeps receive explicit reputation', () => {
  for (const source of regionalSources) expect(migration).toContain(source);
  expect(migration).toContain('source_reputation_score = 75');
  expect(migration).toContain("source_quality_reason = 'Configured Texas regional discovery feed'");
});
