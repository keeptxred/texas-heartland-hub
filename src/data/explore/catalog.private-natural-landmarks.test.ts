import { describe, expect, it } from "vitest";
import {
  getPrivateNaturalLandmarkBySlug,
  privateNaturalLandmarkCatalog,
} from "./catalog.private-natural-landmarks";

const expectedSlugs = [
  "westcave-preserve",
  "chalk-bluff-river-resort",
] as const;

describe("private natural landmarks catalog", () => {
  it("publishes the initial verified landmark set exactly once", () => {
    expect(privateNaturalLandmarkCatalog.map((landmark) => landmark.slug)).toEqual(
      expectedSlugs,
    );
    expect(new Set(privateNaturalLandmarkCatalog.map((landmark) => landmark.id)).size).toBe(
      privateNaturalLandmarkCatalog.length,
    );
    expect(new Set(privateNaturalLandmarkCatalog.map((landmark) => landmark.slug)).size).toBe(
      privateNaturalLandmarkCatalog.length,
    );
    expect(new Set(privateNaturalLandmarkCatalog.map((landmark) => landmark.officialUrl)).size).toBe(
      privateNaturalLandmarkCatalog.length,
    );
  });

  it.each(expectedSlugs)("resolves %s by canonical slug", (slug) => {
    const landmark = getPrivateNaturalLandmarkBySlug(slug);

    expect(landmark).not.toBeNull();
    expect(landmark?.slug).toBe(slug);
    expect(landmark?.publicAccess).toBe(true);
    expect(landmark?.admissionRequired).toBe(true);
    expect(landmark?.officialUrl).toMatch(/^https:\/\//);
    expect(landmark?.verificationStatus).toBe("official-source-reviewed");
    expect(landmark?.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("preserves Westcave's guided-only conservation access", () => {
    const westcave = getPrivateNaturalLandmarkBySlug("westcave-preserve");

    expect(westcave?.ownershipClassification).toBe("private-nonprofit-preserve");
    expect(westcave?.accessModel).toBe("reservation-guided-access");
    expect(westcave?.reservationsRequired).toBe(true);
    expect(westcave?.swimmingStatus).toBe("not-permitted");
    expect(westcave?.overnightAccess).toBe(false);
  });

  it("preserves Chalk Bluff's public river recreation and overnight access", () => {
    const chalkBluff = getPrivateNaturalLandmarkBySlug("chalk-bluff-river-resort");

    expect(chalkBluff?.ownershipClassification).toBe("private-family-operated");
    expect(chalkBluff?.accessModel).toBe("ticketed-day-use-and-overnight-access");
    expect(chalkBluff?.swimmingStatus).toBe("permitted");
    expect(chalkBluff?.overnightAccess).toBe(true);
  });

  it("keeps required visitor and conservation metadata complete", () => {
    for (const landmark of privateNaturalLandmarkCatalog) {
      expect(landmark.summary.trim().length).toBeGreaterThan(0);
      expect(landmark.accessNotes.trim().length).toBeGreaterThan(0);
      expect(landmark.conservationNotes.trim().length).toBeGreaterThan(0);
      expect(landmark.activities.length).toBeGreaterThan(0);
      expect(landmark.amenities.length).toBeGreaterThan(0);
      expect(landmark.categories).toContain("Private natural landmark");
      expect(landmark.tags.length).toBeGreaterThan(0);
      expect(landmark.latitude).toBeGreaterThanOrEqual(25);
      expect(landmark.latitude).toBeLessThanOrEqual(37);
      expect(landmark.longitude).toBeGreaterThanOrEqual(-107);
      expect(landmark.longitude).toBeLessThanOrEqual(-93);
    }
  });
});
