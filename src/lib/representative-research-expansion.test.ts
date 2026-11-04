import { describe, expect, it } from "vitest";
import { findRepresentativeBySlug } from "@/data/representatives";
import { getRepresentativeAuthority } from "@/data/representative-authority";
import {
  SIX_PROFILE_PILOT,
  applyPilotEditorial,
  certifyRepresentative,
  pilotResearchFor,
} from "@/lib/representative-quality-gates";

/**
 * Script 2 may surface historical legislative research without certifying an
 * officeholder's identity, biographical distinctiveness or live status.
 * No unreviewed person may become indexable solely because bill rows exist.
 */
describe("expanded representative evidence stays fail-closed", () => {
  it("retains the four certified pilot identities", () => {
    for (const slug of SIX_PROFILE_PILOT.slice(0, 4)) {
      const authority = applyPilotEditorial(slug, getRepresentativeAuthority(slug) ?? null);
      expect(certifyRepresentative({
        slug,
        representative: findRepresentativeBySlug(slug),
        authority,
      }).state).toBe("AUTHORITY_READY");
    }
  });

  it("exposes specific official research without inventing editorial approval", () => {
    for (const slug of ["brent-money", "will-metcalf", "cesar-blanco", "tan-parker"]) {
      const records = pilotResearchFor(slug);
      expect(records.length).toBeGreaterThanOrEqual(16);
      expect(new Set(records.map((row) => row.sponsor_role)).size).toBeGreaterThanOrEqual(2);
      expect(records.every((row) => row.source_url.startsWith(
        "https://capitol.texas.gov/BillLookup/History.aspx?"
      ))).toBe(true);

      const authority = applyPilotEditorial(slug, getRepresentativeAuthority(slug) ?? null);
      expect(certifyRepresentative({
        slug,
        representative: findRepresentativeBySlug(slug),
        authority,
      }).state).toBe("NOT_READY");
    }
  });

  it("does not make missing sponsorship or federal research appear complete", () => {
    for (const slug of ["dustin-burrows", "brett-ligon", "taylor-rehmet",
      "dan-crenshaw", "john-cornyn", "ted-cruz"]) {
      expect(pilotResearchFor(slug)).toHaveLength(0);
      const authority = applyPilotEditorial(slug, getRepresentativeAuthority(slug) ?? null);
      expect(certifyRepresentative({
        slug,
        representative: findRepresentativeBySlug(slug),
        authority,
      }).state).not.toBe("AUTHORITY_READY");
    }
  });
});
