import { describe, expect, it } from "vitest";
import { privateCulturalLandmarkCatalog } from "./catalog.private-cultural-landmarks";
import {
  getPrivateCulturalLandmarkAccessAudit,
  getPrivateCulturalLandmarkAccessAuditByDestination,
  privateCulturalLandmarkAccessAudit,
} from "./catalog.private-cultural-landmarks-access";

describe("private cultural landmark access audit", () => {
  it("covers every catalog landmark exactly once", () => {
    expect(privateCulturalLandmarkAccessAudit).toHaveLength(
      privateCulturalLandmarkCatalog.length,
    );
    expect(new Set(privateCulturalLandmarkAccessAudit.map(({ landmarkId }) => landmarkId)).size).toBe(
      privateCulturalLandmarkAccessAudit.length,
    );
    expect(new Set(privateCulturalLandmarkAccessAudit.map(({ landmarkSlug }) => landmarkSlug)).size).toBe(
      privateCulturalLandmarkAccessAudit.length,
    );
  });

  it.each(privateCulturalLandmarkCatalog)("preserves access metadata for $name", (landmark) => {
    const audit = getPrivateCulturalLandmarkAccessAudit(landmark.slug);

    expect(audit).toMatchObject({
      landmarkId: landmark.id,
      landmarkSlug: landmark.slug,
      destinationSlug: landmark.slug,
      ownershipClassification: landmark.ownershipClassification,
      ownershipLabel: landmark.ownershipLabel,
      operator: landmark.operator,
      publicAccess: landmark.publicAccess,
      accessModel: landmark.accessModel,
      admissionRequired: landmark.admissionRequired,
      reservationsRequired: landmark.reservationsRequired,
      guidedTourAvailable: landmark.guidedTourAvailable,
      overnightAccess: landmark.overnightAccess,
      sourceUrl: landmark.officialUrl,
      sourceName: landmark.sourceName,
      verificationStatus: landmark.verificationStatus,
      lastReviewed: landmark.lastReviewed,
    });
    expect(audit?.accessSummary.trim().length).toBeGreaterThan(0);
    expect(audit?.culturalSignificance.trim().length).toBeGreaterThan(0);
    expect(getPrivateCulturalLandmarkAccessAuditByDestination(landmark.slug)).toEqual(audit);
  });

  it("distinguishes free open art access from reservation-only tours", () => {
    expect(getPrivateCulturalLandmarkAccessAudit("cadillac-ranch")).toMatchObject({
      accessModel: "free-open-public-access",
      admissionRequired: false,
      reservationsRequired: false,
      guidedTourAvailable: false,
      overnightAccess: false,
    });
    expect(getPrivateCulturalLandmarkAccessAudit("newmans-castle")).toMatchObject({
      accessModel: "reservation-ticketed-tour-access",
      admissionRequired: true,
      reservationsRequired: true,
      guidedTourAvailable: true,
      overnightAccess: true,
    });
  });

  it("returns null for unknown landmark and destination slugs", () => {
    expect(getPrivateCulturalLandmarkAccessAudit("unknown-cultural-landmark")).toBeNull();
    expect(
      getPrivateCulturalLandmarkAccessAuditByDestination("unknown-cultural-landmark"),
    ).toBeNull();
  });
});
