import type { StoryCluster } from "@/lib/story-clustering";
import type { StructuredFact, StructuredFactLedger } from "@/lib/structured-fact-provenance";

export type StoryAngleType = "decision" | "impact" | "timeline" | "next_step" | "verified_development";

export type StoryAnglePlan = {
  angleType: StoryAngleType;
  leadFactKey: string;
  leadFact: string;
  leadScore: number;
  alternateFacts: Array<{ factKey: string; text: string; score: number }>;
  headlineInstruction: string;
  dekInstruction: string;
};

const SOFT_CLAIM_RE = /\b(alleg(?:e|ed|es|ation)|claim(?:s|ed)?|according to|argu(?:e|ed|es)|criticiz(?:e|ed|es)|accus(?:e|ed|es)|believ(?:e|ed|es)|expect(?:s|ed)?|estimat(?:e|ed|es)|project(?:s|ed)?|predict(?:s|ed)?|may|might|could|appears?|reportedly|likely|unlikely|suggest(?:s|ed)?|opinion|analysis)\b/i;
const MATERIAL_ACTION_RE = /\b(approved|adopted|signed|filed|charged|arrested|ordered|ruled|voted|confirmed|issued|released|opened|closed|increased|decreased|won|lost|killed|injured|died|declared|launched|recalled|settled|passed|rejected|blocked|allowed|required|rescinded|appointed|resigned)\b/i;
const TEXAS_CONTEXT_RE = /\b(texas|austin|houston|dallas|fort worth|san antonio|el paso|county|district|ercot|statewide|legislature|governor|attorney general|supreme court)\b/i;

function eligibleFact(fact: StructuredFact): boolean {
  if (fact.hasConflict && !fact.primaryRecordSupport) return false;
  if (!fact.sourceUrls.length) return false;
  if (fact.type === "quote" || fact.type === "context") return false;
  if (SOFT_CLAIM_RE.test(fact.text) && fact.corroborationCount < 2 && !fact.primaryRecordSupport) return false;
  return true;
}

function factScore(fact: StructuredFact, cluster: StoryCluster): number {
  let score = 0;
  if (fact.type === "action") score += MATERIAL_ACTION_RE.test(fact.text) ? 42 : 30;
  if (fact.type === "number") score += 26;
  if (fact.type === "next_step") score += 24;
  if (fact.type === "date") score += 18;

  score += Math.min(3, Math.max(0, fact.corroborationCount - 1)) * 14;
  if (fact.primaryRecordSupport) score += 18;
  score += Math.round(fact.confidence * 12);
  if (TEXAS_CONTEXT_RE.test(fact.text)) score += 6;

  const primaryTitle = cluster.primary.title.toLowerCase();
  const factWords = fact.normalizedText.split(/\s+/).filter((word) => word.length >= 5);
  const titleOverlap = factWords.filter((word) => primaryTitle.includes(word)).length;
  score += Math.min(3, titleOverlap) * 2;

  if (SOFT_CLAIM_RE.test(fact.text)) score -= 24;
  if (fact.hasConflict) score -= 35;
  return score;
}

function angleTypeFor(fact: StructuredFact): StoryAngleType {
  if (fact.type === "action") return MATERIAL_ACTION_RE.test(fact.text) ? "decision" : "verified_development";
  if (fact.type === "number") return "impact";
  if (fact.type === "next_step") return "next_step";
  if (fact.type === "date") return "timeline";
  return "verified_development";
}

export function selectStoryAngle(cluster: StoryCluster, ledger: StructuredFactLedger): StoryAnglePlan | null {
  const ranked = ledger.facts
    .filter(eligibleFact)
    .map((fact) => ({ fact, score: factScore(fact, cluster) }))
    .sort((a, b) => b.score - a.score || b.fact.corroborationCount - a.fact.corroborationCount || a.fact.text.length - b.fact.text.length);

  const lead = ranked[0];
  if (!lead) return null;

  const alternates = ranked
    .slice(1)
    .filter((candidate) => candidate.fact.factKey !== lead.fact.factKey)
    .slice(0, 2)
    .map((candidate) => ({ factKey: candidate.fact.factKey, text: candidate.fact.text, score: candidate.score }));

  const angleType = angleTypeFor(lead.fact);
  const evidenceLabel = lead.fact.primaryRecordSupport
    ? "primary-record-supported"
    : lead.fact.corroborationCount >= 2
      ? `corroborated by ${lead.fact.corroborationCount} independent sources`
      : "traceable to the preserved source record";

  return {
    angleType,
    leadFactKey: lead.fact.factKey,
    leadFact: lead.fact.text,
    leadScore: lead.score,
    alternateFacts: alternates,
    headlineInstruction: `Center the display headline and SEO title on this verified lead fact (${evidenceLabel}): ${lead.fact.text}. Do not simply reuse any source headline. Do not add a person, number, motive, outcome, or superlative that is not supported by the fact ledger/raw packet. Use a Texas place or institution in the headline when it materially improves specificity.`,
    dekInstruction: alternates.length
      ? `Use the dek to add consequence or context from these secondary verified facts without repeating the headline: ${alternates.map((fact) => fact.text).join(" | ")}`
      : "Use the dek to explain the consequence or next verified step without merely restating the headline.",
  };
}

export function buildStoryAngleInstructions(plan: StoryAnglePlan | null): string {
  if (!plan) {
    return "STORY ANGLE: No safe deterministic lead fact was selected. Choose the headline only from verified, traceable facts in the ledger; do not inherit a source headline by default.";
  }
  return [
    `STORY ANGLE: ${plan.angleType}. Evidence score=${plan.leadScore}.`,
    `VERIFIED LEAD FACT: ${plan.leadFact}`,
    plan.headlineInstruction,
    plan.dekInstruction,
    "The opening paragraph should deliver the same central verified development immediately, then integrate the strongest non-duplicative facts from the other sources.",
  ].join("\n");
}
