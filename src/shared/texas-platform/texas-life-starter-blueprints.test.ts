import { describe, expect, it } from 'vitest';
import { validateTexasLifeBlueprint } from './texas-life-page-blueprint';
import { TEXAS_LIFE_STARTER_BLUEPRINTS, texasLifeStarterBlueprint } from './texas-life-starter-blueprints';

describe('Texas Life starter blueprints', () => {
  it('provides complete publication-ready starter pages', () => {
    expect(TEXAS_LIFE_STARTER_BLUEPRINTS.length).toBeGreaterThanOrEqual(3);
    for (const blueprint of TEXAS_LIFE_STARTER_BLUEPRINTS) {
      expect(validateTexasLifeBlueprint(blueprint)).toEqual({ complete: true, missing: [], errors: [] });
      expect(blueprint.nextSteps.length).toBeGreaterThanOrEqual(3);
      expect(blueprint.trust.authorityUrl).toMatch(/^https:\/\//);
    }
  });

  it('covers practical resident and business tasks', () => {
    expect(texasLifeStarterBlueprint('homestead-exemption')?.pillar).toBe('do');
    expect(texasLifeStarterBlueprint('moving-to-texas')?.title).toBe('Moving to Texas');
    expect(texasLifeStarterBlueprint('start-an-llc')?.trust.authorityName).toBe('Texas Secretary of State');
  });

  it('returns undefined for unknown pages', () => {
    expect(texasLifeStarterBlueprint('unknown')).toBeUndefined();
  });
});
