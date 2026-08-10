import { describe, expect, it } from 'vitest';
import {
  normalizeResourceSearchParams,
  normalizeResourceSearchQuery,
  normalizeResourceSearchType,
  resourceSearchHref,
} from './search-params';

describe('shared resource search parameters', () => {
  it('trims and limits incoming queries', () => {
    expect(normalizeResourceSearchQuery('  property taxes  ')).toBe('property taxes');
    expect(normalizeResourceSearchQuery('x'.repeat(200))).toHaveLength(120);
  });

  it('accepts known entity types and rejects unknown values', () => {
    expect(normalizeResourceSearchType('representative')).toBe('representative');
    expect(normalizeResourceSearchType('unknown')).toBe('all');
    expect(normalizeResourceSearchType(null)).toBe('all');
  });

  it('normalizes complete search objects', () => {
    expect(normalizeResourceSearchParams({ q: ' bills ', type: 'bill' })).toEqual({ q: 'bills', type: 'bill' });
  });

  it('builds encoded, shareable search links', () => {
    expect(resourceSearchHref('property taxes')).toBe('/texas-resources?q=property+taxes');
    expect(resourceSearchHref('Charles Schwertner', 'representative')).toBe('/texas-resources?q=Charles+Schwertner&type=representative');
    expect(resourceSearchHref('')).toBe('/texas-resources');
  });
});
