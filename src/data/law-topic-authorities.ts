import type { LawTopic } from "@/data/law-topics-base";
import { PROPERTY_TAX_LAW_TOPIC } from "@/data/law-topic-property-tax-authority";
import { ELECTION_LAW_TOPIC } from "@/data/law-topic-election-authority";
import { OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC } from "@/data/law-topic-open-records-authority";
import { ADMINISTRATIVE_RULEMAKING_LAW_TOPIC } from "@/data/law-topic-administrative-rulemaking-authority";
import { LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC } from "@/data/law-topic-local-government-authority";

export const LAW_TOPIC_AUTHORITIES: readonly LawTopic[] = [
  PROPERTY_TAX_LAW_TOPIC,
  ELECTION_LAW_TOPIC,
  OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC,
  ADMINISTRATIVE_RULEMAKING_LAW_TOPIC,
  LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC,
];

export const LAW_TOPIC_AUTHORITY_BY_SLUG = new Map(
  LAW_TOPIC_AUTHORITIES.map((topic) => [topic.slug, topic] as const),
);
