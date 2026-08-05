import { describe, expect, it } from 'vitest';
import { TEXAS_LEGISLATIVE_SEATS } from '@/data/texas-legislators.generated';
import {
  LEGISLATOR_AUTHORITY_ENTITIES,
  legislatorSeatToAuthorityEntity,
} from '@/lib/legislator-authority';
import {
  LEGISLATIVE_DISTRICT_AUTHORITY_ENTITIES,
  legislativeSeatToDistrictAuthorityEntity,
} from '@/lib/legislative-district-authority';

describe('legislator and legislative district authority adapters', () => {
  const occupiedSeat = TEXAS_LEGISLATIVE_SEATS.find(
    (seat) => !seat.vacant && seat.name && seat.authority,
  );

  it('maps an occupied legislative seat into a legislator entity', () => {
    expect(occupiedSeat).toBeDefined();
    const entity = legislatorSeatToAuthorityEntity(occupiedSeat!);

    expect(entity.entityType).toBe('legislator');
    expect(entity.id).toBe(`legislator:${occupiedSeat!.slug}`);
    expect(entity.relatedEntityIds).toContain(
      `district:texas-${occupiedSeat!.chamber}-district-${occupiedSeat!.district}`,
    );
    expect(entity.sourceOfTruth?.url).toBe(occupiedSeat!.website);
  });

  it('exports one canonical legislator entity per occupied authority-backed seat', () => {
    const expected = TEXAS_LEGISLATIVE_SEATS.filter(
      (seat) => !seat.vacant && seat.name && seat.authority,
    ).length;
    expect(LEGISLATOR_AUTHORITY_ENTITIES).toHaveLength(expected);
  });

  it('exports one district entity for every legislative seat, including vacancies', () => {
    expect(LEGISLATIVE_DISTRICT_AUTHORITY_ENTITIES).toHaveLength(
      TEXAS_LEGISLATIVE_SEATS.length,
    );
  });

  it('links an occupied district back to its legislator', () => {
    expect(occupiedSeat).toBeDefined();
    const district = legislativeSeatToDistrictAuthorityEntity(occupiedSeat!);

    expect(district.entityType).toBe('district');
    expect(district.relatedEntityIds).toEqual([
      `legislator:${occupiedSeat!.slug}`,
    ]);
  });

  it('rejects a vacant seat as a legislator entity when one is present', () => {
    const vacantSeat = TEXAS_LEGISLATIVE_SEATS.find((seat) => seat.vacant);
    if (!vacantSeat) return;

    expect(() => legislatorSeatToAuthorityEntity(vacantSeat)).toThrow(
      /no active legislator/,
    );
    expect(legislativeSeatToDistrictAuthorityEntity(vacantSeat).relatedEntityIds).toEqual([]);
  });
});
