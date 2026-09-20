import { describe, expect, it } from "vitest";
import { ALL_TEXAS_POLITICAL_FIGURES } from "./texas-political-figures-all";
import {
  POLITICAL_FIGURE_LINKS,
  politicalFigureProfilePathByName,
} from "./texas-political-figure-links";

const normalize = (value: string) =>
  value.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, " ").trim();

describe("lightweight political figure links", () => {
  it("keeps every lightweight election link aligned with a real evergreen profile", () => {
    for (const entry of POLITICAL_FIGURE_LINKS) {
      const profile = ALL_TEXAS_POLITICAL_FIGURES.find((figure) => figure.slug === entry.slug);
      expect(profile, `${entry.name} should resolve to ${entry.slug}`).toBeDefined();
      expect(normalize(profile?.name ?? "")).toBe(normalize(entry.name));
    }
  });

  it("keeps manifest names and slugs unique", () => {
    expect(new Set(POLITICAL_FIGURE_LINKS.map((entry) => normalize(entry.name))).size).toBe(POLITICAL_FIGURE_LINKS.length);
    expect(new Set(POLITICAL_FIGURE_LINKS.map((entry) => entry.slug)).size).toBe(POLITICAL_FIGURE_LINKS.length);
  });

  it("resolves candidate names without case or punctuation sensitivity", () => {
    expect(politicalFigureProfilePathByName("GREG ABBOTT")).toBe(
      "/texas-politics/figures/greg-abbott-texas-governor-profile",
    );
    expect(politicalFigureProfilePathByName("Monica De-La Cruz")).toBe(
      "/texas-politics/figures/monica-de-la-cruz-texas-congresswoman-profile",
    );
    expect(politicalFigureProfilePathByName("Unknown Candidate")).toBeNull();
  });
});
