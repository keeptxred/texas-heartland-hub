import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const server = readFileSync(resolve(process.cwd(), "src/lib/elections/election-district-detail.functions.ts"), "utf8");

const route = readFileSync(
  resolve(process.cwd(), "src/routes/elections.districts.$districtSlug.tsx"),
  "utf8",
);

describe("election district authority template", () => {
  it("uses verified race and candidate records", () => {
    expect(route).toContain("getElectionDistrictDetailSnapshot");
    expect(server).toContain('publicationStatus === "published"');
    expect(server).toContain('verificationStatus === "verified"');
    expect(route).toContain('to="/elections/candidates/$candidateSlug"');
    expect(route).toContain('to="/elections/races/$raceSlug"');
  });

  it("uses the shared Republican-first party order in both rendered cards and JSON-LD", () => {
    // The server projection feeds both consumers, preventing divergent ordering.
    expect(server).toContain('import { sortRaceCandidatesByParty } from "./candidate-display-order"');
    expect(server).toContain("candidates: sortRaceCandidatesByParty(");
    expect(server).toContain("(candidate) => candidate.party,");
    expect(route).toContain("const raceCandidates = snapshot.candidates;");
    expect(route).toContain("itemListElement: raceCandidates.map((candidate, index) => ({");
    expect(route).toContain("{raceCandidates.map((candidate) => (");
  });

  it("publishes geography, official-source, and candidate structured data", () => {
    expect(route).toContain('"@type": "AdministrativeArea"');
    expect(route).toContain('"@type": "Event"');
    expect(route).toContain('"@type": "ItemList"');
    expect(route).toContain("geographySource.sourceUrl");
    expect(route).toContain("countyElectionLinkSource.sourceUrl");
  });

  it("cross-links district authority resources", () => {
    for (const path of [
      "/register-to-vote",
      "/elections/voting",
      "/find-representative",
      "/county-elections",
    ]) {
      expect(route).toContain(path);
    }
  });
});
