import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { extractSitemapLocs, normalizeSiteUrl, selectInspectionUrls } from './gsc-sitewide-utils.mjs';

const legacyWwwOrigin = `https://${['www', 'keeptxred', 'com'].join('.')}`;

describe('sitewide GSC URL utilities', () => {
  it('normalizes KeepTXRed URLs to the canonical host and strips query/hash', () => {
    expect(normalizeSiteUrl(`${legacyWwwOrigin}/texas-politics/figures/?utm_source=x#bio`)).toEqual({
      url: 'https://keeptxred.com/texas-politics/figures',
      path: '/texas-politics/figures',
    });
    expect(normalizeSiteUrl('https://example.com/texas')).toBeNull();
  });

  it('extracts sitemap locations including escaped query delimiters', () => {
    expect(extractSitemapLocs('<urlset><url><loc>https://keeptxred.com/a</loc></url><url><loc>https://keeptxred.com/b?x=1&amp;y=2</loc></url></urlset>')).toEqual([
      'https://keeptxred.com/a',
      'https://keeptxred.com/b?x=1&y=2',
    ]);
  });

  it('keeps the uncovered 2026 Texas Laws pages inside the existing small daily GSC priority budget', () => {
    // The CLI script authenticates to Google at module evaluation; inspect only
    // its static priority list here so no secrets or external API calls are needed.
    const source = readFileSync(new URL('./sync-gsc-sitewide.mjs', import.meta.url), 'utf8');
    const list = source.split('const builtInPriority = [')[1]?.split('];')[0] ?? '';
    expect(list).toContain('https://keeptxred.com/laws/topics');
    expect(list).toContain('https://keeptxred.com/laws/topic/wills-probate-inheritance-law');
    const priorities = [...list.matchAll(/'https:\/\/keeptxred\.com\/[^']*'/g)].map((match) => match[0]);
    expect(priorities.length).toBeLessThanOrEqual(25);
    expect(priorities.length).toBeGreaterThan(0);
    expect(new Set(priorities).size).toBe(priorities.length);
  });

  it('keeps priority pages and rotates sitemap inspection coverage deterministically', () => {
    const sitemapUrls = Array.from({ length: 20 }, (_, index) => `https://keeptxred.com/page-${index}`);
    const selected = selectInspectionUrls({
      sitemapUrls,
      priorityUrls: [`${legacyWwwOrigin}/texas-politics/figures/`, 'https://keeptxred.com/page-1'],
      limit: 6,
      metricDate: '2026-08-24',
    });
    expect(selected).toHaveLength(6);
    expect(selected[0]).toBe('https://keeptxred.com/texas-politics/figures');
    expect(selected[1]).toBe('https://keeptxred.com/page-1');
    expect(new Set(selected).size).toBe(selected.length);
  });

  it('spreads non-priority inspection slots across top-level route families', () => {
    const sitemapUrls = [
      ...Array.from({ length: 12 }, (_, index) => `https://keeptxred.com/texas-politics/figures/person-${index}`),
      ...Array.from({ length: 12 }, (_, index) => `https://keeptxred.com/elections/race-${index}`),
      ...Array.from({ length: 12 }, (_, index) => `https://keeptxred.com/bills/bill-${index}`),
    ];
    const selected = selectInspectionUrls({
      sitemapUrls,
      priorityUrls: [],
      limit: 9,
      metricDate: '2026-09-01',
    });
    const topLevelFamilies = new Set(selected.map((url) => new URL(url).pathname.split('/').filter(Boolean)[0]));
    expect(selected).toHaveLength(9);
    expect(topLevelFamilies).toEqual(new Set(['bills', 'elections', 'texas-politics']));
  });
});
