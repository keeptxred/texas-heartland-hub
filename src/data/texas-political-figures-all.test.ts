import { describe, expect, it } from "vitest";
import {
  TEXAS_POLITICAL_FIGURES,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADERS,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS,
  texasPoliticalFigureByName,
} from "./texas-political-figures-all";

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

  it("supports the source-list Blacklock name while keeping the official name canonical", () => {
    expect(texasPoliticalFigureByName("Jimmy Blacklock")?.name).toBe("James Blacklock");
    expect(texasPoliticalFigureByName("James Blacklock")?.aliases).toContain("James D. Blacklock");
  });
});
