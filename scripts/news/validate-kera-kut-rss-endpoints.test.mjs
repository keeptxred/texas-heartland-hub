import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260827204500_fix_kera_kut_rss_endpoints.sql',
  'utf8',
);

test('KERA and KUT use verified non-empty official RSS endpoints', () => {
  expect(migration).toContain('https://www.kut.org/feeds/3367/rss.xml');
  expect(migration).toContain('https://www.keranews.org/news.rss');
  expect(migration).toContain("source_name = 'KUT 90.5 — Austin'");
  expect(migration).toContain("source_name = 'KERA News'");
  expect(migration).not.toContain('enabled = false');
});
