import { expect, test } from 'vitest';
import fs from 'node:fs';

const relay = fs.readFileSync('supabase/functions/ktr-rss-relay/index.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260827222000_route_kcen_laredo_through_rss_relay.sql', 'utf8');

test('KCEN and Laredo local discovery use fixed RSS relay keys', () => {
  expect(relay).toContain('"kcen-local": "https://www.kcentv.com/feeds/syndication/rss/news/local"');
  expect(relay).toContain('"lmt-local": "https://www.lmtonline.com/default/feed/news-rss-1512.php"');
  expect(migration).toContain('KCEN 6 — Central Texas Local RSS');
  expect(migration).toContain('feed=kcen-local');
  expect(migration).toContain('Laredo Morning Times — Local RSS');
  expect(migration).toContain('feed=lmt-local');
  expect(migration).toContain('enabled=true');
});
