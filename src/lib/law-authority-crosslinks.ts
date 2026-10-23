import { ALL_GUIDES } from "@/data/all-guides";
import { getLawTopic } from "@/data/law-topics";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";
import { lawGuidesForTopic } from "@/lib/law-guides";
import type { LawTopic as SupportingGuideTopic } from "@/lib/law-guides-core";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

/**
 * Keep this map intentional: only link specific verified legal frameworks,
 * rather than automatically linking an unrelated legal guide by keyword.
 * Shared by existing and future supporting-guide pages.
 */
export const LAW_AUTHORITY_BY_GUIDE_TOPIC: Partial<Record<SupportingGuideTopic, string>> = {
  driving: "driving-traffic-insurance-law",
  "landlord-tenant": "landlord-tenant-rentals-law",
  employment: "employment-wages-workplace-rights-law",
  family: "family-custody-child-support-law",
  probate: "wills-probate-inheritance-law",
  consumer: "consumer-protection-deceptive-trade-law",
  elections: "election-law",
  "open-government": "open-records-public-information",
  "property-tax": "property-tax-law",
  education: "parental-rights-education-law",
  "self-defense-firearms": "gun-carry-law",
};

/** Do not recommend an unfinished, noindex or nonexistent authority page. */
export function authorityForSupportingGuideTopic(topic: SupportingGuideTopic) {
  const slug = LAW_AUTHORITY_BY_GUIDE_TOPIC[topic];
  const authority = slug ? getLawTopic(slug) : undefined;
  return isLawTopicIndexable(authority) ? authority : null;
}

/**
 * Link to currently public supporting legal guides. The registry filters
 * unpublished, legacy and unverified content; new verified guides enter
 * the authority graph automatically without manually editing every page.
 */
export function publicSupportingGuidesForAuthority(authoritySlug: string) {
  const guideTopics: Partial<Record<string, SupportingGuideTopic>> = {
    "driving-traffic-insurance-law": "driving",
    "landlord-tenant-rentals-law": "landlord-tenant",
    "employment-wages-workplace-rights-law": "employment",
    "family-custody-child-support-law": "family",
    "wills-probate-inheritance-law": "probate",
    "consumer-protection-deceptive-trade-law": "consumer",
    "election-law": "elections",
    "open-records-public-information": "open-government",
    "property-tax-law": "property-tax",
    "parental-rights-education-law": "education",
    "gun-carry-law": "self-defense-firearms",
    "self-defense-use-of-force": "self-defense-firearms",
    "eminent-domain-property-rights": "hoa-property",
  };
  const group = guideTopics[authoritySlug];
  if (!group) return [];
  return lawGuidesForTopic(group)
    .filter((meta) => meta.status === "verified")
    .map((meta) => ({ meta, guide: ALL_GUIDES[meta.slug] }))
    .filter(({ guide }) => isSupportingGuideIndexable(guide))
    .slice(0, 8)
    .map(({ meta, guide }) => ({
      slug: meta.slug,
      title: guide.title,
      description: guide.dek,
      href: meta.canonicalPath ?? `/guides/${meta.slug}`,
    }));
}
