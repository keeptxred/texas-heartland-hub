import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  FIFTEENTH_COURT_CONSTITUTIONAL_CASE,
  FIFTEENTH_COURT_EXPANSION,
  FIFTEENTH_COURT_FAQS,
  FIFTEENTH_COURT_JURISDICTION,
  FIFTEENTH_COURT_JUSTICES,
  FIFTEENTH_COURT_QUICK_FACTS,
  FIFTEENTH_COURT_SELECTION,
  FIFTEENTH_COURT_SOURCES,
  FIFTEENTH_COURT_TIMELINE,
} from "./texas-fifteenth-court-authority";

const routePath = "/texas-government/fifteenth-court-of-appeals";

describe("Fifteenth Court of Appeals authority guide", () => {
  it("tracks the current three-member court", () => {
    expect(FIFTEENTH_COURT_JUSTICES.map((justice) => justice.name)).toEqual([
      "Scott Brister",
      "Scott Field",
      "April Farris",
    ]);
    expect(FIFTEENTH_COURT_QUICK_FACTS.some((fact) => fact.value === "254")).toBe(true);
  });

  it("explains the specialized statewide jurisdiction and Business Court path", () => {
    const jurisdiction = JSON.stringify(FIFTEENTH_COURT_JURISDICTION);
    expect(jurisdiction).toContain("state government");
    expect(jurisdiction).toContain("Texas Business Court");
    expect(jurisdiction).toContain("Original writs");
  });

  it("captures the constitutional challenge and election transition", () => {
    expect(FIFTEENTH_COURT_CONSTITUTIONAL_CASE.citation).toContain("697 S.W.3d 142");
    expect(FIFTEENTH_COURT_CONSTITUTIONAL_CASE.holding).toContain("constitutional court of appeals");
    expect(FIFTEENTH_COURT_SELECTION.elections).toContain("November 2026");
    expect(FIFTEENTH_COURT_TIMELINE.some((item) => item.title.includes("Supreme Court upholds"))).toBe(true);
  });

  it("tracks the enacted expansion to Places 4 and 5", () => {
    expect(FIFTEENTH_COURT_EXPANSION.map((item) => item.date)).toEqual([
      "September 1, 2028",
      "September 1, 2029",
    ]);
  });

  it("uses a substantive FAQ and primary-source set", () => {
    expect(FIFTEENTH_COURT_FAQS.length).toBeGreaterThanOrEqual(8);
    const sources = FIFTEENTH_COURT_SOURCES.map((source) => source.href).join("\n");
    expect(sources).toContain("txcourts.gov/15thcoa");
    expect(sources).toContain("SB01045F");
    expect(sources).toContain("HB00016F");
    expect(sources).toContain("240426.pdf");
  });

  it("wires the canonical route into the judiciary cluster and government sitemap", () => {
    const route = readFileSync("src/routes/texas-government.fifteenth-court-of-appeals.tsx", "utf8");
    const component = readFileSync("src/components/texas-fifteenth-court-authority-page.tsx", "utf8");
    const businessCourtRoute = readFileSync("src/routes/texas-government.texas-business-court.tsx", "utf8");
    const sitemap = readFileSync("src/routes/sitemap-government[.]xml.ts", "utf8");

    expect(route).toContain(routePath);
    expect(component).toContain('const SITE_URL = "https://keeptxred.com";');
    expect(component).toContain('const CANONICAL = `${SITE_URL}/texas-government/fifteenth-court-of-appeals`;');
    expect(component).toContain("FAQPage");
    expect(businessCourtRoute).toContain(routePath);
    expect(sitemap).toContain(routePath);
  });
});
