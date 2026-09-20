import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260827205000_add_kcen_dallas_verified_rss_sources.sql',
  'utf8',
);

test('verified KCEN and City of Dallas RSS sources remain enabled', () => {
  expect(migration).toContain('https://www.kcentv.com/feeds/syndication/rss/news/local');
  expect(migration).toContain('https://www.dallascitynews.net/feed/');
  expect(migration).toContain('KCEN 6 — Central Texas Local RSS');
  expect(migration).toContain('City of Dallas News — Official RSS');
  expect(migration).toContain('where not exists');
  expect(migration).toContain('true');
});
