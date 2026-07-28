import { describe, expect, it } from "vitest";
import { parseElectionResearchSelection, serializeElectionResearchSelection } from "./researchList";

describe("election research list storage", () => {
  it("keeps only unique opaque record IDs", () => {
    expect(
      parseElectionResearchSelection(
        '{"candidateIds":["candidate-1","candidate-1",7],"raceIds":["race-1"]}',
      ),
    ).toEqual({ candidateIds: ["candidate-1"], raceIds: ["race-1"] });
  });

  it("does not store person-level ballot or voter data", () => {
    const value = serializeElectionResearchSelection({
      candidateIds: ["candidate-1"],
      raceIds: ["race-1"],
    });
    expect(value).toBe('{"candidateIds":["candidate-1"],"raceIds":["race-1"]}');
    expect(value).not.toContain("address");
  });
});
