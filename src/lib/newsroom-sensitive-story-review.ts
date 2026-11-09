/**
 * Hard-news claims about criminal conduct, official raids and unproven
 * civil allegations must pass editorial review BEFORE publication.
 *
 * The ordinary multi-source/featured-image quality gates still apply;
 * this is a narrow extra hold, not an automatic evidence verdict.
 */
const SENSITIVE_ALLEGATION_RE =
  /\b(?:fbi|federal\s+(?:agents?|investigat(?:ion|ions|ors?)|raid|search(?:es|ed)?)|raid(?:s|ed)?|fraud(?:ulent)?|lawsuits?|arrest(?:s|ed)?|indict(?:ed|ment|ments)?|charged|criminal\s+charg(?:e|es)|suspect(?:s|ed)?|accus(?:e|es|ed|ations?)|alleg(?:e|es|ed|ations?)|homicide|murder(?:s|ed)?|sexual\s+assault)\b/i;

export const SENSITIVE_NEWSROOM_REVIEW_REASON =
  "Sensitive investigation or allegation: corroborate facts, legal status and original records before publishing.";

export function requiresSensitiveNewsroomReview(input: {
  title?: string | null;
  description?: string | null;
}): boolean {
  return SENSITIVE_ALLEGATION_RE.test(
    String(input.title ?? "") + " " + String(input.description ?? ""),
  );
}
