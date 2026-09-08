import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  TEXAS_COMMON_CASE_STARTS,
  TEXAS_DISTRICT_COURT_COUNT_AS_OF_REVIEW,
  TEXAS_TRIAL_COURT_2026_CHANGES,
  TEXAS_TRIAL_COURT_APPEAL_NOTES,
  TEXAS_TRIAL_COURT_TYPES,
  TEXAS_TRIAL_COURTS_FAQS,
  TEXAS_TRIAL_COURTS_SOURCES,
} from "./texas-trial-courts-authority";

const routePath = "/texas-government/texas-trial-courts";

describe("Texas trial courts authority guide", () => {
  it("covers all seven Texas trial-court types", () => {
    expect(TEXAS_TRIAL_COURT_TYPES.map((court) => court.name)).toEqual([
      "District Courts",
      "Texas Business Court",
      "Constitutional County Courts",
      "Statutory County Courts at Law",
      "Statutory Probate Courts",
      "Justice Courts",
      "Municipal Courts",
    ]);
  });

  it("reconciles the September 2026 district-court expansion", () => {
    expect(TEXAS_DISTRICT_COURT_COUNT_AS_OF_REVIEW).toBe(517);
    const changes = JSON.stringify(TEXAS_TRIAL_COURT_2026_CHANGES);
    expect(changes).toContain("September 1, 2026");
    expect(changes).toContain("490th Judicial District");
    expect(changes).toContain("October 1, 2026");
    expect(changes).toContain("516th");
    expect(changes).toContain("517th");
  });

  it("explains common starting courts and appeal differences", () => {
    const starts = JSON.stringify(TEXAS_COMMON_CASE_STARTS);
    expect(starts).toContain("Felony criminal prosecution");
    expect(starts).toContain("Eviction");
    expect(starts).toContain("Probate or guardianship");

    const appeals = JSON.stringify(TEXAS_TRIAL_COURT_APPEAL_NOTES);
    expect(appeals).toContain("trial de novo");
    expect(appeals).toContain("Fifteenth Court of Appeals");
    expect(appeals).toContain("Court of Criminal Appeals");
  });

  it("uses a substantive FAQ and official-source set", () => {
    expect(TEXAS_TRIAL_COURTS_FAQS.length).toBeGreaterThanOrEqual(7);
    const sources = TEXAS_TRIAL_COURTS_SOURCES.map((source) => source.href).join("\n");
    expect(sources).toContain("txcourts.gov/about-texas-courts/trial-courts");
    expect(sources).toContain("court-structure-chart-dec-2025.pdf");
    expect(sources).toContain("judicial-directory");
    expect(sources).toContain("HB00016F");
  });

  it("wires an indexable canonical route into the government sitemap", () => {
    const route = readFileSync("src/routes/texas-government.texas-trial-courts.tsx", "utf8");
    const component = readFileSync("src/components/texas-trial-courts-authority-page.tsx", "utf8");
    const sitemap = readFileSync("src/routes/sitemap-government[.]xml.ts", "utf8");

    expect(route).toContain(routePath);
    expect(component).toContain('const CANONICAL_PATH = "/texas-government/texas-trial-courts";');
    expect(component).toContain('name: "robots", content: "index, follow, max-image-preview:large"');
    expect(component).toContain("FAQPage");
    expect(component).toContain("Texas Judicial Directory");
    expect(sitemap).toContain(routePath);
  });
});
