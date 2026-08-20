import { describe, expect, it } from "vitest";
import { LAW_TOPICS } from "@/data/law-topics";

const MIN_WORDS = 800;
const MIN_SOURCES = 3;
const MIN_FRAMEWORK = 3;
const MIN_KEY_RULES = 4;
const MIN_QUESTIONS = 2;
const MIN_QUICK_ANSWER_WORDS = 25;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function topicWordCount(topic: (typeof LAW_TOPICS)[number]) {
  return words([
    topic.title,
    topic.dek,
    topic.quickAnswer,
    ...topic.appliesTo,
    ...topic.framework,
    ...topic.keyRules,
    ...topic.questions.flatMap((item) => [item.q, item.a]),
  ].join(" "));
}

describe("AdSense law-topic readiness inventory", () => {
  it("keeps every sitemap-advertised law topic substantive and source-backed", () => {
    const violations = LAW_TOPICS.flatMap((topic) => {
      const blockers: string[] = [];
      const count = topicWordCount(topic);
      if (count < MIN_WORDS) blockers.push(`words=${count}<${MIN_WORDS}`);
      if (topic.sources.length < MIN_SOURCES) blockers.push(`sources=${topic.sources.length}<${MIN_SOURCES}`);
      if (topic.framework.length < MIN_FRAMEWORK) blockers.push(`framework=${topic.framework.length}<${MIN_FRAMEWORK}`);
      if (topic.keyRules.length < MIN_KEY_RULES) blockers.push(`keyRules=${topic.keyRules.length}<${MIN_KEY_RULES}`);
      if (topic.questions.length < MIN_QUESTIONS) blockers.push(`questions=${topic.questions.length}<${MIN_QUESTIONS}`);
      if (words(topic.quickAnswer) < MIN_QUICK_ANSWER_WORDS) blockers.push(`quickAnswer=${words(topic.quickAnswer)}<${MIN_QUICK_ANSWER_WORDS}`);
      return blockers.length ? [`${topic.slug}: ${blockers.join(", ")}`] : [];
    });
    expect(violations, violations.join("\n")).toEqual([]);
  });
});
