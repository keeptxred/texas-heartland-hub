import { describe, expect, it } from "vitest";
import { SPORTS_SOURCES } from "@/lib/sports-sources";
import { TEAM_BY_SLUG } from "@/lib/texas-teams";

describe("sports source registry", () => {
  it("uses unique source names and URLs", () => {
    expect(new Set(SPORTS_SOURCES.map((source) => source.name)).size).toBe(SPORTS_SOURCES.length);
    expect(new Set(SPORTS_SOURCES.map((source) => source.url)).size).toBe(SPORTS_SOURCES.length);
  });

  it("only references registered teams", () => {
    for (const source of SPORTS_SOURCES) {
      if (source.team) expect(TEAM_BY_SLUG[source.team]).toBeDefined();
    }
  });

  it("requires an explicit path filter for HTML discovery", () => {
    for (const source of SPORTS_SOURCES.filter((entry) => entry.mode === "html-links")) {
      expect(source.include).toBeTruthy();
    }
  });

  it("prioritizes official first-party sources", () => {
    expect(SPORTS_SOURCES.filter((source) => source.priority === 1).length).toBeGreaterThan(15);
    expect(Math.min(...SPORTS_SOURCES.map((source) => source.reputation))).toBeGreaterThanOrEqual(90);
  });
});
