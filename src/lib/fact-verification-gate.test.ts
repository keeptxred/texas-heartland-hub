import { describe, expect, it } from "vitest";
import { assessFactVerification } from "@/lib/fact-verification-gate";
import type { StoryCluster } from "@/lib/story-clustering";
import type { StructuredFact, StructuredFactLedger } from "@/lib/structured-fact-provenance";

function cluster(title = "Texas agency releases school accountability ratings"): StoryCluster {
  return {
    primary: { id: 1, title, link: "https://tea.texas.gov/report", source: "Texas Education Agency", description: "", pub_date: "2026-08-16T12:00:00Z" },
    members: [],
    score: 90,
    sourceCount: 2,
    strongMerge: true,
  } as StoryCluster;
}

function fact(overrides: Partial<StructuredFact> = {}): StructuredFact {
  return {
    factKey: "action:1",
    type: "action",
    text: "The Texas Education Agency released school accountability ratings on August 16.",
    normalizedText: "texas education agency released school accountability ratings august 16",
    confidence: 0.9,
    corroborationCount: 2,
    primaryRecordSupport: true,
    sourceFeedItemIds: [1, 2],
    sourceLabels: ["Texas Education Agency", "Texas Tribune"],
    sourceUrls: ["https://tea.texas.gov/report", "https://example.com/story"],
    numericValues: [],
    hasConflict: false,
    ...overrides,
  };
}

function ledger(facts: StructuredFact[]): StructuredFactLedger {
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

describe("fact verification gate", () => {
  it("allows a traceable corroborated factual backbone", () => {
    const decision = assessFactVerification(cluster(), ledger([fact()]));
    expect(decision.publish).toBe(true);
    expect(decision.mode).toBe("verified");
  });

  it("blocks a central unresolved numerical contradiction", () => {
    const conflicted = fact({
      factKey: "number:1",
      type: "number",
      text: "Texas agency school accountability ratings show 42 percent received an A or B rating.",
      primaryRecordSupport: false,
      conflictGroup: "numeric-conflict:ratings",
      hasConflict: true,
      numericValues: ["42 percent", "47 percent"],
    });
    const decision = assessFactVerification(cluster(), ledger([conflicted]));
    expect(decision.publish).toBe(false);
    expect(decision.mode).toBe("hold_material_conflict");
  });

  it("does not block a peripheral conflict that can be attributed", () => {
    const conflicted = fact({
      factKey: "number:2",
      type: "number",
      text: "One local district reported 42 percent participation in an optional survey.",
      primaryRecordSupport: false,
      conflictGroup: "numeric-conflict:survey",
      hasConflict: true,
      numericValues: ["42 percent", "47 percent"],
    });
    const decision = assessFactVerification(cluster(), ledger([fact(), conflicted]));
    expect(decision.publish).toBe(true);
    expect(decision.mode).toBe("publish_with_attribution");
  });

  it("labels predictions and allegations for attribution instead of treating them as settled facts", () => {
    const claim = fact({
      factKey: "next:1",
      type: "next_step",
      text: "Officials expect the ratings could change after appeals are reviewed.",
      corroborationCount: 1,
      primaryRecordSupport: false,
    });
    const decision = assessFactVerification(cluster(), ledger([fact(), claim]));
    expect(decision.publish).toBe(true);
    expect(decision.mode).toBe("publish_with_attribution");
    expect(decision.attributedClaimKeys).toContain("next:1");
  });

  it("blocks authority stories with no corroborated or primary-record major fact", () => {
    const weak = fact({ corroborationCount: 1, primaryRecordSupport: false, sourceFeedItemIds: [2], sourceLabels: ["Blog"], sourceUrls: ["https://example.com"] });
    const decision = assessFactVerification(cluster("Texas election court ruling changes ballot rules"), ledger([weak]));
    expect(decision.publish).toBe(false);
    expect(decision.mode).toBe("hold_authority_support");
  });
});
