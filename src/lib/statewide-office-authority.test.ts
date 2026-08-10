import { describe, expect, it } from 'vitest';
import { GOVERNMENT_ENTITIES, GOVERNMENT_REVIEWED_AT } from '@/lib/texas-government';
import {
  STATEWIDE_OFFICE_AUTHORITY_ENTITIES,
  statewideOfficeToAuthorityEntity,
} from '@/lib/statewide-office-authority';

describe('statewide office authority adapter', () => {
  it('maps the governor office into the canonical authority model', () => {
    const governor = GOVERNMENT_ENTITIES.find((entity) => entity.slug === 'governor');
    expect(governor).toBeDefined();

    const authority = statewideOfficeToAuthorityEntity(governor!);

    expect(authority).toMatchObject({
      id: 'statewide-office:governor',
      entityType: 'statewide-office',
      slug: 'governor',
      name: 'Governor of Texas',
      active: true,
      lastVerified: GOVERNMENT_REVIEWED_AT,
    });
    expect(authority.sourceOfTruth?.url).toBe(governor!.officialUrl);
  });

  it('only exports government entities classified as offices', () => {
    expect(STATEWIDE_OFFICE_AUTHORITY_ENTITIES.length).toBeGreaterThan(0);
    expect(
      STATEWIDE_OFFICE_AUTHORITY_ENTITIES.every(
        (entity) => entity.entityType === 'statewide-office',
      ),
    ).toBe(true);
  });

  it('rejects non-office government entities', () => {
    const legislature = GOVERNMENT_ENTITIES.find(
      (entity) => entity.entityType !== 'office',
    );
    expect(legislature).toBeDefined();
    expect(() => statewideOfficeToAuthorityEntity(legislature!)).toThrow(
      /not a statewide office/,
    );
  });
});
