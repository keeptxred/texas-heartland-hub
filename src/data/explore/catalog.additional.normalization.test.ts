import { describe, expect, it } from "vitest";
import { destinations } from "./catalog.additional";

const refugeNames = [
  "Jocelyn Nungaray National Wildlife Refuge",
  "McFaddin National Wildlife Refuge",
  "Texas Point National Wildlife Refuge",
  "Moody National Wildlife Refuge",
  "Brazoria National Wildlife Refuge",
  "San Bernard National Wildlife Refuge",
  "Big Boggy National Wildlife Refuge",
  "Matagorda Island National Wildlife Refuge",
  "Laguna Atascosa National Wildlife Refuge",
  "Lower Rio Grande Valley National Wildlife Refuge",
  "Santa Ana National Wildlife Refuge",
  "Aransas National Wildlife Refuge",
  "Hagerman National Wildlife Refuge",
  "Attwater Prairie Chicken National Wildlife Refuge",
  "Balcones Canyonlands National Wildlife Refuge",
  "Caddo Lake National Wildlife Refuge",
  "Muleshoe National Wildlife Refuge",
  "Buffalo Lake National Wildlife Refuge",
] as const;

const getRefuge = (name: (typeof refugeNames)[number]) => {
  const matches = destinations.filter((destination) => destination.name === name);
  expect(matches, `${name} must exist exactly once`).toHaveLength(1);
  return matches[0];
};

const expectNormalizedTerms = (terms: string[]) => {
  expect(new Set(terms).size).toBe(terms.length);

  for (const term of terms) {
    expect(term).toBe(term.trim());
    expect(term.length).toBeGreaterThan(0);
    expect(term).toBe(term.toLowerCase());
  }
};

describe("Explore Texas wildlife refuge taxonomy and final normalization", () => {
  it.each(refugeNames)("keeps normalized taxonomy for %s", (name) => {
    const refuge = getRefuge(name);

    expect(refuge.entityType).toBe("wildlife_area");
    expect(refuge.profile.designation).toBe("National Wildlife Refuge");
    expect(refuge.profile.collection).toBe("National Wildlife Refuges in Texas");
    expect(refuge.profile.managingOrganization).toBe("U.S. Fish and Wildlife Service");

    expect(refuge.categories).toEqual(
      expect.arrayContaining([
        "national wildlife refuge",
        "u.s. fish and wildlife service",
        "wildlife",
        "birding",
      ]),
    );
    expect(refuge.tags).toEqual(expect.arrayContaining(["migratory birds", "wildlife refuge"]));

    expectNormalizedTerms(refuge.categories);
    expectNormalizedTerms(refuge.tags);
  });

  it.each(refugeNames)("uses the official FWS source for %s", (name) => {
    const refuge = getRefuge(name);

    expect(refuge.sourceName).toBe("U.S. Fish and Wildlife Service");
    expect(refuge.sourceUrl).toBe(refuge.officialUrl);
    expect(refuge.officialUrl).toMatch(/^https:\/\/www\.fws\.gov\/refuge\//);
    expect(refuge.officialUrl).not.toMatch(/[?#]$/);
  });

  it.each(refugeNames)("keeps reviewed visitor flags for %s", (name) => {
    const refuge = getRefuge(name);

    expect(typeof refuge.isFamilyFriendly).toBe("boolean");
    expect(typeof refuge.isPetFriendly).toBe("boolean");
    expect([true, false, null]).toContain(refuge.isAccessible);
    expect(refuge.feeRequired).toBe(false);
    expect(refuge.isPetFriendly).toBe(false);
  });

  it("keeps closed and limited-access refuges from receiving misleading visitor fields", () => {
    const moody = getRefuge("Moody National Wildlife Refuge");
    expect(moody.profile.publicAccess).toBe(false);
    expect(moody.isFamilyFriendly).toBe(false);
    expect(moody.isAccessible).toBe(false);
    expect(moody.activities).toEqual([]);
    expect(moody.amenities).toEqual([]);

    const bigBoggy = getRefuge("Big Boggy National Wildlife Refuge");
    expect(bigBoggy.profile.accessNotes).toMatch(/not open for general public use/i);
    expect(bigBoggy.amenities).not.toEqual(
      expect.arrayContaining(["visitor center", "restrooms", "trails"]),
    );
  });

  it("contains no duplicate refuge names, official URLs, category values, or tag values", () => {
    const refuges = refugeNames.map(getRefuge);

    expect(new Set(refuges.map((refuge) => refuge.name)).size).toBe(refuges.length);
    expect(new Set(refuges.map((refuge) => refuge.officialUrl)).size).toBe(refuges.length);

    for (const refuge of refuges) {
      expect(new Set(refuge.categories).size).toBe(refuge.categories.length);
      expect(new Set(refuge.tags).size).toBe(refuge.tags.length);
      expect(refuge.profile.parentUnit.trim().length).toBeGreaterThan(0);
      expect(refuge.region.trim().length).toBeGreaterThan(0);
    }
  });
});
