import type { LawTopic } from "@/data/law-topics-base";
import { PROPERTY_TAX_LAW_TOPIC } from "@/data/law-topic-property-tax-authority";

export const LAW_TOPIC_AUTHORITIES: readonly LawTopic[] = [
  PROPERTY_TAX_LAW_TOPIC,
];

export const LAW_TOPIC_AUTHORITY_BY_SLUG = new Map(
  LAW_TOPIC_AUTHORITIES.map((topic) => [topic.slug, topic] as const),
);
