import { expect, test } from 'vitest';
import fs from 'node:fs';

const sql = fs.readFileSync('supabase/migrations/20260926204500_fix_pro_sports_postgres_boundaries.sql','utf8');

test('pro sports guard uses PostgreSQL-native word boundaries', () => {
  expect(sql).toContain("E'\\\\m(mavs|mavericks|cowboys|astros|texans|spurs)\\\\M'");
  expect(sql).toContain("E'\\\\mrangers\\\\M'");
  expect(sql).toContain("E'\\\\mdps\\\\M'");
  expect(sql).toContain("'texasdefined'");
  expect(sql).toContain("'Sports'");
  expect(sql).toContain("internal_slug is null and texasdefined_slug is null");
  expect(sql).not.toContain('delete from public.texas_news_feed');
});
