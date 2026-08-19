import { describe, expect, it } from "vitest";
import {
  candidateSeoSlug,
  findCandidateStoredSlug,
  findRaceStoredSlug,
  raceSeoSlug,
} from "./seoSlugs";

describe("Election Central SEO slugs", () => {
  it("normalizes legacy candidate slugs without changing clean slugs", () => {
    expect(candidateSeoSlug("candidate-greg-abbott-republican-race-2026-governor")).toBe("greg-abbott");
    expect(candidateSeoSlug("candidate-nathaniel-moran-republican-race-2026-us-house-1")).toBe("nathaniel-moran");
    expect(candidateSeoSlug("greg-abbott")).toBe("greg-abbott");
  });

  it("normalizes legacy statewide and district race slugs", () => {
    expect(raceSeoSlug("race-2026-governor")).toBe("texas-governor-2026");
    expect(raceSeoSlug("race-2026-us-house-1")).toBe("texas-us-house-district-1-2026");
    expect(raceSeoSlug("race-2026-state-house-42")).toBe("texas-house-district-42-2026");
    expect(raceSeoSlug("race-2026-texas-senate-7")).toBe("texas-senate-district-7-2026");
    expect(raceSeoSlug("texas-governor-2026")).toBe("texas-governor-2026");
  });

  it("resolves canonical requests back to stored records", () => {
    const candidates = [
      { slug: "candidate-greg-abbott-republican-race-2026-governor" },
      { slug: "candidate-nathaniel-moran-republican-race-2026-us-house-1" },
    ];
    const races = [
      { slug: "race-2026-governor" },
      { slug: "race-2026-us-house-1" },
    ];

    expect(findCandidateStoredSlug("greg-abbott", candidates)).toBe(candidates[0].slug);
    expect(findCandidateStoredSlug(candidates[1].slug, candidates)).toBe(candidates[1].slug);
    expect(findRaceStoredSlug("texas-governor-2026", races)).toBe(races[0].slug);
    expect(findRaceStoredSlug(races[1].slug, races)).toBe(races[1].slug);
    expect(findRaceStoredSlug("texas-us-house-district-99-2026", races)).toBeNull();
  });
});
