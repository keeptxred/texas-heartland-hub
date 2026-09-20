import { LAW_TOPICS as BASE_LAW_TOPICS } from "@/data/law-topics-base";
import type { LawTopic, LawTopicSource } from "@/data/law-topics-base";
import { LAW_TOPIC_AUTHORITY_BY_SLUG } from "@/data/law-topic-authorities";

export type { LawTopic, LawTopicSource } from "@/data/law-topics-base";

export const LAW_TOPICS: LawTopic[] = BASE_LAW_TOPICS.map((topic) =>
  LAW_TOPIC_AUTHORITY_BY_SLUG.get(topic.slug) ?? topic,
);

export function getLawTopic(slug: string): LawTopic | undefined {
  return LAW_TOPICS.find((topic) => topic.slug === slug);
}
