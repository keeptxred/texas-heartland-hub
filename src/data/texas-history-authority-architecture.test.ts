import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES } from "./texas-political-history-authority";
import { TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES } from "./texas-republic-government-authority";
import { TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES } from "./texas-civil-war-reconstruction-authority";
import { TEXAS_POLITICAL_ERAS_AUTHORITY_PAGES } from "./texas-political-eras-authority";
import { TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES } from "./texas-political-geography-authority";
import { TEXAS_PARTY_REPRESENTATION_AUTHORITY_PAGES } from "./texas-party-representation-authority";
import { GOVERNMENT_HISTORY_AUTHORITY_PAGES } from "./texas-government-history-authority";
import { TEXAS_LOCAL_GOVERNMENT_AUTHORITY_PAGES } from "./texas-local-government-authority";
import { TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES } from "./texas-municipal-government-authority";

const politicalCohorts = [
  TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES,
  TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES,
  TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES,
  TEXAS_POLITICAL_ERAS_AUTHORITY_PAGES,
  TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES,
  TEXAS_PARTY_REPRESENTATION_AUTHORITY_PAGES,
] as const;

const governmentCohorts = [
  GOVERNMENT_HISTORY_AUTHORITY_PAGES,
  TEXAS_LOCAL_GOVERNMENT_AUTHORITY_PAGES,
  TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES,
] as const;

const politicsHub = readFileSync(new URL("../routes/texas-politics.index.tsx", import.meta.url), "utf8");
const sitemapIndex = readFileSync(new URL("../routes/sitemap[.]xml.ts", import.meta.url), "utf8");

const politicalPages = politicalCohorts.flatMap((cohort) => [...cohort]);
const governmentPages = governmentCohorts.flatMap((cohort) => [...cohort]);

function routeExists(prefix: "texas-politics" | "texas-government", slug: string) {
  return existsSync(new URL(`../routes/${prefix}.${slug}.tsx`, import.meta.url));
}

describe("Texas history authority architecture", () => {
  it("keeps every structured history authority URL globally unique", () => {
    const paths = [
      ...politicalPages.map((page) => `/texas-politics/${page.slug}`),
      ...governmentPages.map((page) => `/texas-government/${page.slug}`),
    ];
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("requires every structured history authority record to have a public route", () => {
    for (const page of politicalPages) {
      expect(routeExists("texas-politics", page.slug), `/texas-politics/${page.slug}`).toBe(true);
    }
    for (const page of governmentPages) {
      expect(routeExists("texas-government", page.slug), `/texas-government/${page.slug}`).toBe(true);
    }
  });

  it("keeps dedicated political-history child sitemaps advertised from the root sitemap", () => {
    expect(sitemapIndex).toContain('"sitemap-political-geography.xml"');
    expect(sitemapIndex).toContain('"sitemap-party-representation.xml"');
  });

  it("surfaces every party and representation authority page from the primary politics hub", () => {
    for (const page of TEXAS_PARTY_REPRESENTATION_AUTHORITY_PAGES) {
      expect(politicsHub, page.slug).toContain(`/texas-politics/${page.slug}`);
    }
  });
});
