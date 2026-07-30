import { describe, expect, it } from "vitest";
import {
  buildExploreCollectionRegistryAudit,
  exploreCollectionRegistryAudit,
  exploreDiscoveryCollectionRegistry,
  getExploreDiscoveryCollection,
  getExploreDiscoveryCollectionDestinations,
  searchExploreDiscoveryCollections,
  type ExploreDiscoveryCollectionRegistryRecord,
} from "./collections.registry";

const expectedFamilies = [
  "cross-catalog",
  "private-cultural-landmarks",
  "private-natural-landmarks",
] as const;

describe("unified discovery collection registry", () => {
  it("publishes collections from every registered family", () => {
    expect(new Set(exploreDiscoveryCollectionRegistry.map((collection) => collection.family))).toEqual(
      new Set(expectedFamilies),
    );
  });

  it("keeps production ids, slugs, and destination references valid", () => {
    expect(exploreCollectionRegistryAudit.valid).toBe(true);
    expect(exploreCollectionRegistryAudit.collectionCount).toBe(
      exploreDiscoveryCollectionRegistry.length,
    );
    expect(exploreCollectionRegistryAudit.duplicateIds).toEqual([]);
    expect(exploreCollectionRegistryAudit.duplicateSlugs).toEqual([]);
    expect(exploreCollectionRegistryAudit.missingDestinationReferences).toEqual([]);
  });

  it("resolves every collection by id and slug", () => {
    for (const collection of exploreDiscoveryCollectionRegistry) {
      expect(getExploreDiscoveryCollection(collection.id)).toBe(collection);
      expect(getExploreDiscoveryCollection(collection.slug)).toBe(collection);
    }
  });

  it("resolves every production destination reference in collection order", () => {
    for (const collection of exploreDiscoveryCollectionRegistry) {
      const destinations = getExploreDiscoveryCollectionDestinations(collection.id);
      expect(destinations.map((destination) => destination.slug)).toEqual(
        collection.destinationSlugs,
      );
    }
  });

  it("searches collection titles, descriptions, slugs, and search terms", () => {
    expect(searchExploreDiscoveryCollections("spring").map((collection) => collection.id)).toEqual(
      expect.arrayContaining(["spring-fed-escapes"]),
    );
    expect(searchExploreDiscoveryCollections("roadside").map((collection) => collection.id)).toEqual(
      expect.arrayContaining([
        "unusual-texas-landmarks",
        "texas-roadside-art-and-architecture",
      ]),
    );
    expect(searchExploreDiscoveryCollections("conservation").map((collection) => collection.id)).toEqual(
      expect.arrayContaining(["guided-conservation-experiences"]),
    );
  });

  it("returns empty results for blank and unmatched searches", () => {
    expect(searchExploreDiscoveryCollections("   ")).toEqual([]);
    expect(searchExploreDiscoveryCollections("no-such-discovery-theme")).toEqual([]);
    expect(getExploreDiscoveryCollection("no-such-collection")).toBeNull();
    expect(getExploreDiscoveryCollectionDestinations("no-such-collection")).toEqual([]);
  });

  it("detects duplicate ids and slugs in supplied registry data", () => {
    const duplicate: ExploreDiscoveryCollectionRegistryRecord = {
      ...exploreDiscoveryCollectionRegistry[0],
      title: "Duplicate collection fixture",
    };
    const audit = buildExploreCollectionRegistryAudit([
      exploreDiscoveryCollectionRegistry[0],
      duplicate,
    ]);

    expect(audit.valid).toBe(false);
    expect(audit.duplicateIds).toEqual([duplicate.id]);
    expect(audit.duplicateSlugs).toEqual([duplicate.slug]);
  });

  it("detects unresolved destination references in supplied registry data", () => {
    const fixture: ExploreDiscoveryCollectionRegistryRecord = {
      family: "cross-catalog",
      id: "missing-destination-fixture",
      slug: "missing-destination-fixture",
      title: "Missing destination fixture",
      description: "Fixture used to verify unresolved destination reporting.",
      destinationSlugs: ["not-a-real-destination"],
      searchTerms: ["fixture"],
    };
    const audit = buildExploreCollectionRegistryAudit([fixture]);

    expect(audit.valid).toBe(false);
    expect(audit.missingDestinationReferences).toEqual([
      {
        collectionId: fixture.id,
        destinationSlugs: ["not-a-real-destination"],
      },
    ]);
  });

  it("keeps registry metadata complete and destination lists duplicate-free", () => {
    for (const collection of exploreDiscoveryCollectionRegistry) {
      expect(collection.title.trim().length).toBeGreaterThan(0);
      expect(collection.description.trim().length).toBeGreaterThan(0);
      expect(collection.searchTerms.length).toBeGreaterThan(0);
      expect(collection.destinationSlugs.length).toBeGreaterThan(0);
      expect(new Set(collection.destinationSlugs).size).toBe(collection.destinationSlugs.length);
    }
  });
});
