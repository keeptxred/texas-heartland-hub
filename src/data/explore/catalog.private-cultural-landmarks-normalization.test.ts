import { describe, expect, it } from "vitest";
import {
  auditPrivateCulturalLandmarkNormalization,
  privateCulturalLandmarkNormalizationAudit,
} from "./catalog.private-cultural-landmarks-normalization";

describe("private cultural landmark normalization audit", () => {
  it("passes for the complete Phase 5D foundation", () => {
    expect(privateCulturalLandmarkNormalizationAudit.passed).toBe(true);
    expect(privateCulturalLandmarkNormalizationAudit.issues).toEqual([]);
    expect(privateCulturalLandmarkNormalizationAudit.landmarkCount).toBe(2);
    expect(privateCulturalLandmarkNormalizationAudit.entityCount).toBe(2);
    expect(privateCulturalLandmarkNormalizationAudit.accessAuditCount).toBe(2);
    expect(privateCulturalLandmarkNormalizationAudit.collectionCount).toBe(4);
  });

  it("is deterministic when rerun", () => {
    expect(auditPrivateCulturalLandmarkNormalization()).toEqual(
      privateCulturalLandmarkNormalizationAudit,
    );
  });
});
