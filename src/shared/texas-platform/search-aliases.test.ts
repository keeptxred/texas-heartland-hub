import { describe, expect, it } from 'vitest';
import { expandSearchTokens, expandedSearchText } from './search-aliases';

describe('shared search aliases', () => {
  it('expands representative shorthand', () => {
    expect(expandSearchTokens('rep')).toEqual(expect.arrayContaining(['rep', 'representative', 'legislator']));
  });

  it('expands common visitor vocabulary', () => {
    expect(expandSearchTokens('moving')).toEqual(expect.arrayContaining(['moving', 'relocation', 'move']));
    expect(expandSearchTokens('bills')).toEqual(expect.arrayContaining(['bills', 'bill', 'legislation']));
  });

  it('deduplicates aliases', () => {
    const tokens = expandSearchTokens('tax taxes');
    expect(new Set(tokens).size).toBe(tokens.length);
  });

  it('provides normalized expanded text', () => {
    expect(expandedSearchText('  Texas Laws! ')).toContain('texas laws');
    expect(expandedSearchText('Texas Laws')).toContain('legislation');
  });
});
