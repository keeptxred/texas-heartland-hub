import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  new URL('../../supabase/migrations/20260829160000_restore_direct_texas_ag_dps_sources.sql', import.meta.url),
  'utf8',
);

describe('direct Texas government feed restoration migration', () => {
  it('gives INSERT and UPDATE separate source CTEs in their own SQL statement scopes', () => {
    expect((sql.match(/WITH sources\(/g) || [])).toHaveLength(2);
    expect(sql).toContain('INSERT INTO public.content_sources');
    expect(sql).toContain('UPDATE public.content_sources AS existing');
    expect((sql.match(/Texas Attorney General — Direct News Releases/g) || [])).toHaveLength(2);
    expect((sql.match(/Texas DPS — Direct Most Wanted RSS/g) || [])).toHaveLength(2);
  });

  it('remains idempotent and does not change publication guards', () => {
    expect(sql).toContain('WHERE NOT EXISTS (');
    expect(sql).toContain('WHERE existing.source_name = s.source_name');
    expect(sql).not.toContain('DELETE FROM');
    expect(sql).not.toContain('TRUNCATE');
  });
});
