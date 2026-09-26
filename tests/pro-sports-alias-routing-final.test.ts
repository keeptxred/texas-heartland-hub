import { expect, test } from 'vitest';
import fs from 'node:fs';

const sql = fs.readFileSync('supabase/migrations/20260926203000_finalize_pro_sports_alias_routing.sql','utf8');

test('final pro-sports guard accepts unambiguous aliases but keeps Rangers context-gated', () => {
  expect(sql).toContain('has_unambiguous_alias');
  expect(sql).toContain('mavs|mavericks|cowboys|astros|texans|spurs');
  expect(sql).toContain('has_rangers_sports_context');
  expect(sql).toContain('is_law_enforcement_rangers');
  expect(sql).toContain("new.target_site := 'texasdefined'");
  expect(sql).toContain("new.target_section := 'Sports'");
  expect(sql).toContain("new.target_site := 'review'");
  expect(sql).toContain('internal_slug is null and texasdefined_slug is null');
  expect(sql).not.toContain('delete from public.texas_news_feed');
});
