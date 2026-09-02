import { applyStaticArticleBodyUpgrade } from "@/lib/static-article-body-upgrades";
import { applyNoIncomeTaxArticleUpgrade } from "@/lib/static-no-income-tax-upgrade";
import { applyVotingGuide2026Upgrade } from "@/lib/static-voting-guide-upgrade";
import { applyGunLawsCurrentUpgrade } from "@/lib/static-gun-laws-current-upgrade";

type UpgradeCandidate = {
  updated?: string;
  editorNote?: string;
  intro?: string[];
  sections?: Array<{
    heading?: string;
    paragraphs?: string[];
    bullets?: string[];
    [key: string]: unknown;
  }>;
  faq?: Array<{ q?: string; a?: string }>;
  sources?: Array<{ label?: string; url?: string }>;
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
 * Route narrowly fingerprinted legacy static explainers through reviewed
 * authority upgrades. Each upgrade must refuse unrelated bodies so a future
 * intentional rewrite is never silently replaced.
 */
export function applyReviewedStaticArticleBodyUpgrade<T extends UpgradeCandidate>(body: T): T {
  const gunLawsUpgrade = applyGunLawsCurrentUpgrade<T>(body);
  if (gunLawsUpgrade !== body) return gunLawsUpgrade;

  const votingGuideUpgrade = applyVotingGuide2026Upgrade<T>(body);
  if (votingGuideUpgrade !== body) return votingGuideUpgrade;

  const noIncomeTaxUpgrade = applyNoIncomeTaxArticleUpgrade<T>(body);
  if (noIncomeTaxUpgrade !== body) return noIncomeTaxUpgrade;

  if (!isCurrentLegacyHomesteadExplainer(body)) return applyStaticArticleBodyUpgrade<T>(body);

  const normalizedLegacyShape = {
    ...body,
    editorNote: ORIGINAL_HOMESTEAD_EDITOR_FINGERPRINT,
    intro: [ORIGINAL_HOMESTEAD_INTRO_FINGERPRINT, ...(body.intro ?? [])],
  } as T;

  return applyStaticArticleBodyUpgrade<T>(normalizedLegacyShape);
}
