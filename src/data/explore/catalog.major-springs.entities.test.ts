import { describe, expect, it } from "vitest";
import { majorSpringCatalog } from "./catalog.major-springs";
import {
  getMajorSpringDestinationEnrichment,
  majorSpringDestinations,
} from "./catalog.major-springs.entities";

describe("major spring destination mapping", () => {
  it("creates one destination for every create-mode spring", () => {
    const expectedSlugs = majorSpringCatalog
      .filter((spring) => spring.integrationMode === "create")
      .map((spring) => spring.slug)
      .sort();

    expect(majorSpringDestinations.map((destination) => destination.slug).sort()).toEqual(
      expectedSlugs,
    );
  });

  it("does not create a duplicate destination for San Solomon Springs", () => {
    expect(
      majorSpringDestinations.some((destination) => destination.slug === "san-solomon-springs"),
    ).toBe(false);

    const enrichment = getMajorSpringDestinationEnrichment("balmorhea-state-park");
    expect(enrichment).not.toBeNull();
    expect(enrichment?.alternateNames).toContain("San Solomon Springs");
  });

  it("produces unique destination ids and slugs", () => {
    const ids = majorSpringDestinations.map((destination) => destination.id);
    const slugs = majorSpringDestinations.map((destination) => destination.slug);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("retains official-source and access metadata", () => {
    for (const destination of majorSpringDestinations) {
      expect(destination.officialUrl).toMatch(/^https:\/\//);
      expect(destination.sourceUrl).toBe(destination.officialUrl);
      expect(destination.sourceName).toBeTruthy();
      expect(destination.profile).toBeTruthy();
      expect(destination.regulations).toBeTruthy();
      expect(destination.seasonalGuidance).toBeTruthy();
      expect(destination.tags).toContain("spring");
    }
  });

  it("preserves the current no-swimming status for Jacob's Well", () => {
    const jacobsWell = majorSpringDestinations.find(
      (destination) => destination.slug === "jacobs-well-natural-area",
    );

    expect(jacobsWell).toBeDefined();
    expect(jacobsWell?.regulations).toMatchObject({ swimmingStatus: "not-permitted" });
  });
});
