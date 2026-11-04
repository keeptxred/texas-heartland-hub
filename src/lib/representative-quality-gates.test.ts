import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getRepresentativeAuthority } from "@/data/representative-authority";
import { findRepresentativeBySlug } from "@/data/representatives";
import pilot from "@/data/representative-research-pilot.json";
import {
  SIX_PROFILE_PILOT, applyPilotEditorial, certifyRepresentative, pilotResearchFor,
} from "@/lib/representative-quality-gates";

const route = readFileSync("src/routes/representatives.$representativeSlug.tsx", "utf8");
const representativeSitemap = readFileSync("src/routes/sitemap-representatives[.]xml.ts", "utf8");
const index = readFileSync("src/routes/sitemap[.]xml.ts", "utf8");

function certify(slug: string) {
  return certifyRepresentative({
    slug,
    representative: findRepresentativeBySlug(slug),
    authority: applyPilotEditorial(slug, getRepresentativeAuthority(slug) ?? null),
  });
}

describe("Representative authority: six profile rollout with real official research evidence", () => {
  it("evaluates exactly six diverse pilot profiles and leaves uncaptured federal research unready", () => {
    expect(SIX_PROFILE_PILOT).toHaveLength(6);
    expect(new Set(SIX_PROFILE_PILOT).size).toBe(6);
    for (const slug of ["dan-crenshaw", "john-cornyn"]) {
      const result = certify(slug);
      expect(result.state).toBe("NOT_READY");
      expect(result.gates.B).toBe(false);
      expect(result.reasons.some((reason) => reason.startsWith("B:"))).toBe(true);
    }
  });

  it("requires six real gates for each reviewed state lawmaker, with official history URLs and date evidence", () => {
    for (const slug of ["bryan-hughes", "judith-zaffirini", "terri-leo-wilson", "mihaela-plesa"]) {
      const cert = certify(slug);
      expect(cert.state, slug + " " + cert.reasons.join("; ")).toBe("AUTHORITY_READY");
      expect(Object.values(cert.gates).every(Boolean)).toBe(true);
      expect(cert.evidenceCount).toBe(32);
      expect(cert.researchCapture).toBe(pilot.capturedAt);
      expect(cert.officialSource).toMatch(/^https:\/\//);
      const records = pilotResearchFor(slug);
      expect(new Set(records.map((entry) => entry.sponsor_role))).toEqual(
        new Set(["author", "coauthor", "sponsor", "cosponsor"])
      );
      expect(new Set(records.map((entry) => entry.current_status_label)).size).toBeGreaterThan(1);
      expect(records.every((entry) => entry.source_url.includes("capitol.texas.gov/BillLookup/History.aspx"))).toBe(true);
      expect(records.every((entry) => Number.isFinite(Date.parse(entry.last_synced_at)))).toBe(true);
    }
  });

  it("fails closed on identity conflict instead of treating a rendered page as verified", () => {
    const slug = "bryan-hughes";
    const rep = findRepresentativeBySlug(slug)!;
    const authority = applyPilotEditorial(slug, getRepresentativeAuthority(slug) ?? null);
    expect(certifyRepresentative({
      slug, representative: { ...rep, district: "Senate District 2" }, authority,
    }).state).toBe("VERIFICATION_FAILED");
    expect(certifyRepresentative({ slug, representative: rep, authority: null }).state).toBe("NOT_READY");
    expect(certifyRepresentative({
      slug, representative: rep, authority,
      temporaryDataOutage: true,
    }).state).toBe("AUTHORITY_READY");
  });

  it("never promotes unreviewed generic profiles or mistakes a missing record for no legislative work", () => {
    const generic = certify("greg-abbott");
    expect(generic.state).toBe("NOT_READY");
    expect(generic.evidenceCount).toBe(0);
    expect(route).toContain("legislationUnavailable");
    expect(route).toContain("noindex,follow");
    expect(route).toContain("loaderData.certification.state === \"AUTHORITY_READY\"");
  });

  it("keeps canonical, sitemap and indexability aligned and excludes ProfilePage markup", () => {
    expect(route).toContain('links: [{ rel: "canonical", href: canonical }]');
    expect(route).toContain('"@type": "WebPage"');
    expect(route).not.toContain('"@type": "ProfilePage"');
    expect(representativeSitemap).toContain("certifyRepresentative({");
    expect(representativeSitemap).toContain('state === "AUTHORITY_READY"');
    expect(index).toContain('"sitemap-representatives.xml"');
    const owners = ["bryan-hughes", "judith-zaffirini", "terri-leo-wilson", "mihaela-plesa"];
    for (const slug of owners) expect(certify(slug).state).toBe("AUTHORITY_READY");
  });

  it("retains bounded original role-specific evidence and rejects duplicated source entries", () => {
    expect(pilot.records.length).toBe(128);
    expect(pilot.source).toContain("bill_sponsors");
    expect(new Set(pilot.records.map((item) => item.sponsor_slug + ":" + item.sponsor_role + ":" + item.bill_id)).size).toBe(pilot.records.length);
    const summaries = ["bryan-hughes", "judith-zaffirini", "terri-leo-wilson", "mihaela-plesa"]
      .map((slug) => applyPilotEditorial(slug, getRepresentativeAuthority(slug) ?? null)!.biography);
    expect(new Set(summaries).size).toBe(4);
  });
});
