import { describe, expect, it } from "vitest";
import { LAW_TOPIC_AUTHORITIES } from "@/data/law-topic-authorities";
import { PROPERTY_TAX_LAW_TOPIC } from "@/data/law-topic-property-tax-authority";
import { LAW_TOPICS as BASE_LAW_TOPICS } from "@/data/law-topics-base";
import { isLawTopicIndexable, MIN_LAW_TOPIC_WORDS } from "@/lib/law-topic-indexability";

describe("Law Library authority overrides", () => {
  it("uses unique canonical topic slugs", () => {
    const baseSlugs = new Set(BASE_LAW_TOPICS.map((topic) => topic.slug));
    const authoritySlugs = LAW_TOPIC_AUTHORITIES.map((topic) => topic.slug);

    expect(new Set(authoritySlugs).size).toBe(authoritySlugs.length);
    for (const slug of authoritySlugs) expect(baseSlugs.has(slug)).toBe(true);
  });

  it("requires every promoted authority to pass the unchanged readiness gate", () => {
    expect(MIN_LAW_TOPIC_WORDS).toBe(700);
    expect(LAW_TOPIC_AUTHORITIES.length).toBeGreaterThan(0);
    for (const topic of LAW_TOPIC_AUTHORITIES) expect(isLawTopicIndexable(topic)).toBe(true);
  });

  it("preserves current property-tax anchors", () => {
    expect(PROPERTY_TAX_LAW_TOPIC.updated).toBe("2026-09-06");
    expect(PROPERTY_TAX_LAW_TOPIC.quickAnswer).toContain("no state property tax");
    expect(PROPERTY_TAX_LAW_TOPIC.keyRules.join(" ")).toContain("$140,000");
    expect(PROPERTY_TAX_LAW_TOPIC.sources.length).toBeGreaterThanOrEqual(7);
    expect(PROPERTY_TAX_LAW_TOPIC.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
  });
});
