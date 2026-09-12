import { describe, expect, it } from "vitest";
import { ALL_TEXAS_POLITICAL_FIGURES } from "./texas-political-figures-all";
import { TEXAS_POLITICAL_FIGURES_STATEWIDE_OFFICIAL } from "./texas-political-figures-statewide-official";

const expectedNames = [
  "Don Huffines",
  "Debra Lehrmann",
  "James P. Sullivan",
  "Kyle D. Hawkins",
  "David J. Schenck",
  "Mary Lou Keel",
  "Bert Richardson",
  "Kevin Yeary",
  "Scott Walker",
  "Jesse F. McClure III",
  "Gina G. Parker",
  "Lee Finley",
  "David Newell",
  "Sharon Keller",
  "Barbara Parker Hervey",
  "Michelle Slaughter",
] as const;

describe("official statewide political profiles", () => {
  it("publishes every added official or former official through the aggregate figure index", () => {
    const names = new Set(ALL_TEXAS_POLITICAL_FIGURES.map((figure) => figure.name));
    for (const name of expectedNames) expect(names.has(name)).toBe(true);
  });

  it("uses unique slugs and official Texas government sources", () => {
    const slugs = TEXAS_POLITICAL_FIGURES_STATEWIDE_OFFICIAL.map((figure) => figure.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const figure of TEXAS_POLITICAL_FIGURES_STATEWIDE_OFFICIAL) {
      expect(figure.sources.some((source) => /^(https:\/\/)?(www\.)?(txcourts\.gov|comptroller\.texas\.gov)\//.test(source.href))).toBe(true);
      expect(figure.sections).toHaveLength(4);
    }
  });

  it("does not create duplicate slugs in the full political-figure collection", () => {
    const slugs = ALL_TEXAS_POLITICAL_FIGURES.map((figure) => figure.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
