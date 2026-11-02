import { describe, expect, it } from "vitest";
import { sortRaceCandidatesByParty } from "./candidate-display-order";

describe("sortRaceCandidatesByParty", () => {
  it("places Republicans first, Democrats second, and other candidates afterwards", () => {
    const original = [
      { name: "Independent A", party: "independent" },
      { name: "Democrat A", party: "Democratic" },
      { name: "Republican A", party: "republican" },
      { name: "Libertarian A", party: "libertarian" },
      { name: "Republican B", party: "Republican" },
      { name: "Democrat B", party: "Democrat" },
      { name: "Unknown A", party: null },
    ] as const;

    const ordered = sortRaceCandidatesByParty(original, (candidate) => candidate.party);
    expect(ordered.map((candidate) => candidate.name)).toEqual([
      "Republican A",
      "Republican B",
      "Democrat A",
      "Democrat B",
      "Independent A",
      "Libertarian A",
      "Unknown A",
    ]);
    // The imported ballot list is still in its original order.
    expect(original[0].name).toBe("Independent A");
    expect(original[2].name).toBe("Republican A");
  });

  it("retains order within the same party and handles absent party labels", () => {
    const records = [
      { name: "Unspecified", partyLabel: undefined },
      { name: "Democratic Candidate", partyLabel: "Democratic" },
      { name: "Republican Candidate", partyLabel: "Republican Party" },
      { name: "Write-in Candidate", partyLabel: "Write-in" },
    ];
    expect(
      sortRaceCandidatesByParty(records, (candidate) => candidate.partyLabel).map((candidate) => candidate.name),
    ).toEqual(["Republican Candidate", "Democratic Candidate", "Unspecified", "Write-in Candidate"]);
  });
});
