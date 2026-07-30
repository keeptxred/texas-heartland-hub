import { describe, expect, it } from "vitest";
import { privateNaturalLandmarkCatalog } from "./catalog.private-natural-landmarks";
import {
  getPrivateNaturalLandmarkDestination,
  privateNaturalLandmarkDestinations,
} from "./catalog.private-natural-landmarks.entities";

describe("private natural landmark destination mapping", () => {
  it("creates one destination for every catalog record", () => {
    expect(privateNaturalLandmarkDestinations).toHaveLength(
      privateNaturalLandmarkCatalog.length,
    );

    expect(
      privateNaturalLandmarkDestinations.map((destination) => destination.slug),
    ).toEqual(privateNaturalLandmarkCatalog.map((landmark) => landmark.slug));
  });

  it("produces unique destination ids and slugs", () => {
    const ids = privateNaturalLandmarkDestinations.map((destination) => destination.id);
    const slugs = privateNaturalLandmarkDestinations.map((destination) => destination.slug);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("resolves every destination by canonical slug", () => {
    for (const landmark of privateNaturalLandmarkCatalog) {
      const destination = getPrivateNaturalLandmarkDestination(landmark.slug);

      expect(destination).not.toBeNull();
      expect(destination?.name).toBe(landmark.name);
      expect(destination?.entityType).toBe("natural_area");
      expect(destination?.officialUrl).toBe(landmark.officialUrl);
      expect(destination?.sourceUrl).toBe(landmark.officialUrl);
      expect(destination?.sourceName).toBe(landmark.sourceName);
      expect(destination?.feeRequired).toBe(landmark.admissionRequired);
    }
  });

  it("preserves ownership and access metadata", () => {
    for (const landmark of privateNaturalLandmarkCatalog) {
      const destination = getPrivateNaturalLandmarkDestination(landmark.slug);

      expect(destination?.profile).toMatchObject({
        ownership: landmark.ownershipLabel,
        ownershipClassification: landmark.ownershipClassification,
        operator: landmark.operator,
        accessType: landmark.accessModel,
      });
      expect(destination?.regulations).toMatchObject({
        swimmingStatus: landmark.swimmingStatus,
        overnightAccess: landmark.overnightAccess,
        accessModel: landmark.accessModel,
      });
      expect(destination?.fees).toMatchObject({
        admissionRequired: landmark.admissionRequired,
        reservationsRequired: landmark.reservationsRequired,
      });
    }
  });

  it("keeps Westcave guided-only and Chalk Bluff open for swimming and overnight stays", () => {
    const westcave = getPrivateNaturalLandmarkDestination("westcave-preserve");
    const chalkBluff = getPrivateNaturalLandmarkDestination("chalk-bluff-river-resort");

    expect(westcave?.regulations).toMatchObject({
      swimmingStatus: "not-permitted",
      overnightAccess: false,
      accessModel: "reservation-guided-access",
    });
    expect(westcave?.fees).toMatchObject({ reservationsRequired: true });

    expect(chalkBluff?.regulations).toMatchObject({
      swimmingStatus: "permitted",
      overnightAccess: true,
      accessModel: "ticketed-day-use-and-overnight-access",
    });
  });

  it("returns null for an unknown landmark slug", () => {
    expect(getPrivateNaturalLandmarkDestination("unknown-private-landmark")).toBeNull();
  });
});
