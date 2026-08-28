import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260828230500_quarantine_pro_sports_utility_pages.sql',
  'utf8',
);

test('pro sports discovery quarantines utility/service pages without deleting or touching linked content', () => {
  for (const token of ['how to watch', 'live stream', 'where to watch', 'tv channel', '\\modds\\M', '\\mspread\\M', 'prediction', '\\mpicks\\M']) {
    expect(migration).toContain(token);
  }
  expect(migration).toContain("new.ready_for_rewrite := false");
  expect(migration).toContain("'auto_publish_eligible', false");
  expect(migration).toContain("internal_slug is null");
  expect(migration).not.toContain('delete from public.texas_news_feed');
});
