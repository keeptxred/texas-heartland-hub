import { describe, expect, it } from "vitest";
import { privateNaturalLandmarkCatalog } from "./catalog.private-natural-landmarks";
import {
  auditPrivateNaturalLandmarkNormalization,
  privateNaturalLandmarkNormalizationAudit,
} from "./catalog.private-natural-landmarks-normalization";

describe("private natural landmark normalization audit", () => {
  it("passes for the complete private natural landmark catalog", () => {
    expect(privateNaturalLandmarkNormalizationAudit.passed).toBe(true);
    expect(privateNaturalLandmarkNormalizationAudit.issues).toEqual([]);
    expect(privateNaturalLandmarkNormalizationAudit.landmarkCount).toBe(
      privateNaturalLandmarkCatalog.length,
    );
    expect(privateNaturalLandmarkNormalizationAudit.entityCount).toBe(
      privateNaturalLandmarkCatalog.length,
    );
    expect(privateNaturalLandmarkNormalizationAudit.accessAuditCount).toBe(
      privateNaturalLandmarkCatalog.length,
    );
    expect(privateNaturalLandmarkNormalizationAudit.resolvedUnifiedDestinationCount).toBe(
      privateNaturalLandmarkCatalog.length,
    );
  });

  it("is deterministic across repeated audits", () => {
    expect(auditPrivateNaturalLandmarkNormalization()).toEqual(
      privateNaturalLandmarkNormalizationAudit,
    );
  });

  it("covers Westcave, Chalk Bluff, and Bamberger Ranch", () => {
    expect(privateNaturalLandmarkCatalog.map((landmark) => landmark.slug)).toEqual([
      "westcave-preserve",
      "chalk-bluff-river-resort",
      "selah-bamberger-ranch-preserve",
    ]);
  });
});
