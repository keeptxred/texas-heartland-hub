import { describe, expect, it } from "vitest";
import { buildImagePrompt, type SubjectExtract } from "@/lib/featured-image-core";
import { buildMultiSourceImageGrounding, extractSelectedImageLead } from "@/lib/multisource-image-grounding";

const verifiedCourtFact = "The Texas Supreme Court issued an order requiring the agency to publish the revised rule on August 16.";
const verifiedEffectiveDate = "The revised rule takes effect September 1 and applies statewide to licensed providers.";
const disputedCost = "The implementation will cost $4 million.";
const allegation = "Industry groups claimed the rule could raise compliance costs next year.";

describe("Phase 11 multi-source image grounding", () => {
  it("uses the Phase 5 selected lead when that lead is supported and non-conflicting", () => {
    const grounding = buildMultiSourceImageGrounding({
      selectedLeadFact: verifiedCourtFact,
      facts: [
        { fact_text: verifiedCourtFact, fact_type: "action", corroboration_count: 2, primary_record_support: true, has_conflict: false },
        { fact_text: verifiedEffectiveDate, fact_type: "date", corroboration_count: 2, primary_record_support: false, has_conflict: false },
      ],
    });
    expect(grounding.leadFact).toBe(verifiedCourtFact);
    expect(grounding.mode).toBe("verified_symbolic");
    expect(grounding.guidance).toContain(`VERIFIED LEAD: ${verifiedCourtFact}`);
  });

  it("excludes unresolved conflicting facts even when a conflict was selected upstream", () => {
    const grounding = buildMultiSourceImageGrounding({
      selectedLeadFact: disputedCost,
      facts: [
        { fact_text: disputedCost, fact_type: "number", corroboration_count: 2, primary_record_support: false, has_conflict: true },
        { fact_text: verifiedCourtFact, fact_type: "action", corroboration_count: 2, primary_record_support: true, has_conflict: false },
      ],
    });
    expect(grounding.leadFact).toBe(verifiedCourtFact);
    expect(grounding.verifiedFacts).not.toContain(disputedCost);
    expect(grounding.excludedConflictCount).toBe(1);
  });

  it("does not let a weak attributed allegation steer the image", () => {
    const grounding = buildMultiSourceImageGrounding({
      facts: [
        { fact_text: allegation, fact_type: "context", corroboration_count: 1, primary_record_support: false, has_conflict: false },
        { fact_text: verifiedEffectiveDate, fact_type: "date", corroboration_count: 2, primary_record_support: false, has_conflict: false },
      ],
    });
    expect(grounding.verifiedFacts).not.toContain(allegation);
    expect(grounding.leadFact).toBe(verifiedEffectiveDate);
  });

  it("holds image generation when no safe corroborated or primary-record fact exists", () => {
    const grounding = buildMultiSourceImageGrounding({
      facts: [{ fact_text: allegation, fact_type: "context", corroboration_count: 1, primary_record_support: false, has_conflict: false }],
    });
    expect(grounding.mode).toBe("hold_image");
    expect(grounding.leadFact).toBeNull();
  });

  it("recovers the persisted Phase 5 lead from cluster metadata", () => {
    expect(extractSelectedImageLead({ story_angle: { lead_fact: verifiedCourtFact } })).toBe(verifiedCourtFact);
    expect(extractSelectedImageLead({ story_angle: { lead_fact: "" } })).toBeNull();
  });

  it("keeps the evidence lock in both initial and retry image prompts", () => {
    const subject: SubjectExtract = {
      title: "Texas Supreme Court orders publication of revised rule",
      firstParagraph: verifiedCourtFact,
      entities: ["Texas Supreme Court"],
      locations: ["Texas"],
      domain: "legal",
      concreteSubject: verifiedCourtFact,
      imageGroundingMode: "verified_symbolic",
      evidenceGuidance: `Multi-source evidence lock. VERIFIED LEAD: ${verifiedCourtFact}. Ignore disputed figures and allegations.`,
    };
    const initial = buildImagePrompt(subject);
    const retry = buildImagePrompt(subject, "Previous composition was too generic");
    expect(initial).toContain("EVIDENCE CONSTRAINTS:");
    expect(initial).toContain(verifiedCourtFact);
    expect(retry).toContain("EVIDENCE CONSTRAINTS:");
    expect(retry).toContain(verifiedCourtFact);
    expect(retry).toContain("Previous composition was too generic");
  });

  it("leaves ordinary single-source image prompts on the existing path", () => {
    const subject: SubjectExtract = {
      title: "Texas highway project opens new lanes",
      firstParagraph: "The project opened new lanes Monday.",
      entities: [],
      locations: ["Austin"],
      domain: "transportation",
      concreteSubject: "New highway lanes in Austin",
    };
    expect(buildImagePrompt(subject)).not.toContain("EVIDENCE CONSTRAINTS:");
  });
});
