import { describe, expect, it } from "vitest";
import {
  POLITICAL_FIGURE_LEGACY_SLUG_REDIRECTS,
  TEXAS_POLITICAL_FIGURES,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADERS,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS,
  texasPoliticalFigureByName,
  texasPoliticalFigurePageByName,
} from "./texas-political-figures-all";
import { politicalFigureAuthoritySourcesBySlug } from "./texas-political-figure-authority-sources";

describe("Texas political figure authority collection", () => {
  it("covers all 100 requested Republican and conservative leaders", () => {
    expect(TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS).toHaveLength(100);
    const missing = TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS.filter((name) => !texasPoliticalFigureByName(name));
    expect(missing).toEqual([]);
    expect(TEXAS_REPUBLICAN_CONSERVATIVE_LEADERS).toHaveLength(100);
  });

  it("keeps every canonical profile slug unique", () => {
    const slugs = TEXAS_POLITICAL_FIGURES.map((figure) => figure.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps requested profiles substantive and internally linked", () => {
    for (const figure of TEXAS_REPUBLICAN_CONSERVATIVE_LEADERS) {
      expect(figure.description.length, `${figure.name} description`).toBeGreaterThanOrEqual(80);
      expect(figure.sections.length, `${figure.name} section count`).toBeGreaterThanOrEqual(4);
      expect(
        figure.sections.reduce((total, section) => total + section.body.length, 0),
        `${figure.name} body length`,
      ).toBeGreaterThanOrEqual(900);
      expect(figure.relatedLinks.length, `${figure.name} related links`).toBeGreaterThanOrEqual(2);
      expect(figure.relatedLinks.some((link) => link.href.startsWith("/")), `${figure.name} internal links`).toBe(true);
    }
  });

  it("keeps every requested profile connected to authoritative source material", () => {
    for (const requestedName of TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS) {
      const figure = texasPoliticalFigurePageByName(requestedName);
      expect(figure, `${requestedName} canonical profile`).toBeDefined();
      if (!figure) continue;

      const sources = [...(figure.sources ?? []), ...politicalFigureAuthoritySourcesBySlug(figure.slug)];
      expect(sources.length, `${figure.name} source count`).toBeGreaterThanOrEqual(1);
      for (const source of sources) {
        expect(source.href, `${figure.name} source URL`).toMatch(/^https:\/\//);
        expect(source.label.trim().length, `${figure.name} source label`).toBeGreaterThan(10);
      }
    }
  });

  it("does not expose two canonical pages for one requested political identity", () => {
    const canonicalSlugByTargetName = new Map<string, string>();
    for (const figure of TEXAS_POLITICAL_FIGURES) {
      const target = texasPoliticalFigureByName(figure.name);
      if (!target) continue;

      const previousSlug = canonicalSlugByTargetName.get(target.name);
      expect(previousSlug, `duplicate canonical identity for ${target.name}: ${previousSlug ?? "none"} and ${figure.slug}`).toBeUndefined();
      canonicalSlugByTargetName.set(target.name, figure.slug);
    }
  });

  it("collapses Creager aliases onto the deeper canonical profile and preserves the old URL", () => {
    const canonicalSlug = "rb-creager-early-texas-republican-leader";
    const legacySlug = "rentfro-banton-creager-texas-republican-organizer";

    expect(texasPoliticalFigureByName("R.B. Creager")?.name).toBe("Rentfro Banton Creager");
    expect(texasPoliticalFigurePageByName("R.B. Creager")?.slug).toBe(canonicalSlug);
    expect(texasPoliticalFigurePageByName("Rentfro Banton Creager")?.slug).toBe(canonicalSlug);
    expect(TEXAS_POLITICAL_FIGURES.some((figure) => figure.slug === legacySlug)).toBe(false);
    expect(POLITICAL_FIGURE_LEGACY_SLUG_REDIRECTS[legacySlug]).toBe(canonicalSlug);
  });

  it("keeps every legacy duplicate slug out of the canonical registry", () => {
    for (const legacySlug of Object.keys(POLITICAL_FIGURE_LEGACY_SLUG_REDIRECTS)) {
      expect(TEXAS_POLITICAL_FIGURES.some((figure) => figure.slug === legacySlug), legacySlug).toBe(false);
    }
  });

  it("supports the source-list Blacklock name while keeping the official name canonical", () => {
    expect(texasPoliticalFigureByName("Jimmy Blacklock")?.name).toBe("James Blacklock");
    expect(texasPoliticalFigureByName("James Blacklock")?.aliases).toContain("James D. Blacklock");
  });
});
