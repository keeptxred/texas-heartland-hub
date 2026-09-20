import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260828122500_gate_pro_sports_utility_items.sql', 'utf8');

test('pro sports utility results stay social-only and cannot auto-publish', () => {
  for (const token of ['how to watch','where to watch','live stream','tv channel','odds','statcast game preview','how to buy','nike vomero']) {
    expect(migration.toLowerCase()).toContain(token);
  }
  expect(migration).toContain("new.routing_type := 'FACEBOOK_ONLY'");
  expect(migration).toContain("new.ready_for_rewrite := false");
  expect(migration).toContain("'auto_publish_eligible',false");
  expect(migration).toContain("'editorial_lane','SOCIAL_ONLY'");
  expect(migration).toContain("internal_slug is null");
  expect(migration).not.toMatch(/delete\s+from\s+public\.texas_news_feed/i);
});
