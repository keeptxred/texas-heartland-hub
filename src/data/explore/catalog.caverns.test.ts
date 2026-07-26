import { describe, expect, it } from "vitest";
import { getCavernSitemapEntries } from "@/lib/explore/cavern-sitemap";
import { BASE_URL, renderUrlset } from "@/lib/sitemap-shared";
import { exploreDestinations } from "./all-destinations";
import {
  commercialCavernCatalog,
  type CommercialCavernCatalogRecord,
} from "./catalog.caverns";
import { validateCommercialCavernCatalog } from "./catalog.caverns.validation";

function cloneRecord(
  record: CommercialCavernCatalogRecord,
  overrides: Partial<CommercialCavernCatalogRecord> = {},
): CommercialCavernCatalogRecord {
  return {
    ...record,
    activities: [...record.activities],
    amenities: [...record.amenities],
    categories: [...record.categories],
    tags: [...record.tags],
    ...overrides,
  };
}

const commercialCavernSlugs = new Set(commercialCavernCatalog.map((cavern) => cavern.slug));

function getUnifiedCommercialCaverns() {
  return exploreDestinations.filter((destination) => commercialCavernSlugs.has(destination.slug));
}

describe("commercial cavern catalog", () => {
  it("passes production catalog validation", () => {
    expect(() => validateCommercialCavernCatalog(commercialCavernCatalog)).not.toThrow();
  });

  it("rejects duplicate canonical slugs", () => {
    const first = commercialCavernCatalog[0];
    const duplicate = cloneRecord(commercialCavernCatalog[1], {
      id: "commercial-cavern-duplicate-fixture",
      slug: first.slug,
      name: "Duplicate Fixture Cavern",
    });

    expect(() => validateCommercialCavernCatalog([first, duplicate])).toThrow(/duplicate slug/i);
  });

  it("rejects guided-tour metadata that conflicts with activities", () => {
    const invalid = cloneRecord(commercialCavernCatalog[0], {
      guided_tours: true,
      activities: ["Geology interpretation"],
    });

    expect(() => validateCommercialCavernCatalog([invalid])).toThrow(
      /guided_tours is true but no guided-tour activity is listed/i,
    );
  });

  it("maps every catalog cavern into the unified destination collection exactly once", () => {
    const unifiedCaverns = getUnifiedCommercialCaverns();
    const unifiedSlugs = unifiedCaverns.map((destination) => destination.slug);

    expect(new Set(unifiedSlugs).size).toBe(unifiedSlugs.length);
    expect(unifiedCaverns).toHaveLength(commercialCavernCatalog.length);

    for (const cavern of commercialCavernCatalog) {
      const matches = unifiedCaverns.filter((destination) => destination.slug === cavern.slug);
      expect(matches, `${cavern.name} must exist exactly once`).toHaveLength(1);

      const profile = matches[0].profile as Record<string, unknown>;
      const tour = profile.tourInformation as Record<string, unknown>;
      expect(tour.guidedTours).toBe(cavern.guided_tours);
      expect(tour.reservationsRecommended).toBe(cavern.reservations_recommended);
    }
  });

  it("keeps landing-page totals and reservation counts aligned with catalog metadata", () => {
    const unifiedCaverns = getUnifiedCommercialCaverns();
    const reservationRecommendedCount = unifiedCaverns.filter((destination) => {
      const profile = destination.profile as Record<string, unknown>;
      const tour = profile.tourInformation as Record<string, unknown> | undefined;
      return tour?.reservationsRecommended === true;
    }).length;

    expect(unifiedCaverns).toHaveLength(commercialCavernCatalog.length);
    expect(reservationRecommendedCount).toBe(
      commercialCavernCatalog.filter((cavern) => cavern.reservations_recommended).length,
    );
  });
});

describe("cavern sitemap fallback", () => {
  it("includes the cavern hub and every unified cavern canonical URL once", () => {
    const entries = getCavernSitemapEntries(new Date("2026-07-26T12:00:00.000Z"));
    const locations = entries.map((entry) => entry.loc);
    const unifiedCaverns = exploreDestinations.filter(
      (destination) => destination.entityType === "cavern",
    );

    expect(locations[0]).toBe(`${BASE_URL}/explore/caverns`);
    expect(new Set(locations).size).toBe(locations.length);
    expect(entries).toHaveLength(unifiedCaverns.length + 1);

    for (const cavern of unifiedCaverns) {
      expect(locations).toContain(`${BASE_URL}/explore/${cavern.slug}`);
    }
  });

  it("deduplicates catalog and database copies by canonical URL when rendered", () => {
    const entries = getCavernSitemapEntries(new Date("2026-07-26T12:00:00.000Z"));
    const duplicated = [...entries, { ...entries[1], loc: `${entries[1].loc}/` }];
    const xml = renderUrlset(duplicated, { image: true });
    const canonicalLocation = entries[1].loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    expect(xml.match(new RegExp(`<loc>${canonicalLocation}</loc>`, "g"))).toHaveLength(1);
  });
});
