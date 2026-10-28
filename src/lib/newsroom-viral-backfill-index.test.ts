import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

const sql = readFileSync('supabase/migrations/20261028015800_optimize_unscored_viral_feed_backfill_io.sql','utf8');
const route = readFileSync('src/routes/api/public/hooks/score-viral.ts','utf8');

describe('newsroom score-viral cold backfill DB I/O index', () => {
  it('uses a small index covering only unfinished scoring, not all 25k feed records', () => {
    expect(sql).toContain('CREATE INDEX IF NOT EXISTS idx_texas_news_feed_unscored_backfill_recent');
    expect(sql).toContain('ON public.texas_news_feed USING btree (pub_date DESC, id DESC)');
    expect(sql).toContain('WHERE viral_scored_at IS NULL');
    expect(sql).toContain("SET lock_timeout = '3s'");
  });

  it('matches the existing read query without weakening newsroom scoring or publishing', () => {
    expect(route).toContain('const backfillSinceIso = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()');
    expect(route).toContain('.gte("pub_date", backfillSinceIso).is("viral_scored_at", null)');
    expect(route).toContain('.order("pub_date", { ascending: false }).limit(70)');
    expect(sql).not.toMatch(/\b(?:DELETE FROM|TRUNCATE TABLE|DROP INDEX|ALTER POLICY)\b/i);
  });
});
