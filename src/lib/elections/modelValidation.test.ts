import { describe, expect, it } from "vitest";
import { validateElectionModel } from "./modelValidation";

const validRecord = {
  id: "record-1",
  sourceName: "Official source",
  sourceUrl: "https://example.test/results",
  freshnessStatus: "fresh",
  relationshipIds: ["race-1"],
  knownRelationshipIds: new Set(["race-1"]),
} as const;

describe("election model validation", () => {
  it("accepts a valid source-backed record", () => {
    expect(validateElectionModel(validRecord)).toEqual({
      valid: true,
      errors: [],
      warnings: [],
    });
  });

  it("rejects invalid identifiers and source metadata", () => {
    const result = validateElectionModel({
      ...validRecord,
      id: "",
      sourceName: "",
      sourceUrl: "not-a-url",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });

  it("reports broken relationships", () => {
    const result = validateElectionModel({
      ...validRecord,
      relationshipIds: ["missing-race"],
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Broken relationship");
  });

  it("warns without invalidating stale records", () => {
    const result = validateElectionModel({
      ...validRecord,
      freshnessStatus: "stale",
    });
    expect(result.valid).toBe(true);
    expect(result.warnings).toEqual(["Record data is stale."]);
  });
});
