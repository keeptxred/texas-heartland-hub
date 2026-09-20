export type MultiSourceImageFact = {
  fact_text?: string | null;
  fact_type?: string | null;
  corroboration_count?: number | null;
  primary_record_support?: boolean | null;
  has_conflict?: boolean | null;
};

export type MultiSourceImageGrounding = {
  mode: "verified_scene" | "verified_symbolic" | "hold_image";
  leadFact: string | null;
  verifiedFacts: string[];
  excludedConflictCount: number;
  guidance: string;
};

const SOFT_CLAIM_RE = /\b(alleg(?:e|ed|es|ation)|claim(?:ed|s)?|reportedly|may|might|could|expects?|estimat(?:e|ed|es)|project(?:s|ed)?|predict(?:s|ed)?|believes?|argues?|criticiz(?:e|ed|es)|accus(?:e|ed|es)|opinion|analysis|suggests?)\b/i;
const ABSTRACT_GOVERNMENT_RE = /\b(court|judge|justice|ruling|order|injunction|lawsuit|appeal|law|bill|rule|regulation|policy|election|ballot|legislature|governor|attorney general|agency|commission|board)\b/i;

function clean(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function eligibleFact(fact: MultiSourceImageFact): boolean {
  const text = clean(fact.fact_text);
  if (text.length < 20 || fact.has_conflict) return false;
  if (SOFT_CLAIM_RE.test(text) && !fact.primary_record_support && Number(fact.corroboration_count ?? 0) < 2) return false;
  return Boolean(fact.primary_record_support) || Number(fact.corroboration_count ?? 0) >= 2;
}

function rankFact(fact: MultiSourceImageFact): number {
  const type = clean(fact.fact_type).toLowerCase();
  const typeScore = type === "action" ? 40 : type === "next_step" ? 28 : type === "date" ? 18 : type === "number" ? 16 : 8;
  return typeScore + (fact.primary_record_support ? 24 : 0) + Math.min(3, Number(fact.corroboration_count ?? 0)) * 8;
}

/**
 * Builds a deterministic image brief from the same durable fact ledger that
 * supports multi-source publication. Conflicted facts and weak soft claims are
 * excluded so they cannot steer the generated image.
 */
export function buildMultiSourceImageGrounding(input: {
  facts: MultiSourceImageFact[];
  selectedLeadFact?: string | null;
}): MultiSourceImageGrounding {
  const safeFacts = input.facts.filter(eligibleFact).sort((a, b) => rankFact(b) - rankFact(a));
  const conflictCount = input.facts.filter((fact) => Boolean(fact.has_conflict)).length;
  const selectedLead = clean(input.selectedLeadFact);
  const selectedIsSafe = selectedLead
    ? safeFacts.some((fact) => clean(fact.fact_text).toLowerCase() === selectedLead.toLowerCase())
    : false;
  const leadFact = selectedIsSafe ? selectedLead : clean(safeFacts[0]?.fact_text) || null;
  const verifiedFacts = safeFacts
    .map((fact) => clean(fact.fact_text))
    .filter((text, index, rows) => rows.indexOf(text) === index)
    .slice(0, 5);

  if (!leadFact || !verifiedFacts.length) {
    return {
      mode: "hold_image",
      leadFact: null,
      verifiedFacts: [],
      excludedConflictCount: conflictCount,
      guidance: "Do not generate a story-specific image because the published multi-source cluster has no safe corroborated or primary-record visual fact.",
    };
  }

  const evidence = `${leadFact} ${verifiedFacts.join(" ")}`;
  const mode: MultiSourceImageGrounding["mode"] = ABSTRACT_GOVERNMENT_RE.test(evidence)
    ? "verified_symbolic"
    : "verified_scene";
  const factList = verifiedFacts.slice(0, 3).map((fact) => `VERIFIED: ${fact}`).join(" ");
  const modeGuidance = mode === "verified_symbolic"
    ? "Use a neutral real institutional or environmental setting that represents the verified action; do not invent an exact private meeting, document wording, vote scene, protest, rally, identifiable official, or recognizable face."
    : "Depict only concrete scene details supported by the verified facts; use anonymous people when people are needed and do not invent damage, injuries, crowds, uniforms, vehicles, weather severity, signage, or recognizable faces.";

  return {
    mode,
    leadFact,
    verifiedFacts,
    excludedConflictCount: conflictCount,
    guidance: `Multi-source evidence lock. VERIFIED LEAD: ${leadFact}. ${factList} ${modeGuidance} Ignore disputed figures, allegations, predictions, estimates, opinions, and source-headline embellishment unless they appear above as VERIFIED facts.`,
  };
}

export function extractSelectedImageLead(clusterJson: unknown): string | null {
  if (!clusterJson || typeof clusterJson !== "object" || Array.isArray(clusterJson)) return null;
  const storyAngle = (clusterJson as { story_angle?: unknown }).story_angle;
  if (!storyAngle || typeof storyAngle !== "object" || Array.isArray(storyAngle)) return null;
  return clean((storyAngle as { lead_fact?: unknown }).lead_fact) || null;
}
