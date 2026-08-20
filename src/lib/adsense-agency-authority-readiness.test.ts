import { describe, expect, it } from "vitest";
import { AGENCY_AUTHORITY_PROFILES } from "@/data/agency-authority";

const MIN_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

describe("AdSense agency authority readiness inventory", () => {
  it("keeps every sitemap-advertised agency profile substantive and source-backed", () => {
    const violations = AGENCY_AUTHORITY_PROFILES.flatMap((profile) => {
      const count = words([
        profile.name,
        profile.dek,
        profile.quickAnswer,
        profile.authority,
        ...profile.responsibilities,
        ...profile.notResponsibleFor,
        ...profile.accountability,
        ...profile.programs,
        ...profile.sources.map((source) => source.label),
      ].join(" "));
      const blockers: string[] = [];
      if (count < MIN_WORDS) blockers.push(`words=${count}<${MIN_WORDS}`);
      if (profile.sources.length < 3) blockers.push(`sources=${profile.sources.length}<3`);
      if (profile.sources.filter((source) => source.primary).length < 2) blockers.push("primary-sources<2");
      if (profile.responsibilities.length < 4) blockers.push(`responsibilities=${profile.responsibilities.length}<4`);
      if (profile.notResponsibleFor.length < 3) blockers.push(`limits=${profile.notResponsibleFor.length}<3`);
      return blockers.length ? [`${profile.slug}: ${blockers.join(", ")}`] : [];
    });
    expect(violations, violations.join("\n")).toEqual([]);
  });
});
