import { describe, expect, it } from "vitest";
import { assessFactVerification, buildVerificationInstructions } from "@/lib/fact-verification-gate";
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

  it("resolves the 2026 voter-registration date conflict from the verified Texas SOS cycle record", () => {
    const electionCluster = cluster("Texans have less than 3 weeks to register to vote for November 2026 midterm election");
    electionCluster.primary.source = "Houston Public Media";
    electionCluster.primary.link = "https://www.houstonpublicmedia.org/elections/registration-deadline";
    electionCluster.primary.description = "Texas law requires eligible citizens to register 30 days before Election Day.";

    const conflicted = fact({
      factKey: "date:voter-registration",
      type: "date",
      text: "The Oct. 5 deadline to register to vote is for the Nov. 4, 2026 midterm election.",
      normalizedText: "oct 5 deadline register vote nov 4 2026 midterm election",
      corroborationCount: 1,
      primaryRecordSupport: false,
      sourceFeedItemIds: [1],
      sourceLabels: ["Houston Public Media"],
      sourceUrls: [electionCluster.primary.link],
      conflictGroup: "numeric-conflict:election-date",
      hasConflict: true,
      numericValues: ["5", "4", "2026"],
    });

    const electionLedger = ledger([conflicted]);
    const decision = assessFactVerification(electionCluster, electionLedger);
    expect(decision.publish).toBe(true);
    expect(decision.mode).toBe("publish_with_attribution");
    expect(decision.primaryRecordMajorFacts).toBeGreaterThan(0);
    expect(decision.materialConflictKeys).toEqual([]);
    expect(decision.primaryRecordNotes?.[0]).toContain("voter registration deadline=October 5, 2026");
    expect(decision.primaryRecordNotes?.[0]).toContain("general election date=November 3, 2026");
    expect(decision.primaryRecordNotes?.[0]).toContain("sos.texas.gov");

    const instructions = buildVerificationInstructions(decision, electionLedger);
    expect(instructions).toContain("PRIMARY RECORD");
    expect(instructions).toContain("November 3, 2026");
  });

  it("uses the verified SOS calendar as primary support for a single-source registration deadline story", () => {
    const electionCluster = cluster("Texas voter registration deadline is Oct. 5 for the November 2026 general election");
    electionCluster.primary.source = "Houston Public Media";
    electionCluster.primary.link = "https://www.houstonpublicmedia.org/elections/registration-deadline";
    electionCluster.primary.description = "Texas voters must register by Oct. 5, 2026 for the Nov. 3, 2026 general election.";

    const dateFact = fact({
      factKey: "date:registration-deadline",
      type: "date",
      text: "Texas voters must register by Oct. 5, 2026 for the Nov. 3, 2026 general election.",
      normalizedText: "texas voters register oct 5 2026 nov 3 2026 general election",
      corroborationCount: 1,
      primaryRecordSupport: false,
      sourceFeedItemIds: [1],
      sourceLabels: ["Houston Public Media"],
      sourceUrls: [electionCluster.primary.link],
      numericValues: ["5", "2026", "3", "2026"],
      hasConflict: false,
    });

    const decision = assessFactVerification(electionCluster, ledger([dateFact]));
    expect(decision.publish).toBe(true);
    expect(decision.mode).toBe("verified");
    expect(decision.primaryRecordMajorFacts).toBe(1);
    expect(decision.primaryRecordSources).toEqual([
      expect.objectContaining({
        label: expect.stringContaining("Texas Secretary of State"),
        url: expect.stringContaining("sos.texas.gov"),
      }),
    ]);
    expect(decision.primaryRecordNotes?.join(" ")).toContain("October 5, 2026");
    expect(decision.primaryRecordNotes?.join(" ")).toContain("November 3, 2026");
  });

  it("does not let an election calendar resolve an unrelated central numeric conflict", () => {
    const electionCluster = cluster("Texas voter registration deadline for the November 2026 general election");
    electionCluster.primary.source = "Houston Public Media";
    electionCluster.primary.link = "https://www.houstonpublicmedia.org/elections/registration-deadline";
    electionCluster.primary.description = "Texas voter registration officials are preparing for the November election.";

    const voterCountConflict = fact({
      factKey: "number:voter-count",
      type: "number",
      text: "Texas voter registration officials reported 2.9 million voter records in the system.",
      normalizedText: "texas voter registration officials reported 2 9 million voter records system",
      corroborationCount: 1,
      primaryRecordSupport: false,
      sourceFeedItemIds: [1],
      sourceLabels: ["Houston Public Media"],
      sourceUrls: [electionCluster.primary.link],
      conflictGroup: "numeric-conflict:voter-count",
      hasConflict: true,
      numericValues: ["2.9 million", "3.1 million"],
    });

    const decision = assessFactVerification(electionCluster, ledger([voterCountConflict]));
    expect(decision.publish).toBe(false);
    expect(decision.mode).toBe("hold_material_conflict");
    expect(decision.materialConflictKeys).toContain("number:voter-count");
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
