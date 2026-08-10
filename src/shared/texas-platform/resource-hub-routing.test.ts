import { describe, expect, it } from 'vitest';
import {
  BROWSE_RESOURCES,
  FEATURED_RESOURCES,
  RESOURCE_HUB_CATEGORIES,
  browseResourcesForOwner,
  featuredResourcesForOwner,
  resourceHubCategoriesForOwner,
} from './resource-hub';

function expectValidInternalHref(href: string) {
  expect(href.startsWith('/')).toBe(true);
  expect(href).not.toContain(' ');
  expect(href).not.toContain('//');
}

describe('Texas resource hub routing', () => {
  it('uses valid internal destinations for every category and featured link', () => {
    for (const category of RESOURCE_HUB_CATEGORIES) {
      expectValidInternalHref(category.exploreHref);
      for (const link of category.links) expectValidInternalHref(link.href);
    }
    for (const resource of FEATURED_RESOURCES) expectValidInternalHref(resource.href);
    for (const resource of BROWSE_RESOURCES) expectValidInternalHref(resource.href);
  });

  it('does not contain duplicate category ids or browse destinations', () => {
    expect(new Set(RESOURCE_HUB_CATEGORIES.map((category) => category.id)).size)
      .toBe(RESOURCE_HUB_CATEGORIES.length);
    expect(new Set(BROWSE_RESOURCES.map((resource) => resource.href)).size)
      .toBe(BROWSE_RESOURCES.length);
  });

  it('keeps Keep TX Red focused on government and political resources', () => {
    const titles = resourceHubCategoriesForOwner('keeptxred').map((category) => category.title);
    expect(titles).toEqual(expect.arrayContaining([
      'Texas Government',
      'Texas Elections',
      'Representatives',
      'Bills & Legislation',
      'Texas Politics',
      'Texas Laws',
    ]));
    expect(titles).not.toEqual(expect.arrayContaining([
      'Home & Property',
      'Money & Taxes',
      'Moving to Texas',
      'Cities & Counties',
      'Explore Texas',
    ]));
  });

  it('keeps TexasDefined focused on Texas living resources', () => {
    const titles = resourceHubCategoriesForOwner('texasdefined').map((category) => category.title);
    expect(titles).toEqual(expect.arrayContaining([
      'Home & Property',
      'Money & Taxes',
      'Moving to Texas',
      'Cities & Counties',
      'Explore Texas',
    ]));
    expect(titles).not.toEqual(expect.arrayContaining([
      'Texas Government',
      'Texas Elections',
      'Texas Politics',
    ]));
  });

  it('returns only shared or owner-specific featured and browse resources', () => {
    for (const owner of ['keeptxred', 'texasdefined'] as const) {
      expect(featuredResourcesForOwner(owner).every((resource) => resource.owner === 'shared' || resource.owner === owner)).toBe(true);
      expect(browseResourcesForOwner(owner).every((resource) => resource.owner === 'shared' || resource.owner === owner)).toBe(true);
    }
  });
});
