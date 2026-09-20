import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260829155000_scope_kxan_local_feed.sql', 'utf8');

test('KXAN Austin source uses the dedicated local-news RSS', () => {
  expect(migration).toContain('https://www.kxan.com/news/local/feed/');
  expect(migration).toContain("source_name = 'KXAN — Austin'");
  expect(migration).toContain('enabled = true');
  expect(migration).not.toContain('delete from public.texas_news_feed');
});
