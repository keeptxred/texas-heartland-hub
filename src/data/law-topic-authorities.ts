import type { LawTopic } from "@/data/law-topics-base";
import { PROPERTY_TAX_LAW_TOPIC } from "@/data/law-topic-property-tax-authority";
import { ELECTION_LAW_TOPIC } from "@/data/law-topic-election-authority";
import { OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC } from "@/data/law-topic-open-records-authority";
import { ADMINISTRATIVE_RULEMAKING_LAW_TOPIC } from "@/data/law-topic-administrative-rulemaking-authority";
import { LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC } from "@/data/law-topic-local-government-authority";
import { GUN_CARRY_LAW_TOPIC } from "@/data/law-topic-gun-carry-authority";
import { SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC } from "@/data/law-topic-self-defense-authority";
import { PARENTAL_RIGHTS_EDUCATION_LAW_TOPIC } from "@/data/law-topic-parental-rights-education-authority";
import { EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC } from "@/data/law-topic-eminent-domain-authority";

export const LAW_TOPIC_AUTHORITIES: readonly LawTopic[] = [
  PROPERTY_TAX_LAW_TOPIC,
  ELECTION_LAW_TOPIC,
  OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC,
  ADMINISTRATIVE_RULEMAKING_LAW_TOPIC,
  LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC,
  GUN_CARRY_LAW_TOPIC,
  SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC,
  PARENTAL_RIGHTS_EDUCATION_LAW_TOPIC,
  EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC,
];

export const LAW_TOPIC_AUTHORITY_BY_SLUG = new Map(
  LAW_TOPIC_AUTHORITIES.map((topic) => [topic.slug, topic] as const),
);
