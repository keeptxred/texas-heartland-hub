import { describe, expect, it } from 'vitest';
import {
  BROWSE_RESOURCES,
  FEATURED_RESOURCES,
  RESOURCE_HUB_CATEGORIES,
  TEXAS_ASSISTANT_EXAMPLES,
  browseResourcesForOwner,
  featuredResourcesForOwner,
  resourceHubCategoriesForOwner,
} from './resource-hub';

const TECHNICAL_TERMS = [
  'dataset',
  'rankings',
  'downloadable data',
  'cross-links',
  'methodology',
  'limitations',
  'data center',
];

function searchableCopy() {
  return RESOURCE_HUB_CATEGORIES.flatMap((category) => [
    category.title,
    category.description,
    ...category.links.map((link) => link.label),
  ]).join(' ').toLowerCase();
}

describe('Texas Resources hub configuration', () => {
  it('keeps every category visitor friendly and complete', () => {
    for (const category of RESOURCE_HUB_CATEGORIES) {
      expect(category.title.trim()).not.toBe('');
      expect(category.description.trim()).not.toBe('');
      expect(category.links.length).toBeGreaterThanOrEqual(4);
      expect(category.links.length).toBeLessThanOrEqual(8);
      expect(category.exploreHref.startsWith('/')).toBe(true);
      expect(category.icon).toBeDefined();
    }
  });

  it('contains all approved category names', () => {
    expect(RESOURCE_HUB_CATEGORIES.map((category) => category.title)).toEqual(expect.arrayContaining([
      'Home & Property',
      'Money & Taxes',
      'Texas Government',
      'Texas Elections',
      'Representatives',
      'Bills & Legislation',
      'Texas Politics',
      'Texas Laws',
      'Cities & Counties',
      'Moving to Texas',
      'Calculators & Tools',
      'Explore Texas',
    ]));
  });

  it('does not expose the rejected technical wording in category copy', () => {
    const copy = searchableCopy();
    for (const term of TECHNICAL_TERMS) expect(copy).not.toContain(term);
  });

  it('keeps the Keep TX Red and TexasDefined category split explicit', () => {
    const keepTxRed = resourceHubCategoriesForOwner('keeptxred').map((category) => category.title);
    const texasDefined = resourceHubCategoriesForOwner('texasdefined').map((category) => category.title);

    expect(keepTxRed).toEqual(expect.arrayContaining([
      'Texas Government',
      'Texas Elections',
      'Representatives',
      'Bills & Legislation',
      'Texas Politics',
      'Texas Laws',
    ]));
    expect(keepTxRed).not.toEqual(expect.arrayContaining([
      'Home & Property',
      'Moving to Texas',
      'Explore Texas',
    ]));

    expect(texasDefined).toEqual(expect.arrayContaining([
      'Home & Property',
      'Money & Taxes',
      'Cities & Counties',
      'Moving to Texas',
      'Explore Texas',
    ]));
    expect(texasDefined).not.toEqual(expect.arrayContaining([
      'Texas Government',
      'Texas Elections',
      'Bills & Legislation',
    ]));
  });

  it('provides the approved featured resources', () => {
    const titles = FEATURED_RESOURCES.map((resource) => resource.title);
    expect(titles).toEqual(expect.arrayContaining([
      'Property Tax Calculator',
      'Find My Representative',
      'Texas Bills',
      'Homestead Exemption Guide',
      'Cost of Living Calculator',
      'Mortgage Calculator',
    ]));
    expect(featuredResourcesForOwner('keeptxred').length).toBeGreaterThan(0);
    expect(featuredResourcesForOwner('texasdefined').length).toBeGreaterThan(0);
  });

  it('provides complete owner-aware Browse Texas links', () => {
    expect(BROWSE_RESOURCES.map((resource) => resource.label)).toEqual(expect.arrayContaining([
      'Counties',
      'Cities',
      'Representatives',
      'Bills',
      'Laws',
      'Elections',
      'Calculators',
      'Guides',
    ]));
    expect(browseResourcesForOwner('keeptxred').some((resource) => resource.label === 'Bills')).toBe(true);
    expect(browseResourcesForOwner('texasdefined').some((resource) => resource.label === 'Cities')).toBe(true);
  });

  it('includes the approved natural-language assistant examples', () => {
    expect(TEXAS_ASSISTANT_EXAMPLES).toEqual(expect.arrayContaining([
      'How much are property taxes in Katy?',
      'Who represents District 132?',
      'What laws changed this year?',
    ]));
  });
});
