import { describe, expect, it } from "vitest";
import { getLawTopic, LAW_TOPICS } from "@/data/law-topics";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";

describe("legal authority indexability requires actual official primary sources", () => {
  it("keeps each published authority guide indexable with a cited state statute", () => {
    const published = LAW_TOPICS.filter(isLawTopicIndexable);
    expect(published.length).toBeGreaterThanOrEqual(16);
    for (const topic of published) {
      expect(topic.sources.some((source) => source.url.startsWith("https://statutes.capitol.texas.gov/"))).toBe(true);
      expect(topic.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
      expect(topic.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it("noindexes otherwise long-form legal topics that lack an official statute", () => {
    const topic = getLawTopic("consumer-protection-deceptive-trade-law")!;
    const sources = topic.sources.map((source) => ({ ...source, url: "https://example.org/unverified" }));
    expect(isLawTopicIndexable({ ...topic, sources })).toBe(false);
  });
  it("noindexes invalid review dates or insecure legal citations", () => {
    const topic = getLawTopic("family-custody-child-support-law")!;
    expect(isLawTopicIndexable({ ...topic, updated: "not-reviewed" })).toBe(false);
    expect(isLawTopicIndexable({ ...topic, sources: [
      { ...topic.sources[0], url: "http://statutes.capitol.texas.gov/insecure" },
      ...topic.sources.slice(1),
    ] })).toBe(false);
  });
});
