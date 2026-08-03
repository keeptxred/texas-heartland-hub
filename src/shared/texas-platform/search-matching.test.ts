import { describe, expect, it } from 'vitest';
import { allTokensMatch, countTokenMatches, tokenMatchesText } from './search-matching';

describe('shared search matching', () => {
  it('matches exact and contained tokens', () => {
    expect(tokenMatchesText('tax', 'property tax calculator')).toBe(true);
  });

  it('matches useful prefixes of four or more characters', () => {
    expect(tokenMatchesText('mortg', 'mortgage calculator')).toBe(true);
    expect(tokenMatchesText('represent', 'representative directory')).toBe(true);
  });

  it('does not use short tokens for prefix matching', () => {
    expect(tokenMatchesText('mo', 'mortgage calculator')).toBe(false);
  });

  it('counts and verifies token matches', () => {
    const tokens = ['texas', 'mortg'];
    expect(countTokenMatches(tokens, 'texas mortgage calculator')).toBe(2);
    expect(allTokensMatch(tokens, 'texas mortgage calculator')).toBe(true);
    expect(allTokensMatch(tokens, 'texas property tax')).toBe(false);
  });
});
