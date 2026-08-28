import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260828140500_self_heal_flyover_review_alerts.sql',
  'utf8',
);

test('Flyover review alerts self-heal without publishing content', () => {
  expect(migration).toContain("'flyover-aug10-alert-self-heal-hourly'");
  expect(migration).toContain("'28 * * * *'");
  expect(migration).toContain('public.sync_flyover_aug10_publishing_alerts()');
  expect(migration).not.toMatch(/insert\s+into\s+public\.daily_articles/i);
  expect(migration).not.toMatch(/update\s+public\.texas_news_feed/i);
  expect(migration).not.toMatch(/ready_for_rewrite\s*=\s*true/i);
  expect(migration).not.toMatch(/auto_publish_eligible[^\n]*true/i);
});
