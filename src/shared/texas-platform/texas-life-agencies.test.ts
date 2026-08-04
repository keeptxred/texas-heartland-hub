import { describe, expect, it } from 'vitest';
import {
  TEXAS_LIFE_AGENCIES,
  texasLifeAgencyById,
  validateTexasLifeAgency,
} from './texas-life-agencies';
import {
  TEXAS_LIFE_PILLAR_HUBS,
  texasLifePillarHub,
  validateTexasLifePillarHubs,
} from './texas-life-pillar-hubs';

describe('Texas Life agency directory', () => {
  it('includes the core statewide authorities', () => {
    expect(TEXAS_LIFE_AGENCIES.map((agency) => agency.id)).toEqual(expect.arrayContaining([
      'texas-comptroller',
      'texas-secretary-of-state',
      'texas-dps',
      'texas-dmv',
      'texas-parks-wildlife',
      'texas-workforce-commission',
      'texas-education-agency',
    ]));
  });

  it('keeps official services secure and guides internal', () => {
    for (const agency of TEXAS_LIFE_AGENCIES) {
      expect(validateTexasLifeAgency(agency)).toEqual({ valid: true, errors: [] });
      expect(agency.officialUrl.startsWith('https://')).toBe(true);
      expect(agency.services.every((service) => service.href.startsWith('https://'))).toBe(true);
      expect(agency.relatedGuides.every((href) => href.startsWith('/'))).toBe(true);
    }
  });

  it('finds agencies by stable ID', () => {
    expect(texasLifeAgencyById('texas-dps')?.shortName).toBe('Texas DPS');
    expect(texasLifeAgencyById('missing')).toBeUndefined();
  });
});

describe('Texas Life pillar hubs', () => {
  it('defines all five pillars with featured destinations', () => {
    expect(TEXAS_LIFE_PILLAR_HUBS.map((hub) => hub.id)).toEqual([
      'learn',
      'decide',
      'do',
      'discover',
      'stay-informed',
    ]);
    expect(validateTexasLifePillarHubs(TEXAS_LIFE_PILLAR_HUBS)).toEqual({ valid: true, errors: [] });
    expect(TEXAS_LIFE_PILLAR_HUBS.every((hub) => hub.featured.length >= 4)).toBe(true);
  });

  it('returns a pillar by ID', () => {
    expect(texasLifePillarHub('do')?.prompt).toBe('Help me accomplish something.');
  });

  it('rejects duplicate pillar configuration', () => {
    const duplicate = [...TEXAS_LIFE_PILLAR_HUBS, TEXAS_LIFE_PILLAR_HUBS[0]];
    expect(validateTexasLifePillarHubs(duplicate).valid).toBe(false);
  });
});
