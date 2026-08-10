import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const route = readFileSync(
  resolve(process.cwd(), "src/routes/elections.races_.$raceSlug.tsx"),
  "utf8",
);
const authority = readFileSync(
  resolve(process.cwd(), "src/components/elections/races/RaceAuthoritySection.tsx"),
  "utf8",
);

describe("race authority template", () => {
  it("renders the authority section on every published race", () => {
    expect(route).toContain("<RaceAuthoritySection");
    expect(route).toContain("official sources for");
  });

  it("shows election dates, geography, and primary sources", () => {
    for (const value of [
      "registrationDeadline",
      "earlyVotingStart",
      "earlyVotingEnd",
      "electionDate",
      "race.counties",
      "race.source.sourceUrl",
      "race.geographySource.sourceUrl",
      "race.countyElectionLinkSource.sourceUrl",
    ]) {
      expect(authority).toContain(value);
    }
  });

  it("links legislative races directly to district authority pages", () => {
    expect(authority).toContain('to="/elections/districts/$districtSlug"');
    expect(authority).toContain("congressional-district-");
    expect(authority).toContain("texas-house-district-");
    expect(authority).toContain("texas-senate-district-");
  });
});
