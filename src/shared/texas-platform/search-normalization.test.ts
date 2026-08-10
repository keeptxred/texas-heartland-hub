import { describe, expect, it } from 'vitest';
import { isUsefulSearchQuery, normalizeSearchText, tokenizeSearchQuery } from './search-normalization';

describe('shared search normalization', () => {
  it('normalizes punctuation, spacing and accents', () => {
    expect(normalizeSearchText('  El Niño—County  ')).toBe('el nino county');
  });

  it('removes low-value stop words from search tokens', () => {
    expect(tokenizeSearchQuery('find my representative in the house')).toEqual([
      'find',
      'representative',
      'house',
    ]);
  });

  it('rejects empty and one-character searches', () => {
    expect(isUsefulSearchQuery('')).toBe(false);
    expect(isUsefulSearchQuery('a')).toBe(false);
    expect(isUsefulSearchQuery('tax')).toBe(true);
  });
});
