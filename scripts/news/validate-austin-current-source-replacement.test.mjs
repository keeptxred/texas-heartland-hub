import fs from 'node:fs';
import { expect, test } from 'vitest';

const migration = fs.readFileSync(
  'supabase/migrations/20260829162000_replace_retired_austin_monitor_with_current.sql',
  'utf8',
);

test('retired Austin Monitor is disabled and replaced by direct Austin Current RSS', () => {
  expect(migration).toContain("WHERE source_name = 'Austin Monitor'");
  expect(migration).toContain('enabled = false');
  expect(migration).toContain('stopped publishing October 28, 2025');
  expect(migration).toContain("'Austin Current — Direct RSS'");
  expect(migration).toContain("'https://austincurrent.org/'");
  expect(migration).toContain("'https://austincurrent.org/feed/'");
  expect(migration).toContain("'Austin'::text AS category");
});

test('Austin Current remains review-only and does not add a publication bypass', () => {
  expect(migration).toContain('source_reputation_score = 60');
  expect(migration).toContain('below 65 automatic-source threshold');
  expect(migration).not.toContain('news.google.com');
  expect(migration).not.toContain('auto_publish_eligible');
  expect(migration).not.toContain('daily_articles');
});
