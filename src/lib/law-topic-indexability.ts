import type { LawTopic } from "@/data/law-topics";

export const MIN_LAW_TOPIC_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function lawTopicWordCount(topic: LawTopic) {
  return words([
    topic.title,
    topic.dek,
    topic.quickAnswer,
    ...topic.appliesTo,
    ...topic.framework,
    ...topic.keyRules,
    ...topic.questions.flatMap((item) => [item.q, item.a]),
    ...topic.sources.flatMap((source) => [source.label, source.note ?? ""]),
  ].join(" "));
}

export function isLawTopicIndexable(topic: LawTopic | null | undefined): topic is LawTopic {
  return Boolean(topic)
    && lawTopicWordCount(topic!) >= MIN_LAW_TOPIC_WORDS
    && topic!.sources.length >= 3
    && topic!.framework.length >= 3
    && topic!.keyRules.length >= 4
    && topic!.questions.length >= 3
    && words(topic!.quickAnswer) >= 25;
}
