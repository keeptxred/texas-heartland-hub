import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_CASE_POSITIONS } from "@/data/texas-case-all";
import { AGENCY_AUTHORITY_PROFILES } from "@/data/agency-authority";
import { upgradeAgencyAuthorityProfiles } from "@/data/agency-authority-upgrades";
import { isTexasCasePositionIndexable, MIN_TEXAS_CASE_POSITION_WORDS } from "@/lib/texas-case-position-indexability";
import { agencyAuthorityWordCount, isAgencyAuthorityIndexable, MIN_AGENCY_AUTHORITY_WORDS } from "@/lib/agency-authority-indexability";

const texasCaseRoute = readFileSync(new URL("../routes/texas-case.$slug.tsx", import.meta.url), "utf8");
const agencyRoute = readFileSync(new URL("../routes/texas-government.agencies.$agencySlug.tsx", import.meta.url), "utf8");
const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

const EXPECTED_PRIORITY_POSITION_SLUGS = [
  "protect-unborn-life",
  "gun-rights-over-gun-control",
  "eliminate-property-taxes",
];

const EXPECTED_AGENCY_SLUGS = [
  "texas-education-agency",
  "texas-department-public-safety",
  "public-utility-commission",
  "ercot",
  "texas-department-transportation",
  "texas-commission-environmental-quality",
  "health-human-services-commission",
  "railroad-commission",
  "texas-water-development-board",
];

describe("AdSense Texas Case position and agency authority indexability", () => {
  it("indexes only the genuinely expanded 1,000-word Texas Case position cohort", () => {
    expect(MIN_TEXAS_CASE_POSITION_WORDS).toBe(1000);
    const indexableSlugs = TEXAS_CASE_POSITIONS.filter(isTexasCasePositionIndexable).map((position) => position.slug);
    expect(indexableSlugs).toEqual(EXPECTED_PRIORITY_POSITION_SLUGS);

    const remaining = TEXAS_CASE_POSITIONS.filter((position) => !EXPECTED_PRIORITY_POSITION_SLUGS.includes(position.slug));
    expect(remaining).toHaveLength(15);
    expect(remaining.filter(isTexasCasePositionIndexable)).toEqual([]);
  });

  it("makes every expanded agency authority profile genuinely index-ready", () => {
    expect(MIN_AGENCY_AUTHORITY_WORDS).toBe(700);
    const expanded = upgradeAgencyAuthorityProfiles(AGENCY_AUTHORITY_PROFILES);
    expect(expanded.map((profile) => profile.slug)).toEqual(EXPECTED_AGENCY_SLUGS);
    for (const profile of expanded) {
      expect(agencyAuthorityWordCount(profile), `${profile.slug}: substantive word count`).toBeGreaterThanOrEqual(MIN_AGENCY_AUTHORITY_WORDS);
      expect(profile.sources.length, `${profile.slug}: source count`).toBeGreaterThanOrEqual(3);
      expect(profile.sources.filter((source) => source.primary).length, `${profile.slug}: primary source count`).toBeGreaterThanOrEqual(2);
      expect(isAgencyAuthorityIndexable(profile), `${profile.slug}: readiness`).toBe(true);
    }
  });

  it("uses the same expanded readiness for robots and sitemap discovery", () => {
    expect(texasCaseRoute).toContain('isTexasCasePositionIndexable(loaderData.position)');
    expect(texasCaseRoute).toContain('"noindex,follow"');
    expect(agencyRoute).toContain('upgradeAgencyAuthorityProfile(baseProfile)');
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
