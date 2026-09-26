import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260926134500_accept_unique_mavs_alias.sql','utf8');

test('Mavs alias routes to TexasDefined without weakening ambiguous aliases', () => {
  expect(migration).toContain('has_unique_mavs_alias');
  expect(migration).toContain("new.target_site := 'texasdefined'");
  expect(migration).toContain("new.target_section := 'Sports'");
  expect(migration).toContain("has_team_alias and has_sports_context");
  expect(migration).toContain('is_law_enforcement_rangers');
  expect(migration).toContain('internal_slug is null and texasdefined_slug is null');
  expect(migration).not.toContain('delete from public.texas_news_feed');
});
