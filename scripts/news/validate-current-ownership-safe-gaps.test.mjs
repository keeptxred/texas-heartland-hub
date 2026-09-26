import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260926050500_route_current_ownership_safe_gaps.sql','utf8');

test('current ownership-safe gaps preserve KTR public affairs and business ownership', () => {
  for (const token of ['immigration programs?', 'academic freedom', 'tirz money', 'outer loop.*open', 'texas adds [0-9,]+ jobs']) {
    expect(migration).toContain(token);
  }
  expect(migration).toContain("new.target_site := 'keeptxred'");
  expect(migration).toContain("new.target_section := 'Texas News'");
  expect(migration).toContain("new.target_section := 'Business'");
});

test('consumer real-estate, relocation, openings and culture route to TexasDefined', () => {
  for (const token of ['real estate market', 'gen z movers', 'store .* opens? in', 'documentary .*premiere', 'first fall front']) {
    expect(migration).toContain(token);
  }
  expect(migration).toContain("new.target_site := 'texasdefined'");
  expect(migration).toContain("new.target_section := 'Real Estate'");
  expect(migration).toContain("new.target_section := 'Texas Life'");
});

test('backfill is bounded to recent unpublished SEO review rows', () => {
  expect(migration).toContain("pub_date >= now() - interval '24 hours'");
  expect(migration).toContain("routing_type = 'SEO_ARTICLE'");
  expect(migration).toContain("target_site = 'review'");
  expect(migration).toContain("internal_slug IS NULL");
  expect(migration).toContain("texasdefined_slug IS NULL");
});
