import { describe, expect, it } from "vitest";
import { privateCulturalLandmarkCatalog } from "./catalog.private-cultural-landmarks";
import {
  getPrivateCulturalLandmarkDestination,
  privateCulturalLandmarkDestinations,
} from "./catalog.private-cultural-landmarks.entities";

describe("private cultural landmark destination entities", () => {
  it("maps every cultural landmark exactly once", () => {
    expect(privateCulturalLandmarkDestinations).toHaveLength(
      privateCulturalLandmarkCatalog.length,
    );
    expect(new Set(privateCulturalLandmarkDestinations.map(({ id }) => id)).size).toBe(
      privateCulturalLandmarkDestinations.length,
    );
    expect(new Set(privateCulturalLandmarkDestinations.map(({ slug }) => slug)).size).toBe(
      privateCulturalLandmarkDestinations.length,
    );
  });

  it.each(privateCulturalLandmarkCatalog)("maps $name into the public entity contract", (landmark) => {
    const destination = getPrivateCulturalLandmarkDestination(landmark.slug);

    expect(destination).not.toBeNull();
    expect(destination).toMatchObject({
      id: landmark.id,
      slug: landmark.slug,
      name: landmark.name,
      entityType: "historic_site",
      officialUrl: landmark.officialUrl,
      sourceUrl: landmark.officialUrl,
      sourceName: landmark.sourceName,
      feeRequired: landmark.admissionRequired,
    });
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
    expect(destination?.tags).toContain("private cultural landmark");
  });

  it("preserves Cadillac Ranch as free participatory public art", () => {
    const destination = getPrivateCulturalLandmarkDestination("cadillac-ranch");

    expect(destination?.feeRequired).toBe(false);
    expect(destination?.profile).toMatchObject({
      ownershipClassification: "private-land-public-art",
      accessType: "free-open-public-access",
      visitorAccess: {
        admissionRequired: false,
        reservationsRequired: false,
        guidedTourAvailable: false,
        overnightAccess: false,
      },
    });
  });

  it("preserves Newman's Castle booking and overnight access", () => {
    const destination = getPrivateCulturalLandmarkDestination("newmans-castle");

    expect(destination?.feeRequired).toBe(true);
    expect(destination?.profile).toMatchObject({
      ownershipClassification: "private-family-operated-attraction",
      accessType: "reservation-ticketed-tour-access",
      visitorAccess: {
        admissionRequired: true,
        reservationsRequired: true,
        guidedTourAvailable: true,
        overnightAccess: true,
      },
    });
  });

  it("returns null for unknown cultural landmarks", () => {
    expect(getPrivateCulturalLandmarkDestination("unknown-cultural-landmark")).toBeNull();
  });
});
