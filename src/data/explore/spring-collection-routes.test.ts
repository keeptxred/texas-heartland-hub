import { describe, expect, it } from "vitest";
import { majorSpringDiscoveryCollections } from "./collections.major-springs";

const publicSpringCollectionPaths = [
  "/explore/major-springs",
  "/explore/spring-fed-swimming",
  "/explore/hill-country-springs",
  "/explore/spring-conservation-and-education",
] as const;

describe("Explore Texas spring collection routes", () => {
  it("keeps every spring discovery collection mapped to a dedicated public path", () => {
    expect(publicSpringCollectionPaths).toHaveLength(majorSpringDiscoveryCollections.length);
    expect(new Set(publicSpringCollectionPaths).size).toBe(publicSpringCollectionPaths.length);
  });

  it("uses stable, indexable Explore paths", () => {
    for (const path of publicSpringCollectionPaths) {
      expect(path).toMatch(/^\/explore\/[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(path).not.toBe("/explore/major-texas-springs");
    }
  });
});
