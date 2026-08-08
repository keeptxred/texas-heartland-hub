import { describe, expect, it } from 'vitest';
import { classifyStoryOwnership } from './content-intelligence';

describe('story-level brand routing', () => {
  const cases = [
    ['Houston Methodist Tops Texas Hospital Rankings', 'Houston Methodist is No. 1 in the U.S. News Best Hospitals rankings.', 'TexasDefined', 'texas-culture'],
    ['Abbott Activates Panhandle Wildfire Resources', 'Gov. Greg Abbott directed TDEM to activate wildfire resources.', 'KeepTXRed', 'breaking-news'],
    ['Professors Sue A&M over Teaching Limits', 'Four professors filed a federal lawsuit challenging teaching restrictions and First Amendment limits.', 'KeepTXRed', 'government-accountability'],
    ['Texas is top moving destination for Gen Z', 'A migration report ranks Texas first for Gen Z moves and second for Millennials.', 'TexasDefined', 'moving'],
    ['Whataburger turns 76 with app-only birthday deals', 'The chain is offering 76-cent menu items and anniversary promotions.', 'TexasDefined', 'food'],
    ['Tarrant County considers voting site reductions', 'Commissioners would reduce Election Day polling locations.', 'KeepTXRed', 'elections'],
    ['FC Dallas opens Leagues Cup play tonight', 'FC Dallas faces Queretaro tonight after a winless stretch.', 'KeepTXRed', 'breaking-news'],
    ['A fan guide to Texas football traditions', 'A guide to tailgating, stadium culture and traditions across Texas.', 'TexasDefined', 'texas-culture'],
  ] as const;

  for (const [title, description, owner, domain] of cases) {
    it(`${title} -> ${owner}`, () => {
      const result = classifyStoryOwnership({ title, description, fallbackDomain: 'breaking-news' });
      expect(result.owner).toBe(owner);
      expect(result.domain).toBe(domain);
    });
  }

  it('routes a hospital enforcement story to KeepTXRed despite the hospital subject', () => {
    const result = classifyStoryOwnership({
      title: 'Texas hospital faces state lawsuit over billing practices',
      description: 'The attorney general filed a lawsuit seeking penalties.',
      source: 'Texas Hospitals, Health and Rankings',
      fallbackDomain: 'texas-culture',
    });
    expect(result.owner).toBe('KeepTXRed');
    expect(result.domain).toBe('government-accountability');
  });
});
