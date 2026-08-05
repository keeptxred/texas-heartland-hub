import { describe, expect, it } from 'vitest';
import { authorityEntityPath } from '@/lib/authority-entity-paths';

describe('authority entity paths', () => {
  it.each([
    ['statewide-office', 'governor', '/texas-government/offices/governor'],
    ['legislator', 'jane-doe', '/representatives/jane-doe'],
    ['candidate', 'john-doe', '/elections/candidates/john-doe'],
    ['committee', 'finance', '/texas-legislature/committees/finance'],
    ['agency', 'tea', '/texas-government/agencies/tea'],
    ['district', 'tx-07', '/elections/districts/tx-07'],
  ] as const)('builds the canonical %s path', (type, slug, expected) => {
    expect(authorityEntityPath(type, slug)).toBe(expected);
  });
});
