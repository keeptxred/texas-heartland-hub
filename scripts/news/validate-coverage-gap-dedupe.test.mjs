import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260828121500_dedupe_news_coverage_gap_reporting.sql', 'utf8');

test('coverage gap reporting collapses duplicate transport copies without deleting feed rows', () => {
  expect(migration).toContain('CREATE OR REPLACE VIEW public.news_coverage_gaps');
  expect(migration).toContain("lower(regexp_replace(btrim(title), '[^a-zA-Z0-9]+'" );
  expect(migration).toContain('row_number() OVER');
  expect(migration).toContain('PARTITION BY story_key');
  expect(migration).toContain('coverage_priority DESC');
  expect(migration).toContain('source_reputation_score');
  expect(migration).toContain('WHERE story_rank = 1');
  expect(migration).not.toMatch(/delete\s+from\s+public\.texas_news_feed/i);
  expect(migration).not.toMatch(/update\s+public\.texas_news_feed/i);
});
