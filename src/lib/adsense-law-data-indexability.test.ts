import { describe, expect, it } from "vitest";
import { LAW_TOPICS } from "@/data/law-topics";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { isLawTopicIndexable, MIN_LAW_TOPIC_WORDS } from "@/lib/law-topic-indexability";
import { isDataDetailIndexable, MIN_DATA_DETAIL_WORDS } from "@/lib/data-detail-indexability";

describe("AdSense law/data detail indexability", () => {
  it("keeps current underdeveloped law topics out of the indexable cohort", () => {
    expect(MIN_LAW_TOPIC_WORDS).toBe(700);
    expect(LAW_TOPICS.length).toBeGreaterThan(0);
    expect(LAW_TOPICS.filter(isLawTopicIndexable)).toEqual([]);
  });

  it("keeps current underdeveloped data details out of the indexable cohort", () => {
    const datasets = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS];
    expect(MIN_DATA_DETAIL_WORDS).toBe(700);
    expect(datasets.length).toBeGreaterThan(0);
    expect(datasets.filter(isDataDetailIndexable)).toEqual([]);
  });
});
