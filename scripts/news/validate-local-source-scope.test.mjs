import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260829154000_scope_kris_local_feed.sql', 'utf8');

test('KRIS hyperlocal discovery uses its local-news RSS', () => {
  expect(migration).toContain('https://www.kristv.com/news/local-news.rss');
  expect(migration).toContain("source_name = 'KRIS 6 — Corpus Christi Local'");
  expect(migration).toContain('enabled = true');
});

test('KRIS broad-feed cleanup is bounded to obvious syndicated unlinked rows', () => {
  expect(migration).toContain('internal_slug is null');
  expect(migration).toContain('texasdefined_slug is null');
  expect(migration).toContain('(us-news|world|science-and-tech|entertainment)');
  expect(migration).toContain('routing_type = null');
  expect(migration).toContain("'source_scope_mismatch', true");
  expect(migration).toContain("'routing_lock', true");
  expect(migration).not.toContain('delete from public.texas_news_feed');
});
