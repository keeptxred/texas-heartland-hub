/**
 * Allow no-image Facebook link posts ONLY for substantive, source-backed,
 * non-quarantined newsroom news with no canonical featured image.
 * Photo posts retain the existing, strict image-readiness contract.
 */
export type FacebookTextFirstArticle = {
  kind: string | null;
  content_quality_score: number | null;
  quality_flags: string[] | null;
  featured_image_url: string | null;
};

const BLOCKING_FLAGS = new Set([
  "seo_noindex", "source_integrity_failure", "seo_false_multisource",
  "internal_repetition", "duplicate_story", "seo_low_value_commodity",
  "chatgpt-admin-ignored", "seo_off_topic",
]);

export function isEligibleTextFirstFacebookArticle(article: FacebookTextFirstArticle): boolean {
  if (article.kind !== "news" || (article.content_quality_score ?? 0) < 72) return false;
  if (article.featured_image_url?.trim()) return false;
  if ((article.quality_flags ?? []).some((flag) => BLOCKING_FLAGS.has(flag))) return false;
  return true;
}
