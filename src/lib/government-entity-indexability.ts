import type { GovernmentEntity } from "@/lib/texas-government";

export const MIN_GOVERNMENT_ENTITY_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function governmentEntityWordCount(entity: GovernmentEntity) {
  return words([
    entity.name,
    entity.overview,
    entity.constitutionalResponsibilities,
    entity.currentOfficeholder,
    entity.officeholderNote,
    ...entity.constitutionalBasis,
    ...entity.history,
    ...entity.powers,
    ...entity.limitations,
    ...entity.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" "));
}

export function isGovernmentEntityIndexable(entity: GovernmentEntity | null | undefined): entity is GovernmentEntity {
  return Boolean(entity)
    && governmentEntityWordCount(entity!) >= MIN_GOVERNMENT_ENTITY_WORDS
    && entity!.constitutionalBasis.length >= 2
    && entity!.history.length >= 3
    && entity!.powers.length >= 4
    && entity!.limitations.length >= 3
    && entity!.faqs.length >= 4
    && entity!.officialUrl.startsWith("https://");
}
