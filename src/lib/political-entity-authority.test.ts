import { describe, expect, it } from "vitest";
import {
  validatePoliticalAuthority,
  validatePoliticalEntityClaims,
} from "./political-entity-authority";

const JAMES_ID = "candidate-james-talarico-democratic-race-2026-us-senate";

describe("political authority validation", () => {
  it("blocks the known state race-level and district misclassification", () => {
    const result = validatePoliticalEntityClaims(
      "James Talarico is vying for Texas Senate District 8 in the 2026 election.",
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/office or race level|wrong district/i);
  });

  it("accepts a body-grounded, correctly identified federal race", () => {
    const result = validatePoliticalAuthority({
      headline: "Paxton and Talarico contest draws attention",
      body: "Republican Ken Paxton and Democratic James Talarico are competing in the 2026 Texas U.S. Senate election.",
    });
    expect(result.valid).toBe(true);
    expect(result.resolvedCandidateIds).toContain(JAMES_ID);
  });

  it("does not confuse a candidate's current officeholder title with the office sought", () => {
    const result = validatePoliticalAuthority({
      headline: "Ken Paxton unveils economic plan centered on tax breaks in U.S. Senate race",
      body: "Texas Attorney General Ken Paxton unveiled an economic plan for his campaign.",
    });
    expect(result.valid).toBe(true);
  });

  it("still blocks a claim that the candidate is seeking the wrong office", () => {
    const result = validatePoliticalEntityClaims(
      "Ken Paxton is running for Texas Attorney General in the 2026 election.",
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/office or race level/i);
  });

  it("never resolves a political identity from a headline alone", () => {
    const result = validatePoliticalAuthority({
      headline: "James Talarico launches a new campaign message",
      body: "The campaign released a new video Tuesday, but the supplied source body did not identify the person.",
    });
    expect(result.valid).toBe(false);
    expect(result.resolvedCandidateIds).toEqual([]);
    expect(result.errors.join(" ")).toMatch(/Headline-only political identity/i);
  });

  it("requires an exact candidate ID for structured candidate assertions", () => {
    const result = validatePoliticalAuthority({
      headline: "Campaign update",
      body: "An election campaign issued an update.",
      assertions: [{ relation: "candidate", personName: "James Talarico" }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/candidateId is required/i);
  });

  it("validates candidate ID, party, office, level, district, race, and year together", () => {
    const valid = validatePoliticalAuthority({
      headline: "Campaign update",
      body: "James Talarico is a Democratic candidate in the 2026 U.S. Senate election.",
      assertions: [
        {
          relation: "candidate",
          candidateId: JAMES_ID,
          personName: "James Talarico",
          party: "Democratic",
          office: "U.S. Senate",
          officeLevel: "federal",
          district: "statewide",
          electionYear: 2026,
          raceId: "race-2026-us-senate",
        },
      ],
    });
    expect(valid.valid).toBe(true);

    const invalid = validatePoliticalAuthority({
      headline: "Campaign update",
      body: "James Talarico issued a campaign update.",
      assertions: [
        {
          relation: "candidate",
          candidateId: JAMES_ID,
          party: "Republican",
          office: "Texas Senate",
          officeLevel: "state",
          district: 8,
          electionYear: 2028,
          raceId: "race-2028-texas-senate-8",
        },
      ],
    });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.join(" ")).toMatch(/party|conflicts/i);
  });

  it("validates current officeholder office, district, and party", () => {
    const valid = validatePoliticalAuthority({
      headline: "Congressional update",
      body: "Representative Dan Crenshaw discussed the issue.",
      assertions: [
        {
          relation: "officeholder",
          personName: "Dan Crenshaw",
          office: "U.S. House",
          party: "Republican",
          district: "TX-2",
        },
      ],
    });
    expect(valid.valid).toBe(true);

    const invalid = validatePoliticalAuthority({
      headline: "Congressional update",
      body: "Representative Dan Crenshaw discussed the issue.",
      assertions: [
        {
          relation: "officeholder",
          personName: "Dan Crenshaw",
          office: "Texas Senate",
          party: "Democratic",
          district: 8,
        },
      ],
    });
    expect(invalid.valid).toBe(false);
  });
});
