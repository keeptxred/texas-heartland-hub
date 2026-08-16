import { classifyContentPillar } from "./content-pillars";
import { classifySportsText } from "./sports-taxonomy";

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));
}

function hostnameOf(rawUrl: string | null | undefined): string {
  if (!rawUrl) return "";
  try {
    return new URL(rawUrl).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

const OFFICIAL_SPORTS_HOSTS = [
  "12thman.com",
  "baylorbears.com",
  "gofrogs.com",
  "meangreensports.com",
  "uhcougars.com",
  "texassports.com",
  "smumustangs.com",
  "txst.com",
  "riceowls.com",
  "utepminers.com",
  "utsa.com",
  "houstondynamo.com",
  "fcdallas.com",
  "dallascowboys.com",
  "houstontexans.com",
  "mlb.com",
  "nba.com",
  "nhl.com",
];

function hostMatches(hostname: string, allowed: string): boolean {
  return hostname === allowed || hostname.endsWith(`.${allowed}`);
}

export function isOfficialSportsSource(sourceName: string | null | undefined, sourceUrl?: string | null): boolean {
  const name = (sourceName ?? "").trim();
  const hostname = hostnameOf(sourceUrl);
  if (OFFICIAL_SPORTS_HOSTS.some((allowed) => hostMatches(hostname, allowed))) return true;
  return /\b(athletics|aggies|cougars athletics|longhorns athletics)\b/i.test(name);
}

export function isPrimaryNewsSource(sourceName: string | null | undefined, sourceUrl: string | null | undefined): boolean {
  const hostname = hostnameOf(sourceUrl);
  if (!hostname || hostname === "news.google.com") return false;
  if (hostname.endsWith(".gov") || hostname.endsWith(".mil") || hostname.endsWith(".state.tx.us")) return true;
  if (isOfficialSportsSource(sourceName, sourceUrl)) return true;
  return false;
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
  sourceNames?: readonly (string | null | undefined)[];
  sourceUrls?: readonly (string | null | undefined)[];
}): string {
  const counts = new Map<string, number>();
  for (const pillar of input.persistedPillars) {
    if (!pillar) continue;
    counts.set(pillar, (counts.get(pillar) ?? 0) + 1);
  }
  const persistedWinner = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];
  if (persistedWinner) return persistedWinner;

  const sourceNames = input.sourceNames ?? [];
  const sourceUrls = input.sourceUrls ?? [];
  if (sourceNames.some((name, index) => isOfficialSportsSource(name, sourceUrls[index]))) return "sports";

  const sports = classifySportsText(input.canonicalSubject);
  if (sports.isSports && (sports.teams.length > 0 || sports.leagues.length > 0 || sports.texasRelevanceScore >= 45)) return "sports";

  return classifyContentPillar({ title: input.canonicalSubject }) ?? "texas-news";
}

export function rankEditorialCandidates<T extends { editorialScore: number; firstSeenAt: string }>(rows: readonly T[]): T[] {
  return [...rows].sort((a, b) => b.editorialScore - a.editorialScore || Date.parse(a.firstSeenAt) - Date.parse(b.firstSeenAt));
}
