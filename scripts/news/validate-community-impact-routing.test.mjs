import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260829154500_route_community_impact_high_confidence.sql', 'utf8');

test('Community Impact high-confidence routes are source scoped', () => {
  expect(migration).toContain("src ~ 'community impact'");
  for (const token of ['generator installation', 'water infrastructure upgrades?', 'bond sale', 'required curriculum list']) {
    expect(migration).toContain(token);
  }
  expect(migration).toContain("new.target_site := 'keeptxred'");
  expect(migration).toContain("new.target_section := 'Texas News'");
});

test('Community Impact lifestyle/opening routes go to TexasDefined', () => {
  for (const token of ['salon.*relocat', 'bridal.*relocat', 'bass pro shops', 'live music', 'neighborhood park', 'indoor playground', 'home building']) {
    expect(migration).toContain(token);
  }
  expect(migration).toContain("new.target_site := 'texasdefined'");
  expect(migration).toContain("then 'Explore' else 'Texas Life'");
});

test('backfill is recent, unlinked and review-only', () => {
  expect(migration).toContain("trend_source = 'Community Impact — Texas Hyperlocal'");
  expect(migration).toContain('internal_slug is null');
  expect(migration).toContain('texasdefined_slug is null');
  expect(migration).toContain("target_site = 'review'");
  expect(migration).toContain("created_at >= now() - interval '48 hours'");
});
