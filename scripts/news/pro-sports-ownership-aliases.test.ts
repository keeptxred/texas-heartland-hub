import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260926130500_restore_pro_sports_alias_context.sql','utf8');

test('pro sports ownership guard recognizes common aliases without changing TexasDefined ownership', () => {
  expect(migration).toContain('mavs|mavericks');
  expect(migration).toContain('series preview');
  expect(migration).toContain('pitching');
  expect(migration).toContain('homers');
  expect(migration).toContain("new.target_site := 'texasdefined'");
  expect(migration).toContain("new.target_section := 'Sports'");
  expect(migration).toContain('Texas Rangers law-enforcement');
  expect(migration).toContain('internal_slug is null and texasdefined_slug is null');
  expect(migration).not.toContain('delete from public.texas_news_feed');
});
