import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures";
import { POLITICAL_FIGURE_HEROES } from "@/data/texas-political-figure-heroes";

const ALLOWED_LICENSES = new Set(["Public domain", "CC BY-SA 4.0"]);
const AUDITED_EXTENDED_HERO_SLUGS = [
  "john-tower-texas-senator-republican-breakthrough",
  "kay-bailey-hutchison-texas-senator",
  "dick-armey-texas-house-majority-leader",
  "tom-delay-texas-house-majority-leader",
  "ron-paul-texas-libertarian-conservative",
  "kevin-brady-texas-ways-means-chair",
  "jeb-hensarling-texas-financial-services-chair",
] as const;

describe("Texas political figure hero rights", () => {
  it("covers every original evergreen political figure with one vetted hero", () => {
    for (const figure of TEXAS_POLITICAL_FIGURES) {
      expect(POLITICAL_FIGURE_HEROES[figure.slug], figure.slug).toBeDefined();
    }
  });

  it("preserves the audited extended federal-portrait cohort", () => {
    for (const slug of AUDITED_EXTENDED_HERO_SLUGS) {
      expect(POLITICAL_FIGURE_HEROES[slug], slug).toBeDefined();
    }
    expect(Object.keys(POLITICAL_FIGURE_HEROES).length).toBeGreaterThanOrEqual(
      TEXAS_POLITICAL_FIGURES.length + AUDITED_EXTENDED_HERO_SLUGS.length,
    );
  });

  it("keeps item-level Wikimedia provenance, attribution, and approved licenses", () => {
    const heroUrls = new Set<string>();
    for (const [slug, hero] of Object.entries(POLITICAL_FIGURE_HEROES)) {
      expect(hero.src, slug).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/Special:Redirect\/file\//);
      expect(hero.sourcePage, slug).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(hero.alt.trim().length, slug).toBeGreaterThan(12);
      expect(hero.credit, slug).toMatch(/Wikimedia Commons/i);
      expect(ALLOWED_LICENSES.has(hero.license), `${slug}: ${hero.license}`).toBe(true);
      expect(heroUrls.has(hero.src), `${slug}: duplicate hero URL`).toBe(false);
      heroUrls.add(hero.src);
    }
  });

  it("does not regress to generated or stock-photo credits", () => {
    for (const [slug, hero] of Object.entries(POLITICAL_FIGURE_HEROES)) {
      expect(hero.credit, slug).not.toMatch(/generated|workers ai|unsplash|pexels|stock/i);
    }
  });
});
