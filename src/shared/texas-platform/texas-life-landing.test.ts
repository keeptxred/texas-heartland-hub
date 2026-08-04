import { describe, expect, it } from 'vitest';
import {
  TEXASDEFINED_LANDING_SECTIONS,
  TEXAS_SITE_ROLES,
  texasLifeLandingSection,
  validateTexasLifeLandingSections,
} from './texas-life-landing';

describe('Texas Life landing platform', () => {
  it('covers all five pillars exactly once', () => {
    expect(TEXASDEFINED_LANDING_SECTIONS.map((section) => section.pillar)).toEqual([
      'learn',
      'decide',
      'do',
      'discover',
      'stay-informed',
    ]);
    expect(validateTexasLifeLandingSections(TEXASDEFINED_LANDING_SECTIONS)).toEqual({ valid: true, errors: [] });
  });

  it('gives every pillar useful internal destinations', () => {
    for (const section of TEXASDEFINED_LANDING_SECTIONS) {
      expect(section.links.length).toBeGreaterThanOrEqual(4);
      expect(section.links.every((link) => link.href.startsWith('/'))).toBe(true);
    }
  });

  it('retrieves a landing section by pillar', () => {
    expect(texasLifeLandingSection('do')?.title).toBe('Get something done');
    expect(texasLifeLandingSection('discover')?.links.some((link) => link.label === 'State parks')).toBe(true);
  });

  it('keeps the two site roles distinct and complementary', () => {
    expect(TEXAS_SITE_ROLES.texasdefined.focus).toBe('Everyday life in Texas');
    expect(TEXAS_SITE_ROLES.keeptxred.focus).toBe('Texas politics and government');
    expect(TEXAS_SITE_ROLES.texasdefined.description).not.toContain('elections');
    expect(TEXAS_SITE_ROLES.keeptxred.description).toContain('elections');
  });

  it('rejects incomplete or duplicate landing configurations', () => {
    const invalid = validateTexasLifeLandingSections([
      ...TEXASDEFINED_LANDING_SECTIONS,
      { pillar: 'learn', title: '', description: '', links: [] },
    ]);
    expect(invalid.valid).toBe(false);
    expect(invalid.errors).toContain('Duplicate pillar: learn');
    expect(invalid.errors).toContain('Missing title: learn');
    expect(invalid.errors).toContain('Missing description: learn');
    expect(invalid.errors).toContain('Too few links: learn');
  });
});
