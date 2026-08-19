export type VisibleArticleDates = {
  publishedIso: string;
  updatedIso: string | null;
};

function validIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/**
 * Reader-facing article dates must never imply an update happened before or at
 * publication. Legacy static bodies often stored only a calendar review date,
 * which parses at midnight and can therefore precede a later publication time
 * on the same day. In those cases we show Published only. Updated appears only
 * when there is a genuinely later timestamp/date.
 */
export function visibleArticleDates(
  publishedAt: string | null | undefined,
  bodyUpdated: string | null | undefined,
): VisibleArticleDates {
  const publishedIso = validIso(publishedAt) ?? validIso(bodyUpdated) ?? new Date(0).toISOString();
  const candidateUpdated = validIso(bodyUpdated);
  if (!candidateUpdated) return { publishedIso, updatedIso: null };

  return new Date(candidateUpdated).getTime() > new Date(publishedIso).getTime()
    ? { publishedIso, updatedIso: candidateUpdated }
    : { publishedIso, updatedIso: null };
}
