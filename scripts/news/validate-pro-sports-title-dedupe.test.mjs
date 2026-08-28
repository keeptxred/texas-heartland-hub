import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

const path = 'supabase/migrations/20260827235000_quarantine_pro_sports_duplicate_titles.sql';

describe('pro sports duplicate-title quarantine', () => {
  it('preserves rows but removes duplicate titles from rewrite routing', () => {
    const sql = fs.readFileSync(path, 'utf8');
    expect(sql).toContain("Texas Pro Sports — Daily Discovery");
    expect(sql).toContain('lower(btrim(f.title)) = lower(btrim(NEW.title))');
    expect(sql).toContain("NEW.target_site := 'review'");
    expect(sql).toContain('NEW.ready_for_rewrite := false');
    expect(sql).toContain('row_number() OVER');
    expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.texas_news_feed/i);
  });
});
