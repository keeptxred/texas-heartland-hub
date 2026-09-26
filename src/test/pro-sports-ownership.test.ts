import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260926035000_align_pro_sports_with_texasdefined_ownership.sql',
  'utf8',
);

test('routine pro sports follows current TexasDefined ownership while contamination remains held', () => {
  expect(migration).toContain("new.target_site := 'texasdefined'");
  expect(migration).toContain("new.target_section := 'Sports'");
  expect(migration).toContain("new.target_site := 'review'");
  expect(migration).toContain("'auto_publish_eligible', false");
  expect(migration).toContain("internal_slug is null");
  expect(migration).toContain("texasdefined_slug is null");
  expect(migration).not.toContain("new.target_site := 'keeptxred'");
  expect(migration).not.toContain('delete from public.texas_news_feed');
});
