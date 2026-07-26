import { describe, expect, it } from "vitest";
import type { ExploreJson, ExploreJsonObject } from "@/types/explore/public";
import { exploreDestinations } from "./all-destinations";
import { majorSpringCatalog } from "./catalog.major-springs";
import { majorSpringDestinations } from "./catalog.major-springs.entities";

const getUnifiedDestination = (slug: string) => {
  const matches = exploreDestinations.filter((destination) => destination.slug === slug);
  expect(matches, `${slug} must exist exactly once in the unified catalog`).toHaveLength(1);
  return matches[0];
};

const asJsonObject = (value: ExploreJson | undefined): ExploreJsonObject => {
  expect(value).not.toBeNull();
  expect(typeof value).toBe("object");
  expect(Array.isArray(value)).toBe(false);
  return value as ExploreJsonObject;
};

const expectUniqueNormalizedTerms = (terms: string[]) => {
  expect(new Set(terms).size).toBe(terms.length);

  for (const term of terms) {
    expect(term).toBe(term.trim());
    expect(term.length).toBeGreaterThan(0);
    expect(term).toBe(term.toLowerCase());
  }
};

describe("Explore Texas major spring catalog regression coverage", () => {
  it("includes every create-mode spring exactly once in the unified catalog", () => {
    expect(majorSpringDestinations).toHaveLength(
      majorSpringCatalog.filter((spring) => spring.integrationMode === "create").length,
    );

    for (const spring of majorSpringCatalog.filter(
      (record) => record.integrationMode === "create",
    )) {
      const destination = getUnifiedDestination(spring.slug);
      const springExperience = asJsonObject(destination.profile.springExperience);

      expect(destination.id).toBe(spring.slug);
      expect(destination.name).toBe(spring.name);
      expect(destination.entityType).toBe("natural_area");
      expect(destination.officialUrl).toBe(spring.officialUrl);
      expect(destination.sourceUrl).toBe(spring.officialUrl);
      expect(destination.sourceName).toBe(spring.sourceName);
      expect(destination.feeRequired).toBe(spring.feeRequired);
      expect(destination.profile.operator).toBe(spring.managingOrganization);
      expect(springExperience.swimmingStatus).toBe(spring.swimmingStatus);
      expect(springExperience.publicAccess).toBe(spring.publicAccess);
      expect(destination.categories).toContain("major texas spring");
      expect(destination.tags).toEqual(expect.arrayContaining(["spring", "springs", "freshwater"]));

      expectUniqueNormalizedTerms(destination.categories);
      expectUniqueNormalizedTerms(destination.tags);
    }
  });

  it("enriches Balmorhea State Park with San Solomon Springs without creating a duplicate", () => {
    const destination = getUnifiedDestination("balmorhea-state-park");

    expect(destination.alternateNames).toEqual(
      expect.arrayContaining(["San Solomon Springs", "san-solomon-springs"]),
    );
    expect(destination.categories).toContain("major texas spring");
    expect(destination.tags).toEqual(
      expect.arrayContaining(["san solomon springs", "spring", "spring-fed", "freshwater"]),
    );
    expect(destination.profile.spring).toMatchObject({
      operator: "Texas Parks and Wildlife Department",
      springExperience: {
        swimmingStatus: "permitted",
        publicAccess: true,
      },
    });
    expect(destination.officialUrl).toMatch(/^https:\/\/tpwd\.texas\.gov\/state-parks\/balmorhea/);
    expect(destination.sourceName).toBe("Texas Parks and Wildlife Department");

    expect(
      exploreDestinations.some((candidate) => candidate.slug === "san-solomon-springs"),
    ).toBe(false);
  });

  it("preserves access restrictions for sensitive spring destinations", () => {
    const jacobsWell = getUnifiedDestination("jacobs-well-natural-area");
    const springLake = getUnifiedDestination("san-marcos-springs-spring-lake");
    const jacobsWellExperience = asJsonObject(jacobsWell.profile.springExperience);
    const jacobsWellRegulations = asJsonObject(jacobsWell.regulations ?? undefined);
    const springLakeExperience = asJsonObject(springLake.profile.springExperience);
    const springLakeRegulations = asJsonObject(springLake.regulations ?? undefined);

    expect(jacobsWellExperience.swimmingStatus).toBe("not-permitted");
    expect(jacobsWell.profile.accessType).toBe("open-no-swimming");
    expect(jacobsWellRegulations.swimmingStatus).toBe("not-permitted");

    expect(springLakeExperience.swimmingStatus).toBe("program-only");
    expect(springLake.profile.accessType).toBe("open-limited-program-access");
    expect(springLakeRegulations.swimmingStatus).toBe("program-only");
  });

  it("keeps spring slugs, IDs, and official URLs unique", () => {
    const springSlugs = new Set([
      ...majorSpringCatalog
        .filter((spring) => spring.integrationMode === "create")
        .map((spring) => spring.slug),
      "balmorhea-state-park",
    ]);
    const springDestinations = exploreDestinations.filter((destination) =>
      springSlugs.has(destination.slug),
    );

    expect(springDestinations).toHaveLength(springSlugs.size);
    expect(new Set(springDestinations.map((destination) => destination.slug)).size).toBe(
      springDestinations.length,
    );
    expect(new Set(springDestinations.map((destination) => destination.id)).size).toBe(
      springDestinations.length,
    );

    const standaloneOfficialUrls = springDestinations
      .filter((destination) => destination.slug !== "balmorhea-state-park")
      .map((destination) => destination.officialUrl)
      .filter((url): url is string => Boolean(url));
    expect(new Set(standaloneOfficialUrls).size).toBe(standaloneOfficialUrls.length);
  });
});
