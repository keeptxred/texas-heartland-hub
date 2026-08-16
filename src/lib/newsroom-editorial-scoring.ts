import { classifyContentPillar } from "./content-pillars";
import { classifySportsText } from "./sports-taxonomy";

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));
}

export type EditorialScoreInput = {
  texasRelevance: number;
  sourceReputation: number;
  viralScore: number;
  trendVelocity: number;
  sourceCount: number;
  primarySourceCount: number;
  ageHours: number;
};

export type EditorialScore = {
  score: number;
  breakdown: {
    texasRelevance: number;
    sourceQuality: number;
    corroboration: number;
    viralSignal: number;
    trendVelocity: number;
    recency: number;
  };
};

export function scoreEditorialCluster(input: EditorialScoreInput): EditorialScore {
  const texasRelevance = clamp(input.texasRelevance) * 0.35;
  const sourceQuality = clamp(input.sourceReputation) * 0.20;
  const corroboration = Math.min(15, Math.max(0, input.sourceCount - 1) * 5 + Math.min(5, input.primarySourceCount * 2.5));
  const viralSignal = clamp(input.viralScore) * 0.15;
  const trendVelocity = clamp(input.trendVelocity, 0, 60) / 60 * 10;
  const recency = clamp(48 - Math.max(0, input.ageHours), 0, 48) / 48 * 5;
  const score = Math.round(texasRelevance + sourceQuality + corroboration + viralSignal + trendVelocity + recency);
  return {
    score: clamp(score),
    breakdown: {
      texasRelevance: Math.round(texasRelevance * 10) / 10,
      sourceQuality: Math.round(sourceQuality * 10) / 10,
      corroboration: Math.round(corroboration * 10) / 10,
      viralSignal: Math.round(viralSignal * 10) / 10,
      trendVelocity: Math.round(trendVelocity * 10) / 10,
      recency: Math.round(recency * 10) / 10,
    },
  };
}

export function routeEditorialPillar(input: {
  canonicalSubject: string;
  persistedPillars: readonly (string | null | undefined)[];
}): string {
  const counts = new Map<string, number>();
  for (const pillar of input.persistedPillars) {
    if (!pillar) continue;
    counts.set(pillar, (counts.get(pillar) ?? 0) + 1);
  }
  const persistedWinner = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];
  if (persistedWinner) return persistedWinner;

  const sports = classifySportsText(input.canonicalSubject);
  if (sports.isSports && (sports.teams.length > 0 || sports.leagues.length > 0 || sports.texasRelevanceScore >= 45)) return "sports";

  return classifyContentPillar({ title: input.canonicalSubject }) ?? "texas-news";
}

export function rankEditorialCandidates<T extends { editorialScore: number; firstSeenAt: string }>(rows: readonly T[]): T[] {
  return [...rows].sort((a, b) => b.editorialScore - a.editorialScore || Date.parse(a.firstSeenAt) - Date.parse(b.firstSeenAt));
}
