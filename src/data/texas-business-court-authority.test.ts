import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  TEXAS_BUSINESS_COURT_2025_CHANGES,
  TEXAS_BUSINESS_COURT_ACTIVE_DIVISIONS,
  TEXAS_BUSINESS_COURT_EXCLUSIONS,
  TEXAS_BUSINESS_COURT_FAQS,
  TEXAS_BUSINESS_COURT_JURISDICTION,
  TEXAS_BUSINESS_COURT_NONOPERATIONAL_DIVISIONS,
  TEXAS_BUSINESS_COURT_SOURCES,
} from "./texas-business-court-authority";

describe("Texas Business Court authority", () => {
  it("preserves the current five operational divisions and ten-judge roster", () => {
    expect(TEXAS_BUSINESS_COURT_ACTIVE_DIVISIONS.map((division) => division.number)).toEqual([1, 3, 4, 8, 11]);
    expect(TEXAS_BUSINESS_COURT_ACTIVE_DIVISIONS).toHaveLength(5);
    expect(TEXAS_BUSINESS_COURT_ACTIVE_DIVISIONS.every((division) => division.judges.length === 2)).toBe(true);
    expect(TEXAS_BUSINESS_COURT_ACTIVE_DIVISIONS.flatMap((division) => division.judges)).toHaveLength(10);
    expect(new Set(TEXAS_BUSINESS_COURT_ACTIVE_DIVISIONS.flatMap((division) => division.judges)).size).toBe(10);
    expect(TEXAS_BUSINESS_COURT_NONOPERATIONAL_DIVISIONS).toEqual([2, 5, 6, 7, 9, 10]);
  });

  it("keeps the current jurisdiction framework and important exceptions", () => {
    const jurisdiction = TEXAS_BUSINESS_COURT_JURISDICTION.map((item) => `${item.title} ${item.threshold} ${item.text}`).join(" ").toLowerCase();
    expect(jurisdiction).toContain("$5 million");
    expect(jurisdiction).toContain("publicly traded");
    expect(jurisdiction).toContain("intellectual property");
    expect(jurisdiction).toContain("trade secrets");
    expect(jurisdiction).toContain("arbitration");
    expect(jurisdiction).toContain("supplemental jurisdiction");
  });

  it("preserves claims the Legislature keeps outside Business Court jurisdiction", () => {
    const exclusions = TEXAS_BUSINESS_COURT_EXCLUSIONS.join(" ").toLowerCase();
    expect(exclusions).toContain("bodily injury or death");
    expect(exclusions).toContain("legal-malpractice");
    expect(exclusions).toContain("consumer-transaction");
    expect(exclusions).toContain("chapter 74");
  });

  it("retains the material 2025 House Bill 40 changes", () => {
    expect(TEXAS_BUSINESS_COURT_2025_CHANGES).toHaveLength(6);
    const changes = TEXAS_BUSINESS_COURT_2025_CHANGES.map((item) => `${item.title} ${item.text}`).join(" ").toLowerCase();
    expect(changes).toContain("$10 million threshold reduced to $5 million");
    expect(changes).toContain("intellectual-property");
    expect(changes).toContain("arbitration jurisdiction");
    expect(changes).toContain("nonoperational divisions");
    expect(changes).toContain("september 1, 2035");
  });

  it("retains a useful FAQ and official primary-source stack", () => {
    expect(TEXAS_BUSINESS_COURT_FAQS.length).toBeGreaterThanOrEqual(8);
    expect(TEXAS_BUSINESS_COURT_SOURCES.length).toBeGreaterThanOrEqual(8);

    const allowedHosts = new Set([
      "www.txcourts.gov",
      "statutes.capitol.texas.gov",
      "capitol.texas.gov",
    ]);
    for (const source of TEXAS_BUSINESS_COURT_SOURCES) {
      expect(allowedHosts.has(new URL(source.href).hostname), source.href).toBe(true);
    }
  });

  it("wires the canonical route into the judiciary cluster and government sitemap", () => {
    const route = readFileSync("src/routes/texas-government.texas-business-court.tsx", "utf8");
    const component = readFileSync("src/components/texas-business-court-authority-page.tsx", "utf8");
    const courtsHub = readFileSync("src/components/texas-courts-authority-page.tsx", "utf8");
    const sitemap = readFileSync("src/routes/sitemap-government[.]xml.ts", "utf8");
    const path = "/texas-government/texas-business-court";

    expect(route).toContain(`createFileRoute(\"${path}\")`);
    expect(route).toContain("TexasBusinessCourtAuthorityPage");
    expect(route).toContain("texasBusinessCourtAuthorityHead");
    expect(component).toContain(`const CANONICAL = \`\${SITE_URL}${path}\``);
    expect(component).toContain('name: "robots", content: "index, follow, max-image-preview:large"');
    expect(courtsHub).toContain(path);
    expect(sitemap).toContain(`${path}\`, lastmod: toIsoDate(TEXAS_BUSINESS_COURT_REVIEWED)`);
  });
});
