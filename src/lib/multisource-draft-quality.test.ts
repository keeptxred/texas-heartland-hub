import { describe, expect, it } from "vitest";
import { validateArticle } from "@/lib/editorial-pipeline";
import { validateMultiSourceDraftAgainstPacket } from "@/lib/multisource-draft-quality";

const FACT_A = "The Texas Supreme Court issued an order requiring the agency to publish the revised rule on August 16.";
const FACT_B = "The revised rule takes effect September 1 and applies statewide to licensed providers.";
const FACT_C = "The agency reported that 240 providers are covered by the revised rule.";
const CLAIM = "The revised rule could raise compliance costs next year.";
const CONFLICT = "One report placed the implementation cost at $4 million while another put it at $7 million.";

function packet(overrides: { sources?: string; lead?: string; ledger?: string; claims?: string } = {}) {
  return `MULTI-SOURCE STORY PACKET.
FACT VERIFICATION: publish_with_attribution. factual backbone verified; softer or disputed claims require attribution.
${overrides.claims ?? `ATTRIBUTED CLAIMS ONLY — do not state these as settled facts: [Industry groups] ${CLAIM}`}
STORY ANGLE: decision. Evidence score=95.
VERIFIED LEAD FACT: ${overrides.lead ?? FACT_A}
${overrides.sources ?? "Independent sources: Texas Supreme Court | Austin Chronicle | Texas Tribune."}

STRUCTURED FACT LEDGER
WHAT HAPPENED
${overrides.ledger ?? `- ${FACT_A} [sources=2; primary-record=yes; source labels: Texas Supreme Court | Texas Tribune]
- ${FACT_B} [sources=2; source labels: Austin Chronicle | Texas Tribune]
KEY NUMBERS
- ${FACT_C} [sources=2; source labels: Texas Supreme Court | Texas Tribune]
SOURCE CONFLICTS — ATTRIBUTE, DO NOT SILENTLY RECONCILE
- ${CONFLICT} [sources=2; CONFLICT=numeric-conflict:abc; source labels: Outlet A | Outlet B]`}

RAW SOURCE PACKET
SOURCE 1 — Texas Supreme Court
Official order explains the revised rule and the September 1 effective date.
SOURCE 2 — Texas Tribune
Reporting confirms the order, statewide scope, and provider count.
SOURCE 3 — Austin Chronicle
Reporting confirms the effective date and provider impact.`;
}

const READER_VALUE = "For licensed providers, the order turns an uncertain rulemaking dispute into a concrete compliance calendar. Organizations now know the publication step is complete, the September 1 effective date is controlling, and the rule applies statewide. That gives administrators time to compare current procedures with the revised requirements, identify training or documentation changes, and watch for agency implementation guidance. Texans can also use the published rule and court order to verify what changed rather than relying on summaries alone.";

const UNRELATED_READER_VALUE = "For weekend visitors, the festival schedule is useful because it puts entertainment times, parking choices, food vendors, and downtown activity in one place. Families can decide when to arrive, compare transportation options, plan around the busiest periods, and identify where they want to spend time before heading downtown. Nearby merchants may also see heavier foot traffic, while drivers should expect congestion around the event area and allow extra time for parking and walking between venues.";

function goodDraft() {
  return {
    title: "Texas Supreme Court orders publication of revised statewide provider rule",
    dek: "The order clears the revised rule for a September 1 effective date and affects licensed providers across Texas.",
    summary: `${FACT_A} ${FACT_B}`,
    relevance: READER_VALUE,
    sections: [
      { heading: "What the court ordered", paragraphs: [`${FACT_A} The ruling resolves the immediate publication question.`] },
      { heading: "When the rule takes effect", paragraphs: [`${FACT_B} Agencies and providers now have a defined implementation date.`] },
      { heading: "How many providers are covered", paragraphs: [`${FACT_C} The figure appears in the agency material cited by the reporting.`] },
    ],
  };
}

