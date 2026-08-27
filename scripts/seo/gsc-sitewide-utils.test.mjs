import { describe, expect, it } from 'vitest';
import { extractSitemapLocs, normalizeSiteUrl, selectInspectionUrls } from './gsc-sitewide-utils.mjs';

describe('sitewide GSC URL utilities', () => {
  it('normalizes KeepTXRed URLs to the canonical host and strips query/hash', () => {
    expect(normalizeSiteUrl('https://www.keeptxred.com/texas-politics/figures/?utm_source=x#bio')).toEqual({
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

  it('keeps priority pages and rotates sitemap inspection coverage deterministically', () => {
    const sitemapUrls = Array.from({ length: 20 }, (_, index) => `https://keeptxred.com/page-${index}`);
    const selected = selectInspectionUrls({
      sitemapUrls,
      priorityUrls: ['https://www.keeptxred.com/texas-politics/figures/', 'https://keeptxred.com/page-1'],
      limit: 6,
      metricDate: '2026-08-24',
    });
    expect(selected).toHaveLength(6);
    expect(selected[0]).toBe('https://keeptxred.com/texas-politics/figures');
    expect(selected[1]).toBe('https://keeptxred.com/page-1');
    expect(new Set(selected).size).toBe(selected.length);
  });
});
