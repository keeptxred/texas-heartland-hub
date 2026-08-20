import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_CASE_POSITIONS } from "@/data/texas-case-all";
import { AGENCY_AUTHORITY_PROFILES } from "@/data/agency-authority";
import { isTexasCasePositionIndexable, MIN_TEXAS_CASE_POSITION_WORDS } from "@/lib/texas-case-position-indexability";
import { isAgencyAuthorityIndexable, MIN_AGENCY_AUTHORITY_WORDS } from "@/lib/agency-authority-indexability";

const texasCaseRoute = readFileSync(new URL("../routes/texas-case.$slug.tsx", import.meta.url), "utf8");
const agencyRoute = readFileSync(new URL("../routes/texas-government.agencies.$agencySlug.tsx", import.meta.url), "utf8");
const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

const CURRENT_INDEXABLE_TEXAS_CASE = [
  "protect-unborn-life",
  "gun-rights-over-gun-control",
  "eliminate-property-taxes",
  "lower-taxes-limited-government",
  "parental-rights-school-choice",
  "secure-texas-border",
];

describe("AdSense Texas Case position and agency authority indexability", () => {
  it("retains only the current substantive Texas Case position cohort", () => {
    expect(MIN_TEXAS_CASE_POSITION_WORDS).toBe(700);
    expect(TEXAS_CASE_POSITIONS.filter(isTexasCasePositionIndexable).map((position) => position.slug)).toEqual(CURRENT_INDEXABLE_TEXAS_CASE);
  });

  it("keeps the current thin agency authority cohort out of standalone indexing", () => {
    expect(MIN_AGENCY_AUTHORITY_WORDS).toBe(700);
    expect(AGENCY_AUTHORITY_PROFILES.length).toBeGreaterThan(0);
    expect(AGENCY_AUTHORITY_PROFILES.filter(isAgencyAuthorityIndexable)).toEqual([]);
  });

  it("uses the same readiness helpers for robots and sitemap discovery", () => {
    expect(texasCaseRoute).toContain('isTexasCasePositionIndexable(loaderData.position)');
    expect(texasCaseRoute).toContain('"noindex,follow"');
    expect(agencyRoute).toContain('isAgencyAuthorityIndexable(loaderData)');
    expect(agencyRoute).toContain('"noindex,follow"');
    expect(sitemapSource).toContain("const INDEXABLE_TEXAS_CASE_POSITIONS = TEXAS_CASE_POSITIONS.filter(isTexasCasePositionIndexable)");
    expect(sitemapSource).toContain("const INDEXABLE_AGENCY_AUTHORITY_PROFILES = AGENCY_AUTHORITY_PROFILES.filter(isAgencyAuthorityIndexable)");
    expect(sitemapSource).toContain("...INDEXABLE_TEXAS_CASE_POSITIONS.map((position)=>`/texas-case/${position.slug}`)");
    expect(sitemapSource).toContain("...INDEXABLE_AGENCY_AUTHORITY_PROFILES.map((agency)=>`/texas-government/agencies/${agency.slug}`)");
    expect(sitemapSource).not.toContain("...TEXAS_CASE_POSITIONS.map((position)=>`/texas-case/${position.slug}`)");
    expect(sitemapSource).not.toContain("...AGENCY_AUTHORITY_PROFILES.map((agency)=>`/texas-government/agencies/${agency.slug}`)");
  });
});
