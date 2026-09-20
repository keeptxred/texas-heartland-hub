import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260827221000_record_st_louis_encephalitis_source_recovery.sql', 'utf8');

test('St. Louis encephalitis source recovery remains review-held', () => {
  expect(migration).toContain('Corpus Christi man survives rare St. Louis encephalitis after 11-week battle');
  expect(migration).toContain("'KIII'");
  expect(migration).toContain('yahoo.com/news/videos/corpus-christi-man-survives-rare-034246292.html');
  expect(migration).toContain("'editorial_lane','REVIEW'");
  expect(migration).toContain("'auto_publish_eligible',false");
  expect(migration).toContain('ready_for_rewrite');
  expect(migration).toContain("disposition='review_ready'");
  expect(migration).toContain("story_key='st-louis-encephalitis'");
  expect(migration).toContain("r.disposition <> 'published'");
  expect(migration).not.toContain('daily_articles');
});
