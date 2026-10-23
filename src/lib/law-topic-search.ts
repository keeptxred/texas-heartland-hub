import type { LawTopic } from "@/data/law-topics";

/**
 * Small, deterministic in-browser search of already-indexable Texas law topics.
 * Search substantive answers and statutes rather than titles alone.
 * No remote queries and no collection of legal questions or personal data.
 */
export function lawTopicMatchesQuery(topic: LawTopic, rawQuery: string): boolean {
  const terms = rawQuery.trim().toLocaleLowerCase("en-US").split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const searchable = [
    topic.title,
    topic.dek,
    topic.quickAnswer,
    ...topic.appliesTo,
    ...topic.keyRules,
    ...topic.framework,
    ...topic.questions.flatMap((item) => [item.q, item.a]),
    ...topic.sources.flatMap((source) => [source.label, source.note ?? ""]),
  ].join(" ").toLocaleLowerCase("en-US");
  return terms.every((term) => searchable.includes(term));
}
