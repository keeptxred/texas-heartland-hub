import { storyTokens } from "./newsroom-clustering";

export type StorySelectionTier = "urgent" | "high" | "standard" | "deprioritized";

export type StorySelectionInput = {
  id: string;
  canonicalSubject: string;
  editorialScore: number;
  sourceCount: number;
  primarySourceCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  pillarSlug?: string | null;
};

export type StorySelectionResult = StorySelectionInput & {
  selectionScore: number;
  selectionRank: number;
  selectionTier: StorySelectionTier;
  breakingOverride: boolean;
  redundancyPenalty: number;
  redundancyOf: string | null;
  reasons: string[];
};

const EMERGENCY_RE = /\b(breaking|emergency|evacuat(?:e|ed|ion)|tornado|hurricane|wildfire|flash flood|amber alert|active shooter|shooting|explosion|earthquake|major outage|grid emergency|declared disaster|shelter in place|missing child|boil water|hazmat|chemical spill)\b/i;

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));
}

export function storySelectionSimilarity(left: StorySelectionInput, right: StorySelectionInput): number {
  if (left.pillarSlug && right.pillarSlug && left.pillarSlug !== right.pillarSlug) return 0;
  const a = storyTokens(left.canonicalSubject.toLowerCase());
  const b = storyTokens(right.canonicalSubject.toLowerCase());
  if (a.size < 3 || b.size < 3) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  if (intersection < 3) return 0;
  const union = new Set([...a, ...b]).size;
  const jaccard = intersection / Math.max(1, union);
  const containment = intersection / Math.max(1, Math.min(a.size, b.size));
  return Math.max(jaccard, containment);
}

function preliminaryScore(input: StorySelectionInput, nowMs: number): {
  score: number;
  breakingOverride: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = clamp(input.editorialScore);

  const depthBonus = Math.min(8, Math.max(0, input.sourceCount - 1) * 2 + Math.min(4, input.primarySourceCount * 2));
  if (depthBonus > 0) {
    score += depthBonus;
    reasons.push(`source depth +${depthBonus}`);
  }

  const lastSeenMs = Date.parse(input.lastSeenAt);
  const ageHours = Number.isFinite(lastSeenMs) ? Math.max(0, (nowMs - lastSeenMs) / 3_600_000) : 48;
  const recencyBoost = ageHours <= 2 ? 4 : ageHours <= 6 ? 2 : 0;
  if (recencyBoost) {
    score += recencyBoost;
    reasons.push(`fresh development +${recencyBoost}`);
  }

  const emergency = EMERGENCY_RE.test(input.canonicalSubject);
  const breakingOverride = emergency && input.primarySourceCount > 0;
  if (breakingOverride) {
    score = 100;
    reasons.push("official/public-safety emergency priority");
  } else if (emergency) {
    score = Math.max(score + 8, 88);
    reasons.push("breaking/public-safety priority");
  }

  if (input.sourceCount <= 1 && input.primarySourceCount === 0 && !emergency) {
    score -= 5;
    reasons.push("uncorroborated single-source penalty -5");
  }

  return { score: clamp(Math.round(score)), breakingOverride, reasons };
}

function tierFor(score: number, breakingOverride: boolean): StorySelectionTier {
  if (breakingOverride || score >= 90) return "urgent";
  if (score >= 75) return "high";
  if (score >= 55) return "standard";
  return "deprioritized";
}

/**
 * Cross-cluster ranking pass. This does not publish anything and does not bypass
 * factual/readiness gates. It only determines which already-scored event clusters
 * deserve attention first.
 */
export function rankNewsroomStorySelection(
  inputs: readonly StorySelectionInput[],
  now: Date = new Date(),
): StorySelectionResult[] {
  const nowMs = now.getTime();
  const prepared = inputs.map((input) => ({ input, ...preliminaryScore(input, nowMs) }));

  prepared.sort((a, b) =>
    b.score - a.score ||
    Number(b.breakingOverride) - Number(a.breakingOverride) ||
    b.input.primarySourceCount - a.input.primarySourceCount ||
    b.input.sourceCount - a.input.sourceCount ||
    Date.parse(b.input.lastSeenAt) - Date.parse(a.input.lastSeenAt) ||
    a.input.id.localeCompare(b.input.id),
  );

  const adjusted = prepared.map((entry, index) => {
    let redundancyPenalty = 0;
    let redundancyOf: string | null = null;
    let strongestSimilarity = 0;

    if (!entry.breakingOverride) {
      for (let priorIndex = 0; priorIndex < index; priorIndex += 1) {
        const prior = prepared[priorIndex];
        const similarity = storySelectionSimilarity(entry.input, prior.input);
        if (similarity < 0.68 || similarity <= strongestSimilarity) continue;
        strongestSimilarity = similarity;
        redundancyOf = prior.input.id;
        const basePenalty = similarity >= 0.84 ? 22 : 14;
        const authorityRelief = entry.input.primarySourceCount > prior.input.primarySourceCount ? 8 : 0;
        redundancyPenalty = Math.max(6, basePenalty - authorityRelief);
      }
    }

    const score = clamp(entry.score - redundancyPenalty);
    const reasons = [...entry.reasons];
    if (redundancyPenalty > 0 && redundancyOf) {
      reasons.push(`weaker near-duplicate of ${redundancyOf} -${redundancyPenalty}`);
    }
    return {
      ...entry.input,
      selectionScore: Math.round(score),
      selectionRank: 0,
      selectionTier: tierFor(score, entry.breakingOverride),
      breakingOverride: entry.breakingOverride,
      redundancyPenalty,
      redundancyOf,
      reasons,
    } satisfies StorySelectionResult;
  });

  adjusted.sort((a, b) =>
    b.selectionScore - a.selectionScore ||
    Number(b.breakingOverride) - Number(a.breakingOverride) ||
    b.primarySourceCount - a.primarySourceCount ||
    b.sourceCount - a.sourceCount ||
    Date.parse(b.lastSeenAt) - Date.parse(a.lastSeenAt) ||
    a.id.localeCompare(b.id),
  );

  return adjusted.map((row, index) => ({ ...row, selectionRank: index + 1 }));
}
