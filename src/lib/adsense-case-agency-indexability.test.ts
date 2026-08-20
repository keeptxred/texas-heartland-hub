import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_CASE_POSITIONS } from "@/data/texas-case-all";
import { AGENCY_AUTHORITY_PROFILES } from "@/data/agency-authority";
import {
  isAgencyAuthorityIndexable,
  isTexasCasePositionIndexable,
  MIN_AGENCY_AUTHORITY_WORDS,
  MIN_TEXAS_CASE_POSITION_WORDS,
} from "@/lib/case-agency-indexability";

const positionRoute = fs.readFileSync(new URL("../routes/texas-case.$slug.tsx", import.meta.url), "utf8");
const agencyRoute = fs.readFileSync(new URL("../routes/texas-government.agencies.$agencySlug.tsx", import.meta.url), "utf8");
const sitemap = fs.readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

const EXPECTED_INDEXABLE_POSITIONS = [
  "protect-unborn-life",
  "gun-rights-over-gun-control",
  "eliminate-property-taxes",
  "lower-taxes-limited-government",
  "parental-rights-school-choice",
  "secure-texas-border",
].sort();

describe("AdSense Texas Case editorial and agency indexability", () => {
  it("keeps only substantive, sourced Texas Case editorials indexable", () => {
    expect(MIN_TEXAS_CASE_POSITION_WORDS).toBe(700);
    expect(TEXAS_CASE_POSITIONS.filter(isTexasCasePositionIndexable).map((position) => position.slug).sort()).toEqual(EXPECTED_INDEXABLE_POSITIONS);
  });

  it("keeps current thin agency profiles out of the indexable cohort", () => {
    expect(MIN_AGENCY_AUTHORITY_WORDS).toBe(700);
    expect(AGENCY_AUTHORITY_PROFILES.filter(isAgencyAuthorityIndexable)).toEqual([]);
  });

  it("uses readiness for direct-route robots metadata", () => {
    expect(positionRoute).toContain("isTexasCasePositionIndexable(loaderData.position)");
    expect(agencyRoute).toContain("isAgencyAuthorityIndexable(loaderData)");
    expect(positionRoute).toContain('"noindex,follow"');
    expect(agencyRoute).toContain('"noindex,follow"');
  });

  it("uses the exact same readiness-filtered cohorts in sitemap-pages", () => {
    expect(sitemap).toContain("const INDEXABLE_TEXAS_CASE_POSITIONS = TEXAS_CASE_POSITIONS.filter(isTexasCasePositionIndexable)");
    expect(sitemap).toContain("const INDEXABLE_AGENCY_AUTHORITY_PROFILES = AGENCY_AUTHORITY_PROFILES.filter(isAgencyAuthorityIndexable)");
    expect(sitemap).toContain("...INDEXABLE_TEXAS_CASE_POSITIONS.map((position)=>`/texas-case/${position.slug}`)");
    expect(sitemap).toContain("...INDEXABLE_AGENCY_AUTHORITY_PROFILES.map((agency)=>`/texas-government/agencies/${agency.slug}`)");
    expect(sitemap).not.toContain("...TEXAS_CASE_POSITIONS.map((position)=>`/texas-case/${position.slug}`)");
    expect(sitemap).not.toContain("...AGENCY_AUTHORITY_PROFILES.map((agency)=>`/texas-government/agencies/${agency.slug}`)");
    expect(sitemap).toContain("const INDEXABLE_TEXAS_CASE_FACTS = TEXAS_CASE_FACTS.filter(isTexasCaseFactsIndexable)");
  });
});
