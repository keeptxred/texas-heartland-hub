import { LAW_TOPICS as BASE_LAW_TOPICS } from "@/data/law-topics-base";
import type { LawTopic, LawTopicSource } from "@/data/law-topics-base";
import { LAW_TOPIC_AUTHORITY_BY_SLUG } from "@/data/law-topic-authorities";
import { DRIVING_TRAFFIC_INSURANCE_LAW_TOPIC } from "@/data/law-topic-driving-traffic-authority";
import { LANDLORD_TENANT_RENTALS_LAW_TOPIC } from "@/data/law-topic-landlord-tenant-authority";
import { EMPLOYMENT_WORKPLACE_LAW_TOPIC } from "@/data/law-topic-employment-workplace-authority";
import { CONSUMER_PROTECTION_LAW_TOPIC } from "@/data/law-topic-consumer-protection-authority";
import { FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC } from "@/data/law-topic-family-custody-authority";
import { WILLS_PROBATE_INHERITANCE_LAW_TOPIC } from "@/data/law-topic-wills-probate-authority";
import { CRIMINAL_OFFENSES_PENALTIES_LAW_TOPIC } from "@/data/law-topic-criminal-offenses-authority";
import { BUSINESS_FORMATION_LLC_LAW_TOPIC } from "@/data/law-topic-business-formation-authority";

export type { LawTopic, LawTopicSource } from "@/data/law-topics-base";

export const LAW_TOPICS: LawTopic[] = BASE_LAW_TOPICS.map((topic) =>
  LAW_TOPIC_AUTHORITY_BY_SLUG.get(topic.slug) ?? topic,
).concat([
  DRIVING_TRAFFIC_INSURANCE_LAW_TOPIC,
  LANDLORD_TENANT_RENTALS_LAW_TOPIC,
  EMPLOYMENT_WORKPLACE_LAW_TOPIC,
  CONSUMER_PROTECTION_LAW_TOPIC,
  FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC,
  WILLS_PROBATE_INHERITANCE_LAW_TOPIC,
  CRIMINAL_OFFENSES_PENALTIES_LAW_TOPIC,
]);

export function getLawTopic(slug: string): LawTopic | undefined {
  return LAW_TOPICS.find((topic) => topic.slug === slug);
}
