import { describe, expect, it } from "vitest";
import { exploreDestinations } from "./all-destinations";
import { privateNaturalLandmarkCatalog } from "./catalog.private-natural-landmarks";

const expectedSlugs = privateNaturalLandmarkCatalog.map((landmark) => landmark.slug);

function getUnifiedDestination(slug: string) {
  return exploreDestinations.find((destination) => destination.slug === slug);
}

describe("private natural landmark unified catalog integration", () => {
  it("publishes every private natural landmark exactly once", () => {
    for (const slug of expectedSlugs) {
      const matches = exploreDestinations.filter((destination) => destination.slug === slug);
      expect(matches).toHaveLength(1);
    }
  });

  it("preserves normalized private-access metadata", () => {
    for (const landmark of privateNaturalLandmarkCatalog) {
      const destination = getUnifiedDestination(landmark.slug);

      expect(destination).toBeDefined();
      expect(destination?.entityType).toBe("natural_area");
      expect(destination?.officialUrl).toBe(landmark.officialUrl);
      expect(destination?.sourceUrl).toBe(landmark.officialUrl);
      expect(destination?.sourceName).toBe(landmark.sourceName);
      expect(destination?.profile).toMatchObject({
        ownershipClassification: landmark.ownershipClassification,
        operator: landmark.operator,
        accessType: landmark.accessModel,
        visitorAccess: {
          publicAccess: landmark.publicAccess,
          reservationsRequired: landmark.reservationsRequired,
          swimmingStatus: landmark.swimmingStatus,
          overnightAccess: landmark.overnightAccess,
        },
      });
      expect(destination?.regulations).toMatchObject({
        swimmingStatus: landmark.swimmingStatus,
        overnightAccess: landmark.overnightAccess,
        accessModel: landmark.accessModel,
      });
      expect(destination?.categories).toContain("private natural landmark");
      expect(destination?.tags).toContain("private natural landmark");
    }
  });

  it("keeps Westcave reservation-guided and non-swimming", () => {
    const westcave = getUnifiedDestination("westcave-preserve");

    expect(westcave).toBeDefined();
    expect(westcave?.profile).toMatchObject({
      ownershipClassification: "private-nonprofit-preserve",
      accessType: "reservation-guided-access",
      visitorAccess: {
        reservationsRequired: true,
        swimmingStatus: "not-permitted",
        overnightAccess: false,
      },
    });
  });

  it("keeps Chalk Bluff open for swimming and overnight stays", () => {
    const chalkBluff = getUnifiedDestination("chalk-bluff-river-resort");

    expect(chalkBluff).toBeDefined();
    expect(chalkBluff?.profile).toMatchObject({
      ownershipClassification: "private-family-operated",
      accessType: "ticketed-day-use-and-overnight-access",
      visitorAccess: {
        swimmingStatus: "permitted",
        overnightAccess: true,
      },
    });
    expect(chalkBluff?.activities).toContain("swimming");
    expect(chalkBluff?.activities).toContain("camping");
    expect(chalkBluff?.amenities).toEqual(expect.arrayContaining(["tent camping", "rv sites"]));
  });

  it("keeps Bamberger Ranch limited to scheduled conservation programs", () => {
    const bamberger = getUnifiedDestination("selah-bamberger-ranch-preserve");

    expect(bamberger).toBeDefined();
    expect(bamberger?.profile).toMatchObject({
      ownershipClassification: "private-nonprofit-preserve",
      accessType: "scheduled-public-program-access",
      visitorAccess: {
        reservationsRequired: true,
        swimmingStatus: "not-permitted",
        overnightAccess: false,
      },
    });
    expect(bamberger?.activities).toContain("land stewardship education");
    expect(bamberger?.tags).toContain("private natural landmark");
  });

  it("keeps unified destination ids and slugs duplicate-free", () => {
    const ids = exploreDestinations.map((destination) => destination.id);
    const slugs = exploreDestinations.map((destination) => destination.slug);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});