import { describe, expect, it } from "vitest";
import { exploreDestinations } from "./all-destinations";
import { cavernOwnershipAccessAudit } from "./catalog.caverns-access";
import { majorSpringOwnershipAccessAudit } from "./catalog.major-springs-access";
import { privateNaturalLandmarkAccessAudit } from "./catalog.private-natural-landmarks-access";
import { privateCulturalLandmarkAccessAudit } from "./catalog.private-cultural-landmarks-access";
import {
  getOwnershipAccessAuditByDestination,
  getOwnershipAccessAuditByFamily,
  ownershipAccessAudit,
} from "./catalog.ownership-access-audit";

const expectedRecordCount =
  cavernOwnershipAccessAudit.length +
  majorSpringOwnershipAccessAudit.length +
  privateNaturalLandmarkAccessAudit.length +
  privateCulturalLandmarkAccessAudit.length;

const unifiedDestinationSlugs = new Set(
  exploreDestinations.map((destination) => destination.slug),
);

describe("unified ownership and access audit", () => {
  it("includes every source audit record exactly once", () => {
    expect(ownershipAccessAudit).toHaveLength(expectedRecordCount);
    expect(new Set(ownershipAccessAudit.map((record) => record.sourceRecordId)).size).toBe(
      ownershipAccessAudit.length,
    );
    expect(new Set(ownershipAccessAudit.map((record) => record.destinationSlug)).size).toBe(
      ownershipAccessAudit.length,
    );
  });

  it("resolves every audit record to a unified destination", () => {
    for (const record of ownershipAccessAudit) {
      expect(unifiedDestinationSlugs.has(record.destinationSlug)).toBe(true);
      expect(getOwnershipAccessAuditByDestination(record.destinationSlug)).toEqual(record);
    }
  });

  it("preserves complete official-source verification metadata", () => {
    for (const record of ownershipAccessAudit) {
      expect(record.ownershipClassification.trim().length).toBeGreaterThan(0);
      expect(record.ownershipLabel.trim().length).toBeGreaterThan(0);
      expect(record.operator.trim().length).toBeGreaterThan(0);
      expect(record.accessModel.trim().length).toBeGreaterThan(0);
      expect(record.accessSummary.trim().length).toBeGreaterThan(0);
      expect(record.sourceUrl).toMatch(/^https:\/\//);
      expect(record.sourceName.trim().length).toBeGreaterThan(0);
      expect(record.verificationStatus).toBe("official-source-reviewed");
      expect(record.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.publicAccess).toBe(true);
    }
  });

  it("returns complete records for each catalog family", () => {
    expect(getOwnershipAccessAuditByFamily("commercial-cavern")).toHaveLength(
      cavernOwnershipAccessAudit.length,
    );
    expect(getOwnershipAccessAuditByFamily("major-spring")).toHaveLength(
      majorSpringOwnershipAccessAudit.length,
    );
    expect(getOwnershipAccessAuditByFamily("private-natural-landmark")).toHaveLength(
      privateNaturalLandmarkAccessAudit.length,
    );
    expect(getOwnershipAccessAuditByFamily("private-cultural-landmark")).toHaveLength(
      privateCulturalLandmarkAccessAudit.length,
    );
  });

  it("distinguishes controlled, free, guided, and overnight access", () => {
    const cadillacRanch = getOwnershipAccessAuditByDestination("cadillac-ranch");
    const newmansCastle = getOwnershipAccessAuditByDestination("newmans-castle");
    const westcave = getOwnershipAccessAuditByDestination("westcave-preserve");
    const naturalBridge = getOwnershipAccessAuditByDestination("natural-bridge-caverns");

    expect(cadillacRanch).toMatchObject({
      admissionRequired: false,
      reservationsRequiredOrRecommended: false,
      guidedAccess: false,
      overnightAccess: false,
    });
    expect(newmansCastle).toMatchObject({
      admissionRequired: true,
      reservationsRequiredOrRecommended: true,
      guidedAccess: true,
      overnightAccess: true,
    });
    expect(westcave).toMatchObject({
      admissionRequired: true,
      reservationsRequiredOrRecommended: true,
      guidedAccess: true,
      overnightAccess: false,
    });
    expect(naturalBridge).toMatchObject({
      admissionRequired: true,
      reservationsRequiredOrRecommended: true,
      guidedAccess: true,
      overnightAccess: null,
    });
  });

  it("returns null for an unknown destination", () => {
    expect(getOwnershipAccessAuditByDestination("not-a-real-destination")).toBeNull();
  });
});
