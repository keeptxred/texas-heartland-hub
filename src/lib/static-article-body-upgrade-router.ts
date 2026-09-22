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

/**
 * Route narrowly fingerprinted active KTR-owned static explainers through
 * reviewed authority upgrades. Migrated TexasDefined homeowner guides must
 * never be upgraded or rendered here.
 */
export function applyReviewedStaticArticleBodyUpgrade<T extends UpgradeCandidate>(body: T): T {
  const gunLawsUpgrade = applyGunLawsCurrentUpgrade(body);
  if (gunLawsUpgrade !== body) return gunLawsUpgrade;

  const votingGuideUpgrade = applyVotingGuide2026Upgrade(body);
  if (votingGuideUpgrade !== body) return votingGuideUpgrade;

  const noIncomeTaxUpgrade = applyNoIncomeTaxArticleUpgrade(body);
  if (noIncomeTaxUpgrade !== body) return noIncomeTaxUpgrade;

  return body;
}