describe("Phase 10 multi-source draft quality gate", () => {
  it("accepts a synthesis that follows the verified angle and integrates the factual backbone", () => {
    expect(validateMultiSourceDraftAgainstPacket(goodDraft(), packet())).toEqual([]);
  });

  it("rejects a packet that does not contain at least two independent sources", () => {
    const reasons = validateMultiSourceDraftAgainstPacket(goodDraft(), packet({ sources: "Independent sources: Texas Tribune." }));
    expect(reasons).toContain("multisource_provenance_incomplete");
  });

  it("rejects a rewrite that reports facts but adds no meaningful reader value", () => {
    const draft = goodDraft();
    draft.relevance = "The rule affects providers in Texas.";
    const reasons = validateMultiSourceDraftAgainstPacket(draft, packet());
    expect(reasons).toContain("multisource_missing_reader_value");
  });

  it("accepts substantive reader value in a dedicated context section", () => {
    const draft = goodDraft();
    draft.relevance = "";
    draft.sections.push({ heading: "Why it matters for Texas providers", paragraphs: [READER_VALUE] });
    expect(validateMultiSourceDraftAgainstPacket(draft, packet())).not.toContain("multisource_missing_reader_value");
  });

  it("rejects a draft that drifts away from the deterministic verified lead", () => {
    const draft = goodDraft();
    draft.title = "Local festival schedule draws weekend crowds";
    draft.dek = "Organizers released entertainment details and parking information for visitors attending this weekend.";
    draft.summary = "A local festival released its entertainment schedule, vendor list, and parking plan for a weekend event.";
    draft.relevance = UNRELATED_READER_VALUE;
    draft.sections = [
      { heading: "Weekend schedule", paragraphs: ["Organizers published music, food, and parking details for the weekend festival."] },
      { heading: "Visitor information", paragraphs: ["The event site lists entry times and transportation information for attendees."] },
      { heading: "Local activity", paragraphs: ["Downtown merchants are preparing for additional foot traffic during the event."] },
    ];
    const reasons = validateMultiSourceDraftAgainstPacket(draft, packet());
    expect(reasons).toContain("multisource_angle_drift");
  });

  it("rejects thin synthesis that ignores most corroborated or primary-record facts", () => {
    const draft = goodDraft();
    draft.summary = FACT_A;
    draft.dek = "The court directed publication of the revised rule, resolving the immediate procedural question before the agency.";
    draft.relevance = READER_VALUE;
    draft.sections = [{ heading: "Court action", paragraphs: [FACT_A] }];
    const reasons = validateMultiSourceDraftAgainstPacket(draft, packet());
    expect(reasons.some((reason) => reason.startsWith("multisource_verified_fact_coverage:"))).toBe(true);
  });

  it("rejects an unresolved conflicting figure when it drives the headline", () => {
    const draft = goodDraft();
    draft.title = "Texas rule implementation will cost $4 million, report says";
    draft.dek = CONFLICT;
    const reasons = validateMultiSourceDraftAgainstPacket(draft, packet());
    expect(reasons).toContain("multisource_unresolved_conflict_in_headline");
  });

  it("requires attribution when a preserved soft claim is repeated in prose", () => {
    const draft = goodDraft();
    draft.sections.push({ heading: "Possible compliance costs", paragraphs: [CLAIM] });
    const reasons = validateMultiSourceDraftAgainstPacket(draft, packet());
    expect(reasons).toContain("multisource_unattributed_claim:1");

    draft.sections[draft.sections.length - 1].paragraphs = [`According to industry groups, ${CLAIM.toLowerCase()}`];
    expect(validateMultiSourceDraftAgainstPacket(draft, packet())).not.toContain("multisource_unattributed_claim:1");
  });

  it("is wired into the existing editorial validator before publication", () => {
    const draft = goodDraft();
    draft.title = "Local festival schedule draws weekend crowds";
    draft.dek = "Organizers released entertainment details and parking information for visitors attending this weekend.";
    draft.summary = "A local festival released its entertainment schedule, vendor list, and parking plan for a weekend event.";
    draft.relevance = UNRELATED_READER_VALUE;
    draft.sections = [
      { heading: "Weekend schedule", paragraphs: ["Organizers published music, food, and parking details for the weekend festival."] },
      { heading: "Visitor information", paragraphs: ["The event site lists entry times and transportation information for attendees."] },
      { heading: "Local activity", paragraphs: ["Downtown merchants are preparing for additional foot traffic during the event."] },
    ];
    const validation = validateArticle(draft, { hasClearNewsEvent: true, category: "Politics" }, packet());
    expect(validation.reasons).toContain("multisource_angle_drift");
  });

  it("does not apply multi-source-only rules to ordinary single-source editorial validation", () => {
    const reasons = validateMultiSourceDraftAgainstPacket(goodDraft(), "ordinary source text");
    expect(reasons).toEqual([]);
  });
});
