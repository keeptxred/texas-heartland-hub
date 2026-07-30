import { describe, expect, it } from "vitest";
import {
  getPrivateNaturalLandmarkAccessAudit,
  getPrivateNaturalLandmarkAccessAuditByDestination,
  privateNaturalLandmarkAccessAudit,
} from "./catalog.private-natural-landmarks-access";
import { privateNaturalLandmarkCatalog } from "./catalog.private-natural-landmarks";

describe("private natural landmark ownership and access audit", () => {
  it("covers every landmark record exactly once", () => {
    expect(privateNaturalLandmarkAccessAudit).toHaveLength(
      privateNaturalLandmarkCatalog.length,
    );
    expect(
      new Set(privateNaturalLandmarkAccessAudit.map((record) => record.landmarkId)).size,
    ).toBe(privateNaturalLandmarkAccessAudit.length);
    expect(
      new Set(privateNaturalLandmarkAccessAudit.map((record) => record.landmarkSlug)).size,
    ).toBe(privateNaturalLandmarkAccessAudit.length);
  });

  it("matches catalog ownership, access, and official-source metadata", () => {
    for (const landmark of privateNaturalLandmarkCatalog) {
      const audit = getPrivateNaturalLandmarkAccessAudit(landmark.slug);

      expect(audit).not.toBeNull();
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
        overnightAccess: landmark.overnightAccess,
        sourceUrl: landmark.officialUrl,
        sourceName: landmark.sourceName,
        verificationStatus: "official-source-reviewed",
      });
      expect(audit?.swimmingPermitted).toBe(landmark.swimmingStatus === "permitted");
      expect(audit?.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(audit?.accessSummary.trim().length).toBeGreaterThan(0);
      expect(audit?.conservationSummary.trim().length).toBeGreaterThan(0);
      expect(getPrivateNaturalLandmarkAccessAuditByDestination(landmark.slug)).toEqual(audit);
    }
  });

  it("preserves Westcave's guided preserve restrictions", () => {
    const westcave = getPrivateNaturalLandmarkAccessAudit("westcave-preserve");

    expect(westcave).toMatchObject({
      ownershipClassification: "private-nonprofit-preserve",
      accessModel: "reservation-guided-access",
      admissionRequired: true,
      reservationsRequired: true,
      swimmingPermitted: false,
      overnightAccess: false,
    });
  });

  it("preserves Chalk Bluff's day-use and overnight recreation access", () => {
    const chalkBluff = getPrivateNaturalLandmarkAccessAudit(
      "chalk-bluff-river-resort",
    );

    expect(chalkBluff).toMatchObject({
      ownershipClassification: "private-family-operated",
      accessModel: "ticketed-day-use-and-overnight-access",
      admissionRequired: true,
      reservationsRequired: false,
      swimmingPermitted: true,
      overnightAccess: true,
    });
  });

  it("returns null for unknown slugs", () => {
    expect(getPrivateNaturalLandmarkAccessAudit("unknown-landmark")).toBeNull();
    expect(
      getPrivateNaturalLandmarkAccessAuditByDestination("unknown-destination"),
    ).toBeNull();
  });
});
