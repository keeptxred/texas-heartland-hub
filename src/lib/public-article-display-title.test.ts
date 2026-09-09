import { describe, expect, it } from 'vitest';
import { resolvePublicArticleDisplayTitle } from '@/lib/public-article-display-title';

describe('resolvePublicArticleDisplayTitle', () => {
  it('prefers the public SEO headline used by article pages', () => {
    expect(resolvePublicArticleDisplayTitle({
      title: 'Stored newsroom title',
      seo_headline: 'Public article headline',
    })).toBe('Public article headline');
  });

  it('falls back to the stored title when the SEO headline is blank', () => {
    expect(resolvePublicArticleDisplayTitle({
      title: 'Stored newsroom title',
      seo_headline: '   ',
    })).toBe('Stored newsroom title');
  });

  it('trims the selected public title', () => {
    expect(resolvePublicArticleDisplayTitle({
      title: ' Stored newsroom title ',
      seo_headline: null,
    })).toBe('Stored newsroom title');
  });
});
