import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const manifest = JSON.parse(
  readFileSync(new URL("../../public/citation-magnets.json", import.meta.url), "utf8"),
) as {
  schemaVersion: number;
  canonicalDomain: string;
  resources: Array<{ url: string; title: string; type: string; topic: string; trust: string[]; machineResource?: string }>;
};
const llms = readFileSync(new URL("../../public/llms.txt", import.meta.url), "utf8");
const pagesSitemap = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const electionSitemap = readFileSync(new URL("./elections/sitemap.ts", import.meta.url), "utf8");
const trustPanel = readFileSync(new URL("../components/authority/CitationTrustPanel.tsx", import.meta.url), "utf8");
const currentSession = readFileSync(new URL("../components/legislature/CurrentSessionAuthorityReference.tsx", import.meta.url), "utf8");
const governmentHub = readFileSync(new URL("../routes/texas-government.index.tsx", import.meta.url), "utf8");
const voting = readFileSync(new URL("../routes/elections.voting.tsx", import.meta.url), "utf8");
const voterId = readFileSync(new URL("../components/elections/voting/TexasVoterIdReference.tsx", import.meta.url), "utf8");
const districts = readFileSync(new URL("../routes/elections.districts.index.tsx", import.meta.url), "utf8");
const votes = readFileSync(new URL("../routes/texas-legislature.votes.tsx", import.meta.url), "utf8");
const amendments = readFileSync(new URL("../routes/laws_.constitutional-amendments.tsx", import.meta.url), "utf8");
const effectiveDates = readFileSync(new URL("../routes/laws_.effective-dates.tsx", import.meta.url), "utf8");
const billRelationships = readFileSync(new URL("../components/bills/BillEditorialExplanation.tsx", import.meta.url), "utf8");
const raceRelationships = readFileSync(new URL("../components/elections/races/RaceRelationshipMap.tsx", import.meta.url), "utf8");

describe("citation magnet discovery and extraction contracts", () => {
  it("keeps a canonical machine-readable citation manifest", () => {
    expect(manifest.schemaVersion).toBe(1);
    expect(manifest.canonicalDomain).toBe("https://keeptxred.com");
    expect(manifest.resources.length).toBeGreaterThanOrEqual(20);

    const urls = manifest.resources.map((resource) => resource.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const resource of manifest.resources) {
      expect(resource.url.startsWith("https://keeptxred.com/")).toBe(true);
      expect(resource.title.length).toBeGreaterThan(3);
      expect(resource.type.length).toBeGreaterThan(2);
      expect(resource.topic.length).toBeGreaterThan(2);
      expect(resource.trust.length).toBeGreaterThan(0);
      expect(llms).toContain(new URL(resource.url).pathname);
    }
  });

  it("keeps the policy library in citation discovery", () => {
    const policy = manifest.resources.find((resource) => resource.url === "https://keeptxred.com/policy");
    expect(policy?.type).toBe("policy-reference-hub");
    expect(policy?.machineResource).toBe("https://keeptxred.com/policy-trackers.txt");
    expect(llms).toContain("/policy-trackers.txt");
  });

  it("keeps the visible trust vocabulary stable", () => {
    expect(trustPanel).toContain(">Sources<");
    expect(trustPanel).toContain(">Methodology<");
    expect(trustPanel).toContain(">Last verified<");
  });

  it("keeps new law, government, and vote references in the governed page sitemap", () => {
    for (const path of [
      "/texas-legislature/votes",
      "/texas-government",
      "/texas-government/agencies",
      "/laws/constitutional-amendments",
      "/laws/effective-dates",
    ]) {
      expect(pagesSitemap).toContain(`\"${path}\"`);
    }
  });

  it("keeps election citation hubs in the election sitemap architecture", () => {
    for (const routeKey of ["ELECTION_ROUTES.root", "ELECTION_ROUTES.races", "ELECTION_ROUTES.statewide", "ELECTION_ROUTES.districts", "ELECTION_ROUTES.candidates", "ELECTION_ROUTES.polls", "ELECTION_ROUTES.results", "ELECTION_ROUTES.voting"]) {
      expect(electionSitemap).toContain(routeKey);
    }
  });

  it("keeps citation magnets linked from authority hubs", () => {
    expect(currentSession).toContain('href="/texas-legislature/votes"');
    expect(currentSession).toContain('href="/laws/effective-dates"');
    expect(currentSession).toContain('href="/laws/constitutional-amendments"');
    expect(governmentHub).toContain('href="/texas-government/agencies"');
  });

  it("keeps direct-answer and relationship extraction layers intact", () => {
    expect(voting).toContain("2026 Texas election dates");
    expect(voterId).toContain("Seven acceptable photo IDs");
    expect(districts).toContain("2026 race →");
    expect(votes).toContain("does not establish a member-by-member position or vote margin");
    expect(amendments).toContain("No statewide constitutional-amendment slate is currently published");
    expect(effectiveDates).toContain("September 1, 2026");
    expect(billRelationships).toContain("Bill → law → agency context");
    expect(billRelationships).toContain("does not by itself prove that the agency administers the resulting law");
    expect(raceRelationships).toContain("Election → candidate → district");
  });

  it("keeps the constitutional amendment reference fresh, source-rich, and connected", () => {
    expect(amendments).toContain("verified September 7, 2026");
    expect(amendments).toContain("Article XVII of the Texas Constitution");
    expect(amendments).toContain("adopted 16 of the 17 proposed amendments");
    expect(amendments).toContain("When does an approved Texas constitutional amendment take effect?");
    expect(amendments).toContain("Texas constitutional amendment FAQ");
    for (const path of ["/laws/effective-dates", "/laws/topics", "/elections/2026", "/elections/voting", "/texas-legislature", "/bills"]) {
      expect(amendments).toContain(`to=\"${path}\"`);
    }
    for (const officialSource of [
      "advisory2026-21-november-3-election-law-calendar.shtml",
      "CN.17.pdf",
      "constitutional-amendment-elections.shtml",
      "canvasdt.shtml",
      "analyses25.pdf",
      "062525.shtml",
      "December52025/The%20Governor/The%20Governor.html",
    ]) {
      expect(amendments).toContain(officialSource);
    }
  });

  it("retains explicit no-inference guardrails", () => {
    expect(votes).toContain("does not infer vote totals or individual member positions");
    expect(voting).toContain("do not determine an address-specific ballot");
    expect(districts).toContain("Missing race links are left missing rather than inferred");
    expect(llms).toContain("Do not infer missing vote tallies, administering agencies, voter-specific eligibility, address-specific ballots, or unpublished election relationships.");
  });
});
