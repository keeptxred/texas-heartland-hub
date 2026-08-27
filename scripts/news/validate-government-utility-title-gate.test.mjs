import { expect, test } from 'vitest';
import fs from 'node:fs';

const detector = fs.readFileSync('src/lib/low-value-titles.ts', 'utf8');
const cleanup = fs.readFileSync('supabase/migrations/20260827194500_dequeue_government_utility_feed_rows.sql', 'utf8');

test('government utility navigation titles are explicitly gated', () => {
  for (const token of [
    'file viewing information',
    'contracting opportunities',
    'workforce policy letters',
    'bidder',
    'texas transportation commission',
    'cameras',
    'incidents',
  ]) {
    expect(detector.toLowerCase()).toContain(token);
    expect(cleanup.toLowerCase()).toContain(token);
  }
  expect(detector).toContain('^(map|cameras?|incidents?)$');
  expect(cleanup).toContain("internal_slug IS NULL");
  expect(cleanup).toContain("'auto_publish_eligible', false");
});
