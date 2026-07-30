import { describe, expect, it } from "vitest";
import {
  crossCatalogCollectionDiagnostics,
  crossCatalogDiscoveryCollections,
  getCrossCatalogCollectionDestinations,
  getCrossCatalogCollectionDiagnostic,
  getCrossCatalogDiscoveryCollection,
} from "./collections.cross-catalog";

const expectedIds = [
  "texas-natural-wonders",
  "guided-texas-wonders",
  "spring-fed-escapes",
  "unusual-texas-landmarks",
  "overnight-nature-and-culture",
] as const;

describe("cross-catalog discovery collections", () => {
  it("publishes the complete collection set with unique ids and slugs", () => {
    expect(crossCatalogDiscoveryCollections.map((collection) => collection.id)).toEqual(expectedIds);
    expect(new Set(crossCatalogDiscoveryCollections.map((collection) => collection.id)).size).toBe(
      crossCatalogDiscoveryCollections.length,
    );
    expect(new Set(crossCatalogDiscoveryCollections.map((collection) => collection.slug)).size).toBe(
      crossCatalogDiscoveryCollections.length,
    );
  });

  it.each(expectedIds)("resolves %s by id and slug", (id) => {
    const collection = getCrossCatalogDiscoveryCollection(id);

    expect(collection).not.toBeNull();
    expect(collection?.id).toBe(id);
    expect(getCrossCatalogDiscoveryCollection(collection?.slug ?? "")).toBe(collection);
  });

  it("resolves every collection destination exactly once", () => {
    for (const collection of crossCatalogDiscoveryCollections) {
      const destinations = getCrossCatalogCollectionDestinations(collection.id);

      expect(destinations.map((destination) => destination.slug)).toEqual(
        collection.destinationSlugs,
      );
      expect(new Set(destinations.map((destination) => destination.slug)).size).toBe(
        destinations.length,
      );
    }
  });

  it("reports no missing or duplicate production references", () => {
    expect(crossCatalogCollectionDiagnostics).toHaveLength(
      crossCatalogDiscoveryCollections.length,
    );

    for (const diagnostic of crossCatalogCollectionDiagnostics) {
      expect(diagnostic.missingDestinationSlugs).toEqual([]);
      expect(diagnostic.duplicateDestinationSlugs).toEqual([]);
    }
  });

  it("combines multiple catalog families in the natural wonders collection", () => {
    const destinations = getCrossCatalogCollectionDestinations("texas-natural-wonders");

    expect(destinations.map((destination) => destination.slug)).toEqual(
      expect.arrayContaining([
        "natural-bridge-caverns",
        "barton-springs-pool",
        "westcave-preserve",
        "chalk-bluff-river-resort",
      ]),
    );
    expect(new Set(destinations.map((destination) => destination.entityType)).size).toBeGreaterThan(1);
  });

  it("preserves guided cultural and natural experiences together", () => {
    const destinations = getCrossCatalogCollectionDestinations("guided-texas-wonders");

    expect(destinations.map((destination) => destination.slug)).toEqual(
      expect.arrayContaining([
        "natural-bridge-caverns",
        "westcave-preserve",
        "san-marcos-springs-spring-lake",
        "newmans-castle",
      ]),
    );
  });

  it("keeps free roadside art in the unusual landmarks collection", () => {
    const destinations = getCrossCatalogCollectionDestinations("unusual-texas-landmarks");
    const cadillacRanch = destinations.find((destination) => destination.slug === "cadillac-ranch");

    expect(cadillacRanch).toBeDefined();
    expect(cadillacRanch?.feeRequired).toBe(false);
    expect(cadillacRanch?.profile).toMatchObject({
      accessType: "free-open-public-access",
    });
  });

  it("returns empty and null values for unknown collection identifiers", () => {
    expect(getCrossCatalogDiscoveryCollection("not-a-collection")).toBeNull();
    expect(getCrossCatalogCollectionDestinations("not-a-collection")).toEqual([]);
    expect(getCrossCatalogCollectionDiagnostic("not-a-collection")).toBeNull();
  });

  it("keeps collection descriptions and discovery metadata complete", () => {
    for (const collection of crossCatalogDiscoveryCollections) {
      expect(collection.title.trim().length).toBeGreaterThan(0);
      expect(collection.description.trim().length).toBeGreaterThan(0);
      expect(collection.destinationSlugs.length).toBeGreaterThan(0);
      expect(collection.searchTerms.length).toBeGreaterThan(0);
      expect(collection.experienceTypes.length).toBeGreaterThan(0);
      expect(collection.regions.length).toBeGreaterThan(0);
    }
  });
});
