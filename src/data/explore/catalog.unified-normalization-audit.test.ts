import { describe, expect, it } from "vitest";
import type { ExploreEntity } from "@/types/explore/public";
import { exploreDestinations } from "./all-destinations";
import {
  buildUnifiedNormalizationAudit,
  unifiedNormalizationAudit,
} from "./catalog.unified-normalization-audit";

function destination(overrides: Partial<ExploreEntity>): ExploreEntity {
  return {
    id: "example-destination",
    entityType: "park",
    name: "Example Destination",
    slug: "example-destination",
    summary: "Example summary",
    city: "Austin",
    county: "Travis County",
    region: "Central Texas",
    latitude: 30.2672,
    longitude: -97.7431,
    heroImageUrl: null,
    heroImageAlt: "Example Destination",
    amenities: [],
    activities: [],
    isFamilyFriendly: true,
    isPetFriendly: false,
    isAccessible: false,
    feeRequired: false,
    alternateNames: [],
    description: "Example description",
    officialUrl: "https://example.com/destination",
    phone: null,
    email: null,
    address: null,
    profile: {},
    hours: null,
    fees: {},
    regulations: {},
    seasonalGuidance: {},
    categories: [],
    tags: [],
    sourceUrl: "https://example.com/destination",
    sourceName: "Example source",
    sourceUpdatedAt: "2026-07-26",
    updatedAt: "2026-07-26T00:00:00.000Z",
    observations: [],
    related: [],
    nearby: [],
    ...overrides,
  };
}

describe("unified normalization and deduplication audit", () => {
  it("keeps unified destination identifiers unique and canonical", () => {
    expect(unifiedNormalizationAudit.destinationCount).toBe(exploreDestinations.length);
    expect(unifiedNormalizationAudit.uniqueIdCount).toBe(exploreDestinations.length);
    expect(unifiedNormalizationAudit.uniqueSlugCount).toBe(exploreDestinations.length);
    expect(unifiedNormalizationAudit.canonicalSlugCount).toBe(exploreDestinations.length);
    expect(unifiedNormalizationAudit.duplicateIdGroups).toEqual([]);
    expect(unifiedNormalizationAudit.duplicateSlugGroups).toEqual([]);
    expect(unifiedNormalizationAudit.noncanonicalSlugIssues).toEqual([]);
    expect(unifiedNormalizationAudit.invalidCoordinatePairIssues).toEqual([]);
    expect(unifiedNormalizationAudit.errorCount).toBe(0);
    expect(unifiedNormalizationAudit.passed).toBe(true);
  });

  it("keeps every destination source-auditable", () => {
    expect(unifiedNormalizationAudit.sourcedDestinationCount).toBe(
      exploreDestinations.length,
    );
    expect(unifiedNormalizationAudit.missingSourceIssues).toEqual([]);
  });

  it("reports duplicate identifiers as hard errors", () => {
    const audit = buildUnifiedNormalizationAudit([
      destination({ id: "duplicate", slug: "first", name: "First" }),
      destination({
        id: "duplicate",
        slug: "second",
        name: "Second",
        officialUrl: "https://example.com/second",
        sourceUrl: "https://example.com/second",
        latitude: 31,
        longitude: -98,
      }),
    ]);

    expect(audit.duplicateIdGroups).toHaveLength(1);
    expect(audit.duplicateIdGroups[0]).toMatchObject({
      type: "duplicate-id",
      key: "duplicate",
      destinationSlugs: ["first", "second"],
      severity: "error",
    });
    expect(audit.passed).toBe(false);
  });

  it("reports normalized-name, URL, and coordinate collisions for review", () => {
    const audit = buildUnifiedNormalizationAudit([
      destination({ slug: "first", name: "Newman's Castle" }),
      destination({
        id: "second",
        slug: "second",
        name: "Newmans Castle",
        officialUrl: "https://example.com/destination/",
        sourceUrl: "https://example.com/destination/",
      }),
    ]);

    expect(audit.duplicateNormalizedNameGroups).toHaveLength(1);
    expect(audit.duplicateOfficialUrlGroups).toHaveLength(1);
    expect(audit.duplicateCoordinateGroups).toHaveLength(1);
    expect(audit.errorCount).toBe(0);
    expect(audit.reviewCount).toBe(3);
    expect(audit.passed).toBe(true);
  });

  it("rejects noncanonical slugs and incomplete coordinate pairs", () => {
    const audit = buildUnifiedNormalizationAudit([
      destination({ slug: "Not Canonical", longitude: null }),
    ]);

    expect(audit.noncanonicalSlugIssues).toHaveLength(1);
    expect(audit.invalidCoordinatePairIssues).toHaveLength(1);
    expect(audit.errorCount).toBe(2);
    expect(audit.passed).toBe(false);
  });

  it("reports missing source metadata without treating it as a slug failure", () => {
    const audit = buildUnifiedNormalizationAudit([
      destination({ sourceName: "", sourceUrl: null, officialUrl: null }),
    ]);

    expect(audit.missingSourceIssues).toHaveLength(1);
    expect(audit.missingSourceIssues[0].severity).toBe("review");
    expect(audit.errorCount).toBe(0);
    expect(audit.reviewCount).toBe(1);
    expect(audit.passed).toBe(true);
  });
});
