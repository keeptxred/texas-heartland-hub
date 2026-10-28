import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const sql = readFileSync('supabase/migrations/20261028013300_skip_unchanged_coverage_gap_alert_writes.sql','utf8');

describe('hourly newsroom coverage alert write gate', () => {
  it('keeps the four existing verified coverage-gap reasons and priority thresholds', () => {
    for(const reason of [
      'article_generation_or_publish_gap',
      'held_for_corroboration',
      'corroborated_review_hold',
      'low_classification_confidence',
    ]) expect(sql).toContain(reason);
    expect(sql).toContain('coalesce(g.coverage_priority,0) >= p_min_priority');
    expect(sql).toContain('g.pub_date < now() - make_interval(hours => p_min_age_hours)');
  });

  it('does not rewrite identical hourly alerts solely to update the clock', () => {
    expect(sql).toContain('on conflict (incident_key) do update set');
    expect(sql).toContain('where public.publishing_alerts.status IS DISTINCT FROM excluded.status');
    expect(sql).toContain('public.publishing_alerts.latest_published_at IS DISTINCT FROM excluded.latest_published_at');
    expect(sql).toContain('public.publishing_alerts.message IS DISTINCT FROM excluded.message');
    expect(sql).toContain('public.publishing_alerts.resolved_at IS NOT NULL');
  });

  it('preserves newly opened and resolved alerts and original function security', () => {
    expect(sql).toContain("status='open'");
    expect(sql).toContain("set status='resolved',resolved_at=now(),updated_at=now()");
    expect(sql).toContain('SECURITY DEFINER');
    expect(sql).not.toMatch(/\\b(?:DROP TABLE|TRUNCATE TABLE|DELETE FROM)\\b/i);
  });
});
