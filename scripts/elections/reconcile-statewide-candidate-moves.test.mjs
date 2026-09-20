import { describe, expect, it } from "vitest";
import { reconcileStatewideCandidateMoves } from "./reconcile-statewide-candidate-moves.mjs";

const officialSource = {
  source: {
    sourceType: "official_candidate_listing",
    sourceUrl: "https://goelect.txelections.civixapps.com/ivis-cbp-ui/candidate-information",
  },
};

describe("reconcileStatewideCandidateMoves", () => {
  it("removes a stale official statewide assignment when the same candidate moved races", () => {
    const result = reconcileStatewideCandidateMoves({
      candidates: [
        {
          id: "candidate-stephen-samuelson-other-race-2026-governor",
          fullName: "STEPHEN SAMUELSON",
          party: "other",
          primaryRaceId: "race-2026-governor",
          raceIds: ["race-2026-governor"],
          ...officialSource,
        },
        {
          id: "candidate-stephen-samuelson-other-race-2026-lieutenant-governor",
          fullName: "STEPHEN SAMUELSON",
          party: "other",
          primaryRaceId: "race-2026-lieutenant-governor",
          raceIds: ["race-2026-lieutenant-governor"],
          ...officialSource,
        },
      ],
      races: [
        {
          id: "race-2026-governor",
          candidateIds: ["candidate-stephen-samuelson-other-race-2026-governor", "candidate-other"],
          uncontested: false,
        },
        {
          id: "race-2026-lieutenant-governor",
          candidateIds: ["candidate-stephen-samuelson-other-race-2026-lieutenant-governor"],
          uncontested: false,
        },
      ],
      officialRows: [
        {
          fullName: "STEPHEN SAMUELSON",
          officeName: "LIEUTENANT GOVERNOR",
          party: "other",
          status: "write_in",
        },
      ],
    });

    expect(result.removedCandidateIds).toEqual([
      "candidate-stephen-samuelson-other-race-2026-governor",
    ]);
    expect(result.candidates.map((candidate) => candidate.id)).toEqual([
      "candidate-stephen-samuelson-other-race-2026-lieutenant-governor",
    ]);
    expect(result.races[0].candidateIds).toEqual(["candidate-other"]);
  });

  it("preserves a statewide candidate when the official extract still contains that race", () => {
    const candidate = {
      id: "candidate-example-other-race-2026-governor",
      fullName: "EXAMPLE CANDIDATE",
      party: "other",
      primaryRaceId: "race-2026-governor",
      raceIds: ["race-2026-governor"],
      ...officialSource,
    };
    const result = reconcileStatewideCandidateMoves({
      candidates: [candidate],
      races: [{ id: "race-2026-governor", candidateIds: [candidate.id], uncontested: true }],
      officialRows: [{ fullName: "EXAMPLE CANDIDATE", officeName: "GOVERNOR", party: "other" }],
    });

    expect(result.removedCandidateIds).toEqual([]);
    expect(result.candidates).toEqual([candidate]);
  });

  it("does not remove non-official or mixed statewide/local candidate records", () => {
    const manual = {
      id: "candidate-manual",
      fullName: "EXAMPLE CANDIDATE",
      party: "other",
      primaryRaceId: "race-2026-governor",
      raceIds: ["race-2026-governor"],
      source: { sourceType: "editorial" },
    };
    const mixed = {
      id: "candidate-mixed",
      fullName: "EXAMPLE CANDIDATE",
      party: "other",
      primaryRaceId: "race-2026-governor",
      raceIds: ["race-2026-governor", "race-2026-county-example"],
      ...officialSource,
    };
    const result = reconcileStatewideCandidateMoves({
      candidates: [manual, mixed],
      races: [
        { id: "race-2026-governor", candidateIds: [manual.id, mixed.id], uncontested: false },
        { id: "race-2026-county-example", candidateIds: [mixed.id], uncontested: true },
      ],
      officialRows: [{ fullName: "EXAMPLE CANDIDATE", officeName: "LIEUTENANT GOVERNOR", party: "other" }],
    });

    expect(result.removedCandidateIds).toEqual([]);
    expect(result.candidates).toHaveLength(2);
  });
});
