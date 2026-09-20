import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { LAW_TOPICS } from "@/data/law-topics";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { isLawTopicIndexable, lawTopicWordCount, MIN_LAW_TOPIC_WORDS } from "@/lib/law-topic-indexability";
import { isDataDetailIndexable, MIN_DATA_DETAIL_WORDS } from "@/lib/data-detail-indexability";

const sitemap = fs.readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const lawRoute = fs.readFileSync(new URL("../routes/laws.topic.$slug.tsx", import.meta.url), "utf8");
const dataRoute = fs.readFileSync(new URL("../routes/data.$slug.tsx", import.meta.url), "utf8");

describe("AdSense law/data detail indexability", () => {
  it("allows the mature canonical law cohort while still rejecting a deliberately thin topic", () => {
    const indexableTopics = LAW_TOPICS.filter(isLawTopicIndexable);
    const deliberatelyThinTopic = {
      ...LAW_TOPICS[0],
      slug: "thin-law-topic-fixture",
      title: "Thin law topic fixture",
      dek: "Intentionally incomplete fixture used to prove the canonical readiness gate still rejects thin legal content.",
      quickAnswer: "This intentionally short answer does not satisfy the minimum depth required for an indexable Texas law authority page.",
      appliesTo: ["Regression testing"],
      framework: ["Thin fixture."],
      keyRules: ["Thin fixture."],
      questions: [],
      sources: [],
      related: [],
    };

    expect(MIN_LAW_TOPIC_WORDS).toBe(700);
    expect(LAW_TOPICS.length).toBeGreaterThan(0);
    expect(indexableTopics.some((topic) => topic.slug === "property-tax-law")).toBe(true);
    expect(indexableTopics).toHaveLength(LAW_TOPICS.length);
    expect(lawTopicWordCount(deliberatelyThinTopic)).toBeLessThan(MIN_LAW_TOPIC_WORDS);
    expect(isLawTopicIndexable(deliberatelyThinTopic)).toBe(false);
  });

  it("keeps underdeveloped data details out while allowing readiness-qualified details in", () => {
    const datasets = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS];
    const indexableDatasets = datasets.filter(isDataDetailIndexable);
    const underdevelopedDatasets = datasets.filter((dataset) => !isDataDetailIndexable(dataset));

    expect(MIN_DATA_DETAIL_WORDS).toBe(700);
    expect(datasets.length).toBeGreaterThan(0);
    expect(indexableDatasets.some((dataset) => dataset.slug === "border-security")).toBe(true);
    expect(underdevelopedDatasets.length).toBeGreaterThan(0);
    expect(indexableDatasets.length).toBeLessThan(datasets.length);
  });

  it("uses readiness for direct-route robots metadata", () => {
    expect(lawRoute).toContain("isLawTopicIndexable(loaderData.topic)");
    expect(dataRoute).toContain("isDataDetailIndexable(loaderData.dataset)");
    expect(lawRoute).toContain('"noindex,follow"');
    expect(dataRoute).toContain('"noindex,follow"');
  });

  it("uses the same readiness-filtered cohorts in sitemap-pages", () => {
    expect(sitemap).toContain("const INDEXABLE_LAW_TOPICS = LAW_TOPICS.filter(isLawTopicIndexable)");
    expect(sitemap).toContain("const INDEXABLE_DATA_SETS = ALL_DATA_SETS.filter(isDataDetailIndexable)");
    expect(sitemap).toContain("...INDEXABLE_LAW_TOPICS.map((topic)=>`/laws/topic/${topic.slug}`)");
    expect(sitemap).toContain("...INDEXABLE_DATA_SETS.map((dataset)=>`/data/${dataset.slug}`)");
    expect(sitemap).not.toContain("...LAW_TOPICS.map((topic)=>`/laws/topic/${topic.slug}`)");
    expect(sitemap).not.toContain("...ALL_DATA_SETS.map((dataset)=>`/data/${dataset.slug}`)");
  });
});
