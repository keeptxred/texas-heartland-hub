import { applyStaticArticleBodyUpgrade } from "@/lib/static-article-body-upgrades";

type UpgradeCandidate = {
  editorNote?: string;
  intro?: string[];
  sections?: Array<{ heading?: string }>;
  faq?: Array<{ q?: string }>;
  [key: string]: unknown;
};

const ORIGINAL_HOMESTEAD_EDITOR_FINGERPRINT =
  "The homestead exemption removes a portion of your home's value from taxation.";
const ORIGINAL_HOMESTEAD_INTRO_FINGERPRINT =
  "Texas's homestead exemption is one of the most valuable tax benefits";

function isCurrentLegacyHomesteadExplainer(body: UpgradeCandidate): boolean {
  return Boolean(
    body.intro?.some((paragraph) =>
      paragraph.includes("If you own and occupy a Texas home as your principal residence"),
    )
      && body.sections?.some((section) => section.heading === "What the Exemption Actually Does")
      && body.faq?.some((faq) => faq.q === "What if I bought mid-year?"),
  );
}

/**
 * The homestead fixture had one intermediate editorial revision before the
 * reviewed 2026 authority upgrade was introduced. Recognize that known shape
 * with three independent structural signals, then route it through the
 * canonical upgrade. This keeps the canonical body in one place and still
 * refuses to replace unrelated or future intentionally rewritten articles.
 */
export function applyReviewedStaticArticleBodyUpgrade<T extends UpgradeCandidate>(body: T): T {
  if (!isCurrentLegacyHomesteadExplainer(body)) return applyStaticArticleBodyUpgrade(body);

  const normalizedLegacyShape = {
    ...body,
    editorNote: ORIGINAL_HOMESTEAD_EDITOR_FINGERPRINT,
    intro: [ORIGINAL_HOMESTEAD_INTRO_FINGERPRINT, ...(body.intro ?? [])],
  } as T;

  return applyStaticArticleBodyUpgrade(normalizedLegacyShape);
}
