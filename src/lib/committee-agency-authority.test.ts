import { describe, expect, it } from 'vitest';
import { GOVERNMENT_ENTITIES } from '@/lib/texas-government';
import {
  AGENCY_AUTHORITY_ENTITIES,
  governmentEntityToAgencyAuthorityEntity,
} from '@/lib/agency-authority';
import { committeeRowToAuthorityEntity } from '@/lib/committee-authority';

describe('committee and agency authority adapters', () => {
  it('maps a legislative committee row into the canonical authority model', () => {
    const entity = committeeRowToAuthorityEntity({
      committee_slug: 'house-public-health',
      committee_name: 'House Committee on Public Health',
      chamber: 'House',
      description: 'Considers public-health legislation.',
      source_url: 'https://house.texas.gov/committees/committee/410',
      updated_at: '2026-08-01T00:00:00Z',
      created_at: '2026-07-01T00:00:00Z',
    });

    expect(entity).toMatchObject({
      id: 'committee:house-public-health',
      entityType: 'committee',
      active: true,
      lastVerified: '2026-08-01T00:00:00Z',
    });
    expect(entity.sourceOfTruth?.url).toContain('house.texas.gov');
  });

  it('exports only board and commission government entities as agencies', () => {
    const expected = GOVERNMENT_ENTITIES.filter(
      (entity) => entity.entityType === 'board' || entity.entityType === 'commission',
    ).length;

    expect(AGENCY_AUTHORITY_ENTITIES).toHaveLength(expected);
    expect(AGENCY_AUTHORITY_ENTITIES.every((entity) => entity.entityType === 'agency')).toBe(
      true,
    );
  });

  it('rejects government entities that are not boards or commissions', () => {
    const office = GOVERNMENT_ENTITIES.find((entity) => entity.entityType === 'office');
    expect(office).toBeDefined();
    expect(() => governmentEntityToAgencyAuthorityEntity(office!)).toThrow(
      /not an agency entity/,
    );
  });
});
