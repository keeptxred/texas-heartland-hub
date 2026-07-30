import { describe, expect, it } from "vitest";
import type { PollEntryAdminInput } from "@/types/elections";
import { validatePollEntry } from "./pollEntryValidation";

const validInput: PollEntryAdminInput = {
  slug: "source-backed-poll",
  title: "Source-backed poll",
  electionCycleId: "cycle-id",
  raceId: "race-id",
  pollsterName: "Pollster",
  fieldStartDate: "2026-01-01",
  fieldEndDate: "2026-01-03",
  releaseDate: "2026-01-04",
  population: "likely_voters",
  mode: "mixed_mode",
  sampleSize: "500",
  marginOfError: "4.5",
  questionPrompt: "Published question wording",
  responses: [
    { label: "Candidate A", candidateId: "candidate-a", percentage: "48" },
    { label: "Candidate B", candidateId: "candidate-b", percentage: "47" },
  ],
  internalPoll: false,
  partisanPoll: false,
  sourceName: "Original publisher",
  sourceUrl: "https://example.test/topline",
  methodologyUrl: "https://example.test/methodology",
};

describe("poll entry validation", () => {
  it("normalizes a complete source-backed entry", () => {
    const result = validatePollEntry(validInput);
    expect(result.errors).toEqual([]);
    expect(result.draft?.sampleSize).toBe(500);
  });

  it("rejects reversed field dates and unsafe source URLs", () => {
    const result = validatePollEntry({
      ...validInput,
      fieldStartDate: "2026-01-05",
      fieldEndDate: "2026-01-03",
      sourceUrl: "javascript:alert(1)",
    });
    expect(result.draft).toBeNull();
    expect(result.errors).toContain("Field end date cannot precede field start date.");
    expect(result.errors).toContain("A valid original-source URL is required.");
  });

  it("rejects response totals above the rounding allowance", () => {
    const result = validatePollEntry({
      ...validInput,
      responses: [
        { label: "Candidate A", candidateId: "candidate-a", percentage: "60" },
        { label: "Candidate B", candidateId: "candidate-b", percentage: "60" },
      ],
    });
    expect(result.errors).toContain("Published response percentages cannot total over 101.");
  });
});
