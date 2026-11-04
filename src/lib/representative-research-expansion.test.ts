import { describe, expect, it } from "vitest";
import { findRepresentativeBySlug } from "@/data/representatives";
import { getRepresentativeAuthority } from "@/data/representative-authority";
import {
  SIX_PROFILE_PILOT,
  SCRIPT2_REVIEWED_SLUGS,
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

  it("requires all six genuine quality gates for thirty individually reviewed expansion profiles", () => {
    expect(SCRIPT2_REVIEWED_SLUGS).toHaveLength(30);
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

  it("never mistakes bulk bill records for completed editorial review", () => {
    const slug = "cody-vasut";
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
