/**
 * Text-only Facebook news posting is disabled site-wide. The KTR social
 * contract requires a verified image asset for every published Facebook post.
 * Keep the predicate as an explicit false gate so callers with older
 * allow_text_first arguments fail closed rather than silently falling back
 * to headline-and-URL posts.
 */
export type FacebookTextFirstArticle = {
  kind: string | null;
  content_quality_score: number | null;
  quality_flags: string[] | null;
  featured_image_url: string | null;
};

export function isEligibleTextFirstFacebookArticle(_article: FacebookTextFirstArticle): boolean {
  return false;
}
