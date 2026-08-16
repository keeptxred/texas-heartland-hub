import { describe, expect, it } from "vitest";
import { buildStoryAngleInstructions, selectStoryAngle } from "@/lib/story-angle-selector";
import type { StructuredFactLedger } from "@/lib/structured-fact-provenance";
import type { StoryCluster } from "@/lib/story-clustering";

function cluster(title = "Texas agency announces school ratings update"): StoryCluster {
  return {
    primary: {
      id: 1,
      title,
      link: "https://example.com/a",
      source: "Outlet A",
      description: "",
      pub_date: "2026-08-16T12:00:00Z",
      combinationScore: 100,
    },
    members: [],
    score: 90,
    strongMerge: true,
    sourceCount: 2,
  } as StoryCluster;
}

function fact(overrides: Partial<StructuredFactLedger["facts"][number]> = {}): StructuredFactLedger["facts"][number] {
  return {
    factKey: "action:1",
    type: "action",
    text: "The Texas Education Agency released updated school ratings on Friday.",
    normalizedText: "the texas education agency released updated school ratings on friday",
    confidence: 0.9,
    corroborationCount: 2,
    primaryRecordSupport: true,
    sourceFeedItemIds: [1, 2],
    sourceLabels: ["TEA", "Outlet A"],
    sourceUrls: ["https://tea.texas.gov/a", "https://example.com/a"],
    numericValues: [],
    hasConflict: false,
    ...overrides,
  };
}

function ledger(facts: StructuredFactLedger["facts"]): StructuredFactLedger {
  return {
    facts,
    whatHappened: facts.filter((f) => f.type === "action" || f.type === "context"),
    keyNumbers: facts.filter((f) => f.type === "number"),
    timeline: facts.filter((f) => f.type === "date"),
    quotations: facts.filter((f) => f.type === "quote"),
    whatNext: facts.filter((f) => f.type === "next_step"),
    conflicts: facts.filter((f) => f.hasConflict),
  };
}

describe("story angle selection", () => {
  it("prefers a corroborated primary-record action over a weaker number", () => {
    const action = fact();
    const number = fact({
      factKey: "number:2",
      type: "number",
      text: "Thirty campuses received F ratings.",
      normalizedText: "thirty campuses received f ratings",
      corroborationCount: 1,
      primaryRecordSupport: false,
      confidence: 0.7,
      sourceFeedItemIds: [2],
      sourceLabels: ["Outlet A"],
      sourceUrls: ["https://example.com/a"],
      numericValues: ["30"],
    });
    const plan = selectStoryAngle(cluster(), ledger([number, action]));
    expect(plan?.leadFactKey).toBe(action.factKey);
    expect(plan?.angleType).toBe("decision");
  });

  it("never chooses an unresolved conflicting figure as the lead", () => {
    const disputed = fact({
      factKey: "number:conflict",
      type: "number",
      text: "The district reported 30 failing campuses.",
      normalizedText: "the district reported 30 failing campuses",
      hasConflict: true,
      conflictGroup: "numeric-conflict:x",
      primaryRecordSupport: false,
      corroborationCount: 2,
      numericValues: ["30", "34"],
    });
    const safe = fact({ factKey: "action:safe", primaryRecordSupport: false });
    expect(selectStoryAngle(cluster(), ledger([disputed, safe]))?.leadFactKey).toBe("action:safe");
  });

  it("demotes an uncorroborated allegation from headline selection", () => {
    const allegation = fact({
      factKey: "action:allegation",
      text: "Critics alleged the governor manipulated the process.",
      normalizedText: "critics alleged the governor manipulated the process",
      corroborationCount: 1,
      primaryRecordSupport: false,
      sourceFeedItemIds: [1],
      sourceLabels: ["Outlet A"],
      sourceUrls: ["https://example.com/a"],
    });
    const safe = fact({ factKey: "date:safe", type: "date", primaryRecordSupport: true, text: "The rule takes effect September 1.", normalizedText: "the rule takes effect september 1" });
    expect(selectStoryAngle(cluster(), ledger([allegation, safe]))?.leadFactKey).toBe("date:safe");
  });

  it("provides explicit headline and dek instructions without another AI stage", () => {
    const plan = selectStoryAngle(cluster(), ledger([fact()]));
    const instructions = buildStoryAngleInstructions(plan);
    expect(instructions).toContain("VERIFIED LEAD FACT");
    expect(instructions).toContain("Do not simply reuse any source headline");
    expect(instructions).toContain("opening paragraph");
  });

  it("falls back safely when no traceable headline fact exists", () => {
    const quoteOnly = fact({
      factKey: "quote:1",
      type: "quote",
      text: "\"We are reviewing the decision,\" the official said.",
      normalizedText: "we are reviewing the decision the official said",
    });
    expect(selectStoryAngle(cluster(), ledger([quoteOnly]))).toBeNull();
    expect(buildStoryAngleInstructions(null)).toContain("No safe deterministic lead fact");
  });
});
