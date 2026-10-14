/**
 * Current-news lists are a dated news product, not a catalogue of recovered
 * historical links. Historical URLs stay available on their own routes and
 * via the author/archive experience, but should not appear as "Latest".
 */
export const CURRENT_NEWS_WINDOW_DAYS = 7;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MAX_CLOCK_SKEW_MS = 60 * 60 * 1000;

export type CurrentNewsCandidate = {
  published_at: string;
  quality_flags?: string[] | null;
};

export function isCurrentNewsCandidate(
  article: CurrentNewsCandidate,
  now = new Date(),
): boolean {
  if ((article.quality_flags ?? []).some((flag) =>
    flag === "legacy_url_restored" || flag === "historical_archive" || flag === "historical_reconstruction"
  )) return false;

  const publicationMs = Date.parse(article.published_at);
  if (!Number.isFinite(publicationMs)) return false;
  const ageMs = now.getTime() - publicationMs;
  return ageMs >= -MAX_CLOCK_SKEW_MS
    && ageMs <= CURRENT_NEWS_WINDOW_DAYS * ONE_DAY_MS;
}
