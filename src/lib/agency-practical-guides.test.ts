import { describe, expect, it } from "vitest";
import { getAgencyAuthorityProfile } from "@/data/agency-authority";
import { upgradeAgencyAuthorityProfile } from "@/data/agency-authority-upgrades";
import { getAgencyPracticalGuide } from "@/data/agency-practical-guides";
import { isAgencyAuthorityIndexable } from "@/lib/agency-authority-indexability";

describe("reviewed agency practical authority", () => {
  it.each(["texas-department-public-safety", "health-human-services-commission", "texas-commission-environmental-quality"])("publishes distinct cited service pathways for %s", (slug) => {
    const base = getAgencyAuthorityProfile(slug)!;
    const profile = upgradeAgencyAuthorityProfile(base);
    expect(profile.reviewed).toBe("2026-11-25");
    expect(upgradeAgencyAuthorityProfile(profile)).toEqual(profile);
    expect(isAgencyAuthorityIndexable(profile)).toBe(true);
    const guides = getAgencyPracticalGuide(slug);
    expect(guides.length).toBeGreaterThanOrEqual(5);
    expect(new Set(guides.map(g => g.url)).size).toBe(guides.length);
    for (const guide of guides) {
      expect(profile.sources.some(source => source.url === guide.url && source.primary)).toBe(true);
      expect(guide.explanation.length).toBeGreaterThan(70);
    }
  });
  it("uses the current HHSC chapter and separates appeals from complaints", () => {
    const profile = upgradeAgencyAuthorityProfile(getAgencyAuthorityProfile("health-human-services-commission")!);
    expect(profile.authority).toContain("Chapter 523");
    expect(profile.authority).not.toContain("Chapter 531 and related health statutes");
    expect(profile.sources.some(source => source.url.includes("GV.523.pdf"))).toBe(true);
    expect(getAgencyPracticalGuide(profile.slug).some(g => g.url.endsWith("/fair-fraud-hearings"))).toBe(true);
  });
  it("does not relabel other agencies as newly reviewed", () => {
    expect(upgradeAgencyAuthorityProfile(getAgencyAuthorityProfile("texas-education-agency")!).reviewed).toBe("2026-08-20");
    expect(getAgencyPracticalGuide("texas-education-agency")).toEqual([]);
  });
});
