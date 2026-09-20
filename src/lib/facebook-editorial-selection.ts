export type FacebookEditorialCandidate = {
  title: string;
  category?: string | null;
  kind?: string | null;
  is_breaking?: boolean | null;
  score?: number | null;
  published_at: string;
};

export type RecentFacebookPost = {
  title: string;
  published_at?: string | null;
};

export type RankedFacebookCandidate<T extends FacebookEditorialCandidate> = {
  candidate: T;
  editorialScore: number;
  topic: string;
  reasons: string[];
};

const ROUTINE_APPOINTMENT_RE = /\b(appoint(?:s|ed|ing|ment)?|reappoint(?:s|ed|ing|ment)?|names?\s+[^:]{0,80}\b(?:judge|justice|board|commission|commissioner|council|authority|panel|task force)|fills?\s+[^:]{0,50}\bvacanc(?:y|ies))\b/i;
const CONTROVERSY_RE = /\b(lawsuit|sues?|suing|challenge(?:s|d)?|scrutiny|backlash|fight|dispute|probe|investigation|indict(?:ed|ment)?|arrest(?:ed)?|resign(?:s|ed|ation)?|scandal|blocked?|overturn(?:s|ed)?|ruling|ethics|fraud|criminal)\b/i;

const HIGH_INTEREST_PATTERNS: RegExp[] = [
  /\b(billion|million)\b/i,
  /\b(election|primary|ballot|poll|senate race|governor(?:'s)? race)\b/i,
  /\b(lawsuit|court|ruling|ban|blocked|overturn|constitutional)\b/i,
  /\b(crime|shooting|arrest|indict|murder|homicide|fraud)\b/i,
  /\b(border|immigration|ICE|deport|cartel|screwworm)\b/i,
  /\b(grid|power|energy|oil|data center|AI|artificial intelligence)\b/i,
  /\b(tax|layoffs?|jobs?|unemployment|funding|budget)\b/i,
  /\b(backlash|fight|clash|controversy|scrutiny|privacy|pressure)\b/i,
  /\b(Buc-ee'?s|H-E-B|Whataburger|Tesla|Wembanyama|Spurs|Cowboys|Astros|Rangers)\b/i,
  /\b(viral|record|surprise|rare|earthquake|flood|measles|meteor)\b/i,
];

const ENTITY_STOP_WORDS = new Set([
  "texas", "breaking", "new", "state", "county", "city", "court", "judge", "house",
  "senate", "school", "university", "government", "local", "federal", "after", "amid",
  "with", "from", "into", "over", "under", "more", "than", "today", "says", "gets",
]);

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function isRoutineGovernmentAppointment(title: string): boolean {
  return ROUTINE_APPOINTMENT_RE.test(title) && !CONTROVERSY_RE.test(title);
}

export function classifyFacebookTopic(candidate: Pick<FacebookEditorialCandidate, "title" | "category" | "kind">): string {
  const title = normalize(candidate.title);
  const category = normalize(candidate.category);
  const kind = normalize(candidate.kind);

  if (isRoutineGovernmentAppointment(candidate.title)) return "appointments";
  if (category === "elections" || /\b(election|ballot|primary|campaign|poll|senate race|governor(?:'s)? race)\b/.test(title)) return "elections";
  if (category === "border" || /\b(border|immigration|ice|deport|migrant|cartel|mexic(?:o|an))\b/.test(title)) return "border";
  if (category === "energy" || /\b(grid|power|energy|oil|gas|ercot|data center|refiner)\b/.test(title)) return "energy";
  if (category === "education" || /\b(school|teacher|student|college|university|education|hisd|isd)\b/.test(title)) return "education";
  if (category === "laws" || /\b(court|lawsuit|judge|ruling|law|legal|appeals?)\b/.test(title)) return "law-courts";
  if (/\b(shooting|murder|homicide|arrest|crime|police|sheriff|officer|jail|fraud)\b/.test(title)) return "public-safety";
  if (kind.startsWith("sports-") || /\b(spurs|cowboys|texans|astros|rangers|mavericks|rockets|nba|nfl|mlb|football|basketball|baseball)\b/.test(title)) return "sports";
  if (category === "local government" || /\b(city council|county commissioners?|mayor|local government)\b/.test(title)) return "local-government";
  if (/\b(tax|jobs?|layoffs?|unemployment|business|company|plant|store|billion|million|economy|funding|budget)\b/.test(title)) return "business-economy";
  if (/\b(storm|heat|rain|flood|earthquake|lake|weather|drought|measles)\b/.test(title)) return "weather-environment-health";
  if (category === "non-political" || /\b(bbq|barbecue|restaurant|festival|buc-ee|h-e-b|whataburger|zoo|music|food|viral|record)\b/.test(title)) return "texas-culture";
  return "general";
}

function entityTokens(title: string): Set<string> {
  const words = title.match(/[A-Za-z][A-Za-z'’.-]{3,}/g) ?? [];
  const tokens = new Set<string>();
  for (const raw of words) {
    const token = raw.toLowerCase().replace(/[.’'-]/g, "");
    if (token.length < 5 || ENTITY_STOP_WORDS.has(token)) continue;
    tokens.add(token);
  }
  return tokens;
}

function sharedEntityTokenCount(a: string, b: string): number {
  const left = entityTokens(a);
  const right = entityTokens(b);
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  return shared;
}

function ageInDays(publishedAt: string, now: Date): number {
  const timestamp = Date.parse(publishedAt);
  if (!Number.isFinite(timestamp)) return 14;
  return Math.max(0, (now.getTime() - timestamp) / 86_400_000);
}

function freshnessPoints(ageDays: number): number {
  if (ageDays <= 1) return 24;
  if (ageDays <= 3) return 19;
  if (ageDays <= 7) return 13;
  if (ageDays <= 10) return 8;
  return 4;
}

function interestPoints(title: string): number {
  let matched = 0;
  for (const pattern of HIGH_INTEREST_PATTERNS) if (pattern.test(title)) matched += 1;
  return Math.min(24, matched * 6);
}

export function rankFacebookCandidates<T extends FacebookEditorialCandidate>(
  candidates: T[],
  recentPosts: RecentFacebookPost[],
  now = new Date(),
): RankedFacebookCandidate<T>[] {
  const recentWindowStart = now.getTime() - 30 * 60 * 60 * 1000;
  const recent = recentPosts.filter((post) => {
    if (!post.published_at) return true;
    const timestamp = Date.parse(post.published_at);
    return Number.isFinite(timestamp) && timestamp >= recentWindowStart;
  });
  const recentTopicCounts = new Map<string, number>();
  for (const post of recent) {
    const topic = classifyFacebookTopic({ title: post.title, category: null, kind: null });
    recentTopicCounts.set(topic, (recentTopicCounts.get(topic) ?? 0) + 1);
  }

  return candidates
    .filter((candidate) => !isRoutineGovernmentAppointment(candidate.title))
    .map((candidate) => {
      const topic = classifyFacebookTopic(candidate);
      const reasons: string[] = [];
      const ageDays = ageInDays(candidate.published_at, now);
      const base = Number.isFinite(candidate.score ?? NaN) ? Number(candidate.score) : 0;
      let editorialScore = base + freshnessPoints(ageDays) + interestPoints(candidate.title);

      if (candidate.is_breaking) {
        editorialScore += 14;
        reasons.push("breaking");
      }

      const sameTopicCount = recentTopicCounts.get(topic) ?? 0;
      if (sameTopicCount > 0) {
        editorialScore -= sameTopicCount * 18;
        reasons.push(`topic repeated ${sameTopicCount}x`);
      }

      let entityPenalty = 0;
      for (const post of recent) {
        const shared = sharedEntityTokenCount(candidate.title, post.title);
        if (shared > 0) entityPenalty += Math.min(16, shared * 7);
      }
      if (entityPenalty > 0) {
        editorialScore -= entityPenalty;
        reasons.push("recent entity overlap");
      }

      if (topic === "general") editorialScore -= 5;
      reasons.push(`topic:${topic}`);
      reasons.push(`base:${base}`);

      return { candidate, editorialScore, topic, reasons };
    })
    .sort((a, b) => b.editorialScore - a.editorialScore || Date.parse(b.candidate.published_at) - Date.parse(a.candidate.published_at));
}
