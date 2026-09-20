import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260827202500_guard_pro_sports_discovery_contamination.sql',
  'utf8',
);

test('pro sports discovery quarantines unrelated Google results without touching published rows', () => {
  expect(migration).toContain('guard_texas_pro_sports_discovery_row');
  for (const team of ['dallas mavericks', 'dallas cowboys', 'texas rangers', 'houston astros', 'houston texans', 'san antonio spurs']) {
    expect(migration).toContain(team);
  }
  expect(migration).toContain("new.ready_for_rewrite := false");
  expect(migration).toContain("'auto_publish_eligible', false");
  expect(migration).toContain("new.viral_scored_at := coalesce(new.viral_scored_at, now())");
  expect(migration).toContain('internal_slug is null');
  expect(migration).not.toContain('delete from public.texas_news_feed');
});
