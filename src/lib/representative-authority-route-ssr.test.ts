import { readFileSync } from "node:fs";
import { TEXAS_LEGISLATORS } from "@/data/texas-legislators.generated";
import { describe, expect, it } from "vitest";
import {
  ALL_REPRESENTATIVE_AUTHORITY,
  getRepresentativeAuthority,
  getHouseCommitteeAssignments,
} from "@/data/representative-authority";

const read = (path: string) => readFileSync(path, "utf8");
const route = read("src/routes/representatives.$representativeSlug.tsx");
const server = read("src/lib/representative-authority-route.functions.ts");

describe("Texas congressional and legislative authority SSR payload boundary", () => {
  it("preserves the original complete, sourced collection with exact server lookups", () => {
    expect(ALL_REPRESENTATIVE_AUTHORITY).toHaveLength(46 + TEXAS_LEGISLATORS.length);
    expect(getRepresentativeAuthority("john-cornyn")?.sources.length).toBeGreaterThan(0);
    expect(getHouseCommitteeAssignments("dan-crenshaw").length).toBeGreaterThan(0);
    expect(server).toContain('import("@/data/representative-authority")');
    expect(server).toContain('import("@/lib/representative-quality-gates")');
    expect(server).toContain("certifyRepresentative({");
    expect(server).toContain("primarySourceResearch: pilotResearchFor(data.slug)");
    expect(server).toContain("getRepresentativeAuthority(data.slug)");
    expect(server).toContain("getHouseCommitteeAssignments(data.slug)");
    expect(route).not.toContain('from "@/data/representative-authority"');
  });

  it("retains server-rendered profile, canonical and authority-section delivery", () => {
    expect(route).toContain("getRepresentativeAuthorityRouteData({");
    expect(route).toContain("temporaryDataOutage: legislation === null");
    expect(route).toContain("certification, primarySourceResearch");
    expect(route).not.toContain('from "@/lib/representative-quality-gates"');
    expect(route).toContain("legislationUnavailable: legislation === null");
    expect(route).toContain("if (!directoryRepresentative && !legislation?.identity) throw notFound()");
    expect(route).toContain('links: [{ rel: "canonical", href: canonical }]');
    for (const label of ["WebPage", "Person", "BreadcrumbList"]) {
      expect(route).toContain(`"@type": "${label}"`);
    }
    expect(route).toContain("getRepresentativeLegislation");
    expect(route).toContain("getRelatedAuthorityContent");
    expect(route).toContain("houseCommittees, news, relatedContent");
    expect(route).toContain('loaderData.certification.state === "AUTHORITY_READY"');
    expect(route).not.toContain('"@type": "ProfilePage"');
  });
});
