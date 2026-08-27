import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260827215700_filter_coverage_gap_noise.sql','utf8');

test('coverage gaps exclude quarantined and deterministic utility rows', () => {
  expect(migration).toContain("viral_signals->>'source_contamination'");
  for (const title of ['map','cameras','incidents','file viewing information','contracting opportunities']) {
    expect(migration).toContain(`'${title}'`);
  }
  expect(migration).toContain('details id [0-9]+');
});

test('known non-Texas syndicated KXAN story is quarantined without publishing', () => {
  expect(migration).toContain('Student killed in sword attack at a Swedish school was a 17-year-old girl');
  expect(migration).toContain("'editorial_lane','EXCLUDE'");
  expect(migration).toContain("'auto_publish_eligible',false");
  expect(migration).toContain('ready_for_rewrite=false');
  expect(migration).not.toContain('daily_articles');
});
