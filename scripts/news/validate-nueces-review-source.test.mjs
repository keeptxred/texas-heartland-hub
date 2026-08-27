import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260827223000_use_accessible_official_nueces_source.sql','utf8');

test('Nueces review source stays official, accessible, and held', () => {
  expect(migration).toContain('Texas State Library and Archives Commission');
  expect(migration).toContain('https://www.tsl.texas.gov/exhibits/civilwar/dissent.html');
  expect(migration).toContain("'editorial_lane','REVIEW'");
  expect(migration).toContain("'auto_publish_eligible',false");
  expect(migration).toContain('ready_for_rewrite = false');
  expect(migration).toContain("story_key='nueces-1862-history'");
  expect(migration).not.toContain('daily_articles');
  expect(migration).not.toContain('publishSingleFeedItem');
});
