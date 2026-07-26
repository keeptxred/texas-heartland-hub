import { describe, expect, it } from "vitest";
import {
  getPrivateCulturalLandmarkBySlug,
  privateCulturalLandmarkCatalog,
} from "./catalog.private-cultural-landmarks";

const expectedSlugs = ["cadillac-ranch", "newmans-castle"] as const;

describe("private cultural landmarks catalog", () => {
  it("publishes the initial verified cultural landmark set exactly once", () => {
    expect(privateCulturalLandmarkCatalog.map((landmark) => landmark.slug)).toEqual(
      expectedSlugs,
    );
    expect(new Set(privateCulturalLandmarkCatalog.map((landmark) => landmark.id)).size).toBe(
      privateCulturalLandmarkCatalog.length,
    );
    expect(new Set(privateCulturalLandmarkCatalog.map((landmark) => landmark.slug)).size).toBe(
      privateCulturalLandmarkCatalog.length,
    );
    expect(new Set(privateCulturalLandmarkCatalog.map((landmark) => landmark.officialUrl)).size).toBe(
      privateCulturalLandmarkCatalog.length,
    );
  });

  it.each(expectedSlugs)("resolves %s by canonical slug", (slug) => {
    const landmark = getPrivateCulturalLandmarkBySlug(slug);

    expect(landmark).not.toBeNull();
    expect(landmark?.slug).toBe(slug);
    expect(landmark?.publicAccess).toBe(true);
    expect(landmark?.officialUrl).toMatch(/^https:\/\//);
    expect(landmark?.verificationStatus).toBe("official-source-reviewed");
    expect(landmark?.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("preserves Cadillac Ranch's free public-art access", () => {
    const cadillacRanch = getPrivateCulturalLandmarkBySlug("cadillac-ranch");

    expect(cadillacRanch?.ownershipClassification).toBe("private-land-public-art");
    expect(cadillacRanch?.accessModel).toBe("free-open-public-access");
    expect(cadillacRanch?.admissionRequired).toBe(false);
    expect(cadillacRanch?.reservationsRequired).toBe(false);
    expect(cadillacRanch?.guidedTourAvailable).toBe(false);
    expect(cadillacRanch?.overnightAccess).toBe(false);
  });

  it("preserves Newman's Castle reservation-based visitor model", () => {
    const newmansCastle = getPrivateCulturalLandmarkBySlug("newmans-castle");

    expect(newmansCastle?.ownershipClassification).toBe(
      "private-family-operated-attraction",
    );
    expect(newmansCastle?.accessModel).toBe("reservation-ticketed-tour-access");
    expect(newmansCastle?.admissionRequired).toBe(true);
    expect(newmansCastle?.reservationsRequired).toBe(true);
    expect(newmansCastle?.guidedTourAvailable).toBe(true);
    expect(newmansCastle?.overnightAccess).toBe(true);
  });

  it("keeps cultural and access metadata complete", () => {
    for (const landmark of privateCulturalLandmarkCatalog) {
      expect(landmark.summary.trim().length).toBeGreaterThan(0);
      expect(landmark.accessNotes.trim().length).toBeGreaterThan(0);
      expect(landmark.culturalSignificance.trim().length).toBeGreaterThan(0);
      expect(landmark.activities.length).toBeGreaterThan(0);
      expect(landmark.amenities.length).toBeGreaterThan(0);
      expect(landmark.categories).toContain("Private cultural landmark");
      expect(landmark.tags.length).toBeGreaterThan(0);
      expect(landmark.latitude).toBeGreaterThanOrEqual(25);
      expect(landmark.latitude).toBeLessThanOrEqual(37);
      expect(landmark.longitude).toBeGreaterThanOrEqual(-107);
      expect(landmark.longitude).toBeLessThanOrEqual(-93);
    }
  });
});
