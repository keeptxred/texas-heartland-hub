import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { availableElectionReferences, isAvailableElectionReference, publicElectionReference } from "./public-election-reference";

describe("public evergreen election references", () => {
  it("uses accurately labeled, permanent resources during the off-season", () => {
    expect(publicElectionReference(false)).toMatchObject({ href: "/county-elections", label: "Texas county election offices" });
    expect(publicElectionReference(true)).toMatchObject({ href: "/elections/2026", label: "Texas Election Central" });
  });

  it.each(["/elections", "/elections/2026/", "/elections/races/example", "/candidate-guides", "/texas-news/elections?x=1"])("hides retired links while preserving their active-cycle availability: %s", (href) => {
    expect(isAvailableElectionReference(href, false)).toBe(false);
    expect(isAvailableElectionReference(href, true)).toBe(true);
  });

  it("keeps independent voting resources and official sources", () => {
    const links = [
      { href: "/elections/candidates/example", label: "Specific candidate" },
      { href: "/county-elections", label: "County offices" },
      { href: "https://www.sos.state.tx.us/elections/", label: "Official state sources" },
      { href: "/representatives", label: "Current representatives" },
    ];
    expect(availableElectionReferences(links, false)).toEqual(links.slice(1));
    expect(availableElectionReferences(links, true)).toEqual(links);
  });

  it("uses the season-aware resource in public evergreen authority templates", () => {
    for (const path of [
      "src/routes/texas-politics.figures.tsx",
      "src/routes/texas-politics.figures_.$figureSlug.tsx",
      "src/routes/texas-government.index.tsx",
      "src/routes/texas-government.$entitySlug.tsx",
      "src/components/political-history-authority-page.tsx",
      "src/components/government-history-authority-page.tsx",
      "src/components/texas-judicial-selection-history-page.tsx",
      "src/components/texas-courts-authority-page.tsx",
      "src/components/texas-supreme-court-history-page.tsx",
      "src/components/texas-court-of-criminal-appeals-history-page.tsx",
      "src/routes/texas-politics.how-texas-became-republican.tsx",
      "src/routes/texas-politics.why-texas-is-politically-competitive.tsx",
    ]) {
      const source = readFileSync(path, "utf8");
      expect(source, path).toContain("publicElectionReference()");
      expect(source, path).not.toMatch(/(?:href|to)="\/elections\/2026"/);
    }
  });
});
