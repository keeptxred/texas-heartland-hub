import { describe, expect, it } from "vitest";
import { findRepresentativeBySlug } from "@/data/representatives";
import { getRepresentativeAuthority } from "@/data/representative-authority";
import {
  SIX_PROFILE_PILOT,
  SCRIPT2_REVIEWED_SLUGS,
  EDITORIAL_REVIEWS,
  applyPilotEditorial,
  certifyRepresentative,
  pilotResearchFor,
} from "@/lib/representative-quality-gates";

const certificationFor = (slug: string) => certifyRepresentative({
  slug,
  representative: findRepresentativeBySlug(slug),
  authority: applyPilotEditorial(slug, getRepresentativeAuthority(slug) ?? null),
});

describe("representative Script 2 source-first certification", () => {
  it("preserves the four previously certified pilot profiles", () => {
    for (const slug of SIX_PROFILE_PILOT.slice(0, 4)) {
      const report = certificationFor(slug);
      expect(report.state, slug + ": " + report.reasons.join("; ")).toBe("AUTHORITY_READY");
      expect(Object.values(report.gates).every(Boolean)).toBe(true);
    }
  });

  it("requires all six genuine quality gates for ninety-six individually reviewed expansion profiles", () => {
    expect(SCRIPT2_REVIEWED_SLUGS).toHaveLength(96);
    for (const slug of SCRIPT2_REVIEWED_SLUGS) {
      const records = pilotResearchFor(slug);
      expect(records.length, slug + " evidence").toBeGreaterThanOrEqual(16);
      expect(new Set(records.map((row) => row.sponsor_role)).size, slug).toBeGreaterThanOrEqual(2);
      expect(new Set(records.map((row) => row.current_status_label)).size, slug).toBeGreaterThanOrEqual(2);
      expect(records.every((row) => row.source_url.startsWith(
        "https://capitol.texas.gov/BillLookup/History.aspx?"
      )), slug + " official source links").toBe(true);
      const report = certificationFor(slug);
      expect(report.state, slug + ": " + report.reasons.join("; ")).toBe("AUTHORITY_READY");
      expect(Object.values(report.gates).every(Boolean), slug).toBe(true);
    }
  });

  it("keeps House 62, 65 and 66 source-identity corrections mandatory", () => {
    for (const [slug, memberId] of [
      ["shelley-luther", "4645"],
      ["mitch-little", "4615"],
      ["matt-shaheen", "2995"],
    ]) {
      expect(SCRIPT2_REVIEWED_SLUGS).toContain(slug);
      const report = certificationFor(slug);
      expect(report.state, slug + ": " + report.reasons.join("; ")).toBe("AUTHORITY_READY");
      expect(report.officialSource).toMatch(/^https:\/\//);
      expect(findRepresentativeBySlug(slug)?.website).toBe("https://house.texas.gov/members/" + memberId);
    }
  });

  it("requires current official identity and four distinct role samples for House 71–74", () => {
    const expected = [
      ["stan-lambert", "3225"],
      ["drew-darby", "2645"],
      ["carrie-isaac", "4265"],
      ["eddie-morales", "4000"],
    ];
    for (const [slug, officialId] of expected) {
      expect(SCRIPT2_REVIEWED_SLUGS).toContain(slug);
      expect(findRepresentativeBySlug(slug)?.website).toBe(
        "https://house.texas.gov/members/" + officialId
      );
      const records = pilotResearchFor(slug);
      expect(records).toHaveLength(32);
      expect(new Set(records.map((row) => row.sponsor_role))).toEqual(
        new Set(["author", "coauthor", "sponsor", "cosponsor"])
      );
      expect(new Set(records.map((row) => row.bill_id + ":" + row.sponsor_role)).size).toBe(32);
      expect(new Set(records.map((row) => row.current_status_label)).size).toBeGreaterThan(1);
      const certification = certificationFor(slug);
      expect(certification.state, slug + ": " + certification.reasons.join("; ")).toBe("AUTHORITY_READY");
      expect(Object.values(certification.gates).every(Boolean)).toBe(true);
    }
  });

  it("certifies House 75–82 only when primary identity, unique bill evidence, and all A–F gates pass", () => {
    const entries: readonly [string, string][] = [
      ["mary-gonzalez", "2410"],
      ["suleman-lalani", "4285"],
      ["vince-perez", "4710"],
      ["joe-moody", "3850"],
      ["claudia-ordaz", "4015"],
      ["don-mclaughlin", "4655"],
      ["brooks-landgraf", "3040"],
      ["tom-craddick", "2610"],
    ];
    for (const [slug, officialId] of entries) {
      expect(SCRIPT2_REVIEWED_SLUGS).toContain(slug);
      expect(findRepresentativeBySlug(slug)?.website).toBe(
        "https://house.texas.gov/members/" + officialId
      );
      const source = EDITORIAL_REVIEWS[slug];
      expect(source?.officialUrl).toBe("https://house.texas.gov/members/" + officialId);
      expect(source?.identityChecked).toBe("2026-11-05");
      expect(source?.biography.length, slug).toBeGreaterThan(180);
      const records = pilotResearchFor(slug);
      expect(records.length, slug + " official histories").toBeGreaterThanOrEqual(16);
      expect(new Set(records.map(row => row.sponsor_role)).size, slug).toBeGreaterThanOrEqual(2);
      expect(new Set(records.map(row => row.current_status_label)).size, slug).toBeGreaterThanOrEqual(2);
      expect(new Set(records.map(row => row.bill_id + ":" + row.sponsor_role)).size, slug).toBe(records.length);
      expect(records.every(row => row.source_url.startsWith(
        "https://capitol.texas.gov/BillLookup/History.aspx?"
      ))).toBe(true);
      const result = certificationFor(slug);
      expect(result.state, slug + ": " + result.reasons.join("; ")).toBe("AUTHORITY_READY");
      expect(Object.values(result.gates).every(Boolean), slug).toBe(true);
    }
    expect(EDITORIAL_REVIEWS["claudia-ordaz"].biography).toContain("89th Legislature");
    expect(EDITORIAL_REVIEWS["claudia-ordaz"].biography).toContain("Environmental Regulation");
    expect(EDITORIAL_REVIEWS["claudia-ordaz"].biography).not.toContain("vice chair of International Relations");
    expect(EDITORIAL_REVIEWS["don-mclaughlin"].biography).toContain("official House biography contains no substantive text");
  });

  it("never mistakes bulk bill records for completed editorial review", () => {
    const slug = "jeff-barry";
    expect(pilotResearchFor(slug).length).toBeGreaterThanOrEqual(16);
    const report = certificationFor(slug);
    expect(report.state).toBe("NOT_READY");
    expect(report.gates.A).toBe(false);
  });

  it("keeps evidence gaps and federal exceptions outside authority indexing", () => {
    for (const slug of ["dustin-burrows", "brett-ligon", "taylor-rehmet",
      "dan-crenshaw", "john-cornyn", "ted-cruz"]) {
      expect(pilotResearchFor(slug), slug).toHaveLength(0);
      expect(certificationFor(slug).state, slug).not.toBe("AUTHORITY_READY");
    }
  });
});
