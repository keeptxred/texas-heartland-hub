import { describe, expect, it } from "vitest";
import { exploreDestinations } from "./all-destinations";
import { privateCulturalLandmarkCatalog } from "./catalog.private-cultural-landmarks";

function getUnifiedDestination(slug: string) {
  return exploreDestinations.find((destination) => destination.slug === slug);
}

describe("private cultural landmark unified catalog integration", () => {
  it("publishes every private cultural landmark exactly once", () => {
    for (const landmark of privateCulturalLandmarkCatalog) {
      const matches = exploreDestinations.filter(
        (destination) => destination.slug === landmark.slug,
      );

      expect(matches).toHaveLength(1);
    }
  });

  it("preserves normalized ownership and visitor-access metadata", () => {
    for (const landmark of privateCulturalLandmarkCatalog) {
      const destination = getUnifiedDestination(landmark.slug);

      expect(destination).toBeDefined();
      expect(destination?.entityType).toBe("historic_site");
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
          guidedTourAvailable: landmark.guidedTourAvailable,
          overnightAccess: landmark.overnightAccess,
        },
      });
      expect(destination?.fees).toMatchObject({
        admissionRequired: landmark.admissionRequired,
        reservationsRequired: landmark.reservationsRequired,
      });
      expect(destination?.regulations).toMatchObject({
        accessModel: landmark.accessModel,
        guidedTourAvailable: landmark.guidedTourAvailable,
        overnightAccess: landmark.overnightAccess,
      });
      expect(destination?.categories).toContain("private cultural landmark");
      expect(destination?.tags).toContain("private cultural landmark");
    }
  });

  it("keeps Cadillac Ranch free and open without reservations", () => {
    const cadillacRanch = getUnifiedDestination("cadillac-ranch");

    expect(cadillacRanch).toBeDefined();
    expect(cadillacRanch?.feeRequired).toBe(false);
    expect(cadillacRanch?.profile).toMatchObject({
      ownershipClassification: "private-land-public-art",
      accessType: "free-open-public-access",
      visitorAccess: {
        reservationsRequired: false,
        guidedTourAvailable: false,
        overnightAccess: false,
      },
    });
    expect(cadillacRanch?.activities).toContain("photography");
    expect(cadillacRanch?.tags).toContain("route 66");
  });

  it("keeps Newman's Castle reservation-based with tours and overnight access", () => {
    const newmansCastle = getUnifiedDestination("newmans-castle");

    expect(newmansCastle).toBeDefined();
    expect(newmansCastle?.feeRequired).toBe(true);
    expect(newmansCastle?.profile).toMatchObject({
      ownershipClassification: "private-family-operated-attraction",
      accessType: "reservation-ticketed-tour-access",
      visitorAccess: {
        reservationsRequired: true,
        guidedTourAvailable: true,
        overnightAccess: true,
      },
    });
    expect(newmansCastle?.activities).toContain("photography");
    expect(newmansCastle?.activities).toContain("special events");
  });

  it("keeps unified ids and slugs duplicate-free after cultural integration", () => {
    const ids = exploreDestinations.map((destination) => destination.id);
    const slugs = exploreDestinations.map((destination) => destination.slug);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
