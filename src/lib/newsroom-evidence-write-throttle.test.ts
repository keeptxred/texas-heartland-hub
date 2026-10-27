import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const sql = readFileSync('supabase/migrations/20261027213152_throttle_unchanged_news_event_fact_refresh_and_sources_20261027.sql','utf8');
describe('newsroom evidence WAL safeguards',()=>{
  it('rate-limits only identical fact refreshes and preserves material changes',()=>{
    expect(sql).toContain("OLD.last_seen_at > pg_catalog.statement_timestamp() - interval '6 hours'");
    expect(sql).toContain("pg_catalog.to_jsonb(NEW) - 'last_seen_at' - 'updated_at'");
    expect(sql).toContain('IS NOT DISTINCT FROM');
    expect(sql).toContain('RETURN NULL');
    expect(sql).toContain('RETURN NEW');
    expect(sql).toContain('trg_news_event_facts_updated_at remains unchanged');
  });
  it('avoids exact duplicate event-source upserts without changing publication rules',()=>{
    expect(sql).toContain('BEFORE UPDATE ON public.news_event_cluster_sources');
    expect(sql).toContain('private.skip_semantically_unchanged_update()');
    expect(sql).toContain('REVOKE ALL ON FUNCTION private.throttle_unchanged_news_event_fact_refresh()');
    expect(sql).not.toMatch(/\b(?:DELETE FROM|TRUNCATE TABLE)\b/);
  });
});