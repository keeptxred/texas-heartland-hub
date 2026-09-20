import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260829024500_reconcile_coverage_gaps_with_cluster_state.sql', 'utf8');

test('coverage gaps honor normalized cluster publication and corroboration state', () => {
  for (const token of [
    'bool_or(coalesce(p.status, \'\') = \'PUBLISHED\') as cluster_published',
    'max(coalesce(rp.source_count, 0)) as packet_source_count',
    "then 'corroborated_review_hold'",
    'and not coalesce(cs.cluster_published, false)',
    'news_story_cluster_items',
    'news_publish_candidates',
    'news_research_packets',
  ]) expect(migration).toContain(token);

  expect(migration).not.toContain('update public.texas_news_feed');
  expect(migration).not.toContain('auto_publish_eligible = true');
  expect(migration).not.toContain('insert into public.daily_articles');
});
