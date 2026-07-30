import { describe, expect, it } from "vitest";
import { majorSpringCatalog } from "./catalog.major-springs";
import {
  getMajorSpringNormalizationAudit,
  majorSpringNormalizationAudit,
  majorSpringNormalizationPassed,
} from "./catalog.major-springs-normalization";

describe("major spring normalization and deduplication audit", () => {
  it("covers every spring catalog record exactly once", () => {
    expect(majorSpringNormalizationAudit).toHaveLength(majorSpringCatalog.length);
    expect(
      new Set(majorSpringNormalizationAudit.map((record) => record.springId)).size,
    ).toBe(majorSpringNormalizationAudit.length);
    expect(
      new Set(majorSpringNormalizationAudit.map((record) => record.springSlug)).size,
    ).toBe(majorSpringNormalizationAudit.length);
  });

  it("resolves every spring to exactly one canonical unified destination", () => {
    for (const spring of majorSpringCatalog) {
      const audit = getMajorSpringNormalizationAudit(spring.slug);

      expect(audit).not.toBeNull();
      expect(audit?.destinationSlug).toBe(
        spring.existingDestinationSlug ?? spring.slug,
      );
      expect(audit?.destinationExists).toBe(true);
      expect(audit?.canonicalMappingValid).toBe(true);
      expect(audit?.duplicateDestinationCount).toBe(1);
    }
  });

  it("preserves valid coordinates and official source identity", () => {
    for (const audit of majorSpringNormalizationAudit) {
      expect(audit.coordinatesValid).toBe(true);
      expect(audit.officialSourcePreserved).toBe(true);
      expect(audit.duplicateOfficialUrlCount).toBeLessThanOrEqual(1);
    }
  });

  it("keeps spring categories and tags normalized", () => {
    for (const audit of majorSpringNormalizationAudit) {
      expect(audit.normalizedCategories).toBe(true);
      expect(audit.normalizedTags).toBe(true);
    }
  });

  it("keeps San Solomon enriched into Balmorhea without a duplicate destination", () => {
    const audit = getMajorSpringNormalizationAudit("san-solomon-springs");

    expect(audit).not.toBeNull();
    expect(audit?.destinationSlug).toBe("balmorhea-state-park");
    expect(audit?.duplicateDestinationCount).toBe(1);
    expect(audit?.canonicalMappingValid).toBe(true);
  });

  it("passes the complete spring normalization audit", () => {
    expect(majorSpringNormalizationPassed).toBe(true);
  });
});
