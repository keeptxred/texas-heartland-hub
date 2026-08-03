import { describe, expect, it } from 'vitest';
import { absoluteResourceSearchUrl } from './search-sharing';

describe('shared search sharing', () => {
  it('builds an absolute share URL from a site origin', () => {
    expect(absoluteResourceSearchUrl('https://keeptxred.com', 'property taxes')).toBe(
      'https://keeptxred.com/texas-resources?q=property+taxes',
    );
  });

  it('preserves a selected entity type', () => {
    expect(absoluteResourceSearchUrl('https://keeptxred.com/', 'Charles Schwertner', 'representative')).toBe(
      'https://keeptxred.com/texas-resources?q=Charles+Schwertner&type=representative',
    );
  });

  it('normalizes extra whitespace through the shared URL builder', () => {
    expect(absoluteResourceSearchUrl('https://keeptxred.com', '  Texas laws  ')).toBe(
      'https://keeptxred.com/texas-resources?q=Texas+laws',
    );
  });
});
