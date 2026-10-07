import { expect, test } from 'vitest';
import fs from 'node:fs';

const source = fs.readFileSync('src/routes/api/public/newsroom-health.ts', 'utf8');

test('newsroom health uses authoritative Flyover reconciliation and transport health', () => {
  expect(source).toContain('flyover_aug10_reconciliation');
  expect(source).toContain('news_source_fetch_state');
  expect(source).toContain('flyoverDispositionCounts');
  expect(source).toContain('flyoverReviewReadyCount');
  expect(source).toContain('flyoverOutOfScopeCount');
  expect(source).toContain('flyoverSourceNeededCount');
  expect(source).toContain('classifyFetch');
  expect(source).toContain('stale_check');
  expect(source).toContain('never_checked');
  expect(source).toContain('count_overdue_news_coverage_gaps');
  expect(source).toContain('newsroom_queue_counters');
  expect(source).toContain('texasdefined_story_queue');
  expect(source).not.toContain('from("texasdefined_story_queue" as never).select("id", { count: "exact", head: true })');
  expect(source).not.toContain('.select("id", { count: "exact", head: true })\n            .eq("gap_reason", "article_generation_or_publish_gap")');
  expect(source).not.toContain('const flyoverSpecs');
  expect(source).not.toContain('function matchesSpec');
});
