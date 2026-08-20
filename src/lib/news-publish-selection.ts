export type NewsPublishCandidate = {
  id: number;
  title: string;
  coverage_priority: number | null;
  source_reputation_score: number | null;
  pub_date: string;
};

export const MAX_RECENT_AUTOMATED_FAILURES = 2;

const ROUTINE_APPOINTMENT_RE = /\b(appoints?|appointed|appointment|reappoints?|reappointed|reappointment|names?)\b.*\b(board|commission|committee|council|authority|panel|task force|director|member|members|judge|justice)\b/i;
const APPOINTMENT_STAKES_RE = /\b(lawsuit|challenge|scrutiny|backlash|fight|dispute|probe|investigation|indict|arrest|resign|scandal|blocked|overturned|ruling|ethics|fraud|criminal|election|vacancy crisis)\b/i;
const FORMULA_GOVERNMENT_RE = /^governor\s+abbott\s+(?:announces?|appoints?|reappoints?|names?)\b/i;
const HIGH_INTEREST_RE = /\b(election|primary|ballot|poll|senate|house race|lawsuit|court|ruling|injunction|supreme court|indict|arrest|shooting|homicide|fraud|border|immigration|ice|cartel|ercot|grid|power|data center|oil|gas|refiner|tax|budget|jobs|layoff|school finance|investigat|privacy|backlash|earthquake|flood|hurricane|wildfire|measles|buc-?ee'?s|h-?e-?b|whataburger|cowboys|texans|astros|rangers|spurs|mavericks)\b/i;
const VERY_HIGH_INTEREST_RE = /\b(breaking|supreme court|indict|arrest|shooting|homicide|election|ballot|poll|lawsuit|injunction|ercot|grid emergency|earthquake|hurricane|wildfire|privacy|backlash)\b/i;

export function isRoutineGovernmentAppointment(title: string): boolean {
  return ROUTINE_APPOINTMENT_RE.test(title) && !APPOINTMENT_STAKES_RE.test(title);
}

export function releaseSeriesKey(title: string): string | null {
  const normalized = title.toLowerCase().replace(/\s+/g, " ");
  if (/governor abbott announces .*commit to comply with his data centers? standards/.test(normalized)) {
    return "abbott-data-center-standards";
  }
  if (/data center coalition .*comply with his data centers? standards/.test(normalized)) {
    return "abbott-data-center-standards";
  }
  return null;
}

export function publicationInterestScore(candidate: NewsPublishCandidate, now = new Date()): number {
  const title = candidate.title ?? "";
  const publishedMs = Date.parse(candidate.pub_date);
  const ageHours = Number.isFinite(publishedMs)
    ? Math.max(0, (now.getTime() - publishedMs) / 3_600_000)
    : 999;

  let score = Math.round((candidate.coverage_priority ?? 0) * 0.45);
  score += Math.round((candidate.source_reputation_score ?? 0) * 0.2);

  if (ageHours <= 12) score += 34;
  else if (ageHours <= 24) score += 27;
  else if (ageHours <= 48) score += 17;
  else if (ageHours <= 72) score += 8;
  else score -= 8;

  if (VERY_HIGH_INTEREST_RE.test(title)) score += 28;
  else if (HIGH_INTEREST_RE.test(title)) score += 18;

  if (FORMULA_GOVERNMENT_RE.test(title)) score -= 16;
  if (releaseSeriesKey(title)) score += 8; // publish one useful synthesis, not each release.
  if (isRoutineGovernmentAppointment(title)) score -= 100;

  return score;
}

export function rankPublicationCandidates(
  candidates: NewsPublishCandidate[],
  recentFailureCounts: Map<number, number>,
  now = new Date(),
): NewsPublishCandidate[] {
  const seenTitles = new Set<string>();
  const seenSeries = new Set<string>();

  return [...candidates]
    .filter((candidate) => (recentFailureCounts.get(candidate.id) ?? 0) < MAX_RECENT_AUTOMATED_FAILURES)
    .filter((candidate) => !isRoutineGovernmentAppointment(candidate.title))
    .sort((a, b) => publicationInterestScore(b, now) - publicationInterestScore(a, now)
      || Date.parse(b.pub_date) - Date.parse(a.pub_date))
    .filter((candidate) => {
      const titleKey = candidate.title.trim().toLowerCase().replace(/\s+/g, " ");
      if (!titleKey || seenTitles.has(titleKey)) return false;
      seenTitles.add(titleKey);

      const series = releaseSeriesKey(candidate.title);
      if (series) {
        if (seenSeries.has(series)) return false;
        seenSeries.add(series);
      }
      return true;
    });
}
