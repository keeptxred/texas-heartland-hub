import { describe, expect, it } from "vitest";
import { ownershipAccessAudit } from "./catalog.ownership-access-audit";
import {
  buildOwnershipAccessAuditSummary,
  ownershipAccessAuditSummary,
} from "./catalog.ownership-access-summary";

describe("ownership and access audit summary", () => {
  it("summarizes every unified audit record", () => {
    expect(ownershipAccessAuditSummary.totalRecords).toBe(ownershipAccessAudit.length);
    expect(ownershipAccessAuditSummary.publicAccessRecords).toBe(
      ownershipAccessAudit.length,
    );
    expect(ownershipAccessAuditSummary.officialSourceReviewedRecords).toBe(
      ownershipAccessAudit.length,
    );
  });

  it("keeps paid and free access mutually exhaustive", () => {
    expect(
      ownershipAccessAuditSummary.admissionRequiredRecords +
        ownershipAccessAuditSummary.freeAccessRecords,
    ).toBe(ownershipAccessAuditSummary.totalRecords);
  });

  it("reports every supported catalog family", () => {
    expect(ownershipAccessAuditSummary.recordsByFamily["commercial-cavern"]).toBeGreaterThan(0);
    expect(ownershipAccessAuditSummary.recordsByFamily["major-spring"]).toBeGreaterThan(0);
    expect(
      ownershipAccessAuditSummary.recordsByFamily["private-natural-landmark"],
    ).toBeGreaterThan(0);
    expect(
      ownershipAccessAuditSummary.recordsByFamily["private-cultural-landmark"],
    ).toBeGreaterThan(0);

    expect(
      Object.values(ownershipAccessAuditSummary.recordsByFamily).reduce(
        (sum, count) => sum + count,
        0,
      ),
    ).toBe(ownershipAccessAuditSummary.totalRecords);
  });

  it("retains meaningful access distinctions", () => {
    expect(ownershipAccessAuditSummary.guidedAccessRecords).toBeGreaterThan(0);
    expect(ownershipAccessAuditSummary.reservationSensitiveRecords).toBeGreaterThan(0);
    expect(ownershipAccessAuditSummary.overnightAccessRecords).toBeGreaterThan(0);
    expect(ownershipAccessAuditSummary.freeAccessRecords).toBeGreaterThan(0);
    expect(
      ownershipAccessAuditSummary.recordsByAccessModel["free-open-public-access"],
    ).toBeGreaterThan(0);
    expect(
      ownershipAccessAuditSummary.recordsByAccessModel["ticketed-guided-public-access"],
    ).toBeGreaterThan(0);
  });

  it("builds an empty but structurally complete summary", () => {
    expect(buildOwnershipAccessAuditSummary([])).toEqual({
      totalRecords: 0,
      publicAccessRecords: 0,
      admissionRequiredRecords: 0,
      freeAccessRecords: 0,
      reservationSensitiveRecords: 0,
      guidedAccessRecords: 0,
      overnightAccessRecords: 0,
      officialSourceReviewedRecords: 0,
      recordsByFamily: {
        "commercial-cavern": 0,
        "major-spring": 0,
        "private-natural-landmark": 0,
        "private-cultural-landmark": 0,
      },
      recordsByOwnershipClassification: {},
      recordsByAccessModel: {},
    });
  });
});
