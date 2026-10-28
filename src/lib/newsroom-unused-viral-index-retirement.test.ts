import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const sql = readFileSync('supabase/migrations/20261028021046_retire_unused_viral_score_feed_index_20261028.sql','utf8');
const activeIndex = readFileSync('supabase/migrations/20261028015800_optimize_unscored_viral_feed_backfill_io.sql','utf8');

describe('controlled Supabase feed-index footprint reclamation', () => {
  it('retires only the measured unused, non-unique old viral-score index', () => {
    expect(sql).toContain('DROP INDEX IF EXISTS public.texas_news_feed_viral_score_idx');
    expect(sql).toContain("SET lock_timeout='3s'");
    expect(sql).toContain('Exact reversible restoration DDL');
    expect(sql).not.toMatch(/\b(?:DELETE FROM|TRUNCATE TABLE|DROP TABLE|DROP SCHEMA)\b/i);
  });
  it('keeps the working partial backfill index and editorial gates intact', () => {
    expect(activeIndex).toContain('CREATE INDEX IF NOT EXISTS idx_texas_news_feed_unscored_backfill_recent');
    expect(activeIndex).toContain('WHERE viral_scored_at IS NULL');
    expect(sql).not.toContain('DROP INDEX IF EXISTS public.idx_texas_news_feed_unscored_backfill_recent');
  });
});
