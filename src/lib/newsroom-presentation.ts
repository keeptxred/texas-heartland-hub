/**
 * A current-news timeline must not treat the fallback Reserve Desk's useful
 * evergreen explainers as news reports. This is display classification only:
 * it cannot approve, publish or promote a row through quality gates.
 */
export const RESERVE_DESK_SOURCE = "Keep TX Red Reserve Desk";

type NewsroomItem = {
  source_name?: string | null;
  kind?: string | null;
};

export type ArchivedNewsroomItem = NewsroomItem & {
  quality_flags?: string[] | null;
};

export function isReserveDeskExplainer(article: NewsroomItem): boolean {
  return (article.source_name ?? "").trim().toLowerCase() === RESERVE_DESK_SOURCE.toLowerCase();
}

export function isNewsroomReport(article: NewsroomItem): boolean {
  return article.kind === "news" && !isReserveDeskExplainer(article);
}

const ARCHIVE_EXCLUSION_FLAGS = new Set([
  // Newsroom archives are an internal discovery surface. Do not promote
  // previously flagged low-value, repetitive or unsafe articles to it.
  "seo_noindex",
  "seo_low_value_commodity",
  "source_integrity_failure",
  "internal_repetition",
  "legacy_url_restored",
  "historical_archive",
  "historical_reconstruction",
]);

export function isEligiblePreviousReport(article: ArchivedNewsroomItem): boolean {
  return isNewsroomReport(article)
    && !(article.quality_flags ?? []).some((flag) => ARCHIVE_EXCLUSION_FLAGS.has(flag));
}
