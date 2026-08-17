import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildStructuredFactLedger, buildStructuredFactPacket } from "./structured-fact-provenance";
import type { StoryCluster } from "./story-clustering";

function clusterWith(bodyA: string, bodyB: string, bodyC?: string): StoryCluster {
  return {
    primary: {
      id: 101,
      title: "ERCOT announces new Texas grid capacity plan",
      source: "ERCOT",
      link: "https://www.ercot.com/news/release/grid-plan",
      pub_date: "2026-08-16T14:00:00Z",
      extracted_body: bodyA,
    },
    members: [
      {
        id: 102,
        title: "Texas grid plan adds new capacity",
        source: "Austin News",
        link: "https://austin.example/grid-plan",
        pub_date: "2026-08-16T14:20:00Z",
        extracted_body: bodyB,
        combinationScore: 92,
        overlapTerms: ["ercot", "grid", "capacity"],
      },
      ...(bodyC ? [{
        id: 103,
        title: "Texas grid capacity plan details emerge",
        source: "Dallas News",
        link: "https://dallas.example/grid-plan",
        pub_date: "2026-08-16T14:40:00Z",
        extracted_body: bodyC,
        combinationScore: 90,
        overlapTerms: ["ercot", "grid", "capacity"],
      }] : []),
    ],
    score: 92,
    sourceCount: bodyC ? 3 : 2,
    strongMerge: true,
  };
}

describe("structured fact provenance", () => {
  it("promotes independently corroborated facts and preserves primary-record support", () => {
    const cluster = clusterWith(
      "ERCOT announced the Texas grid plan will add 2,400 megawatts of capacity on August 16, 2026. The agency said the first phase will take effect September 1.",
      "ERCOT announced a Texas grid plan adding 2,400 megawatts of capacity on August 16, 2026. The first phase is expected to take effect September 1.",
    );
    const ledger = buildStructuredFactLedger(cluster);
    const corroborated = ledger.facts.find((fact) => fact.corroborationCount >= 2 && fact.primaryRecordSupport);
    expect(corroborated).toBeTruthy();
    expect(ledger.keyNumbers.some((fact) => fact.numericValues.some((value) => value.includes("2,400")))).toBe(true);
    expect(ledger.whatNext.length).toBeGreaterThan(0);
  });

  it("uses independently sourced action headlines to corroborate pause events", () => {
    const cluster: StoryCluster = {
      primary: {
        id: 201,
        title: "Trump administration pauses border construction in Big Bend National Park",
        source: "Texas Standard",
        link: "https://texasstandard.org/stories/big-bend-pause/",
        pub_date: "2026-08-17T19:59:17Z",
        extracted_body: "U.S. Customs and Border Protection Commissioner Rodney Scott said Monday he was pausing all construction activity in the West Texas park ahead of a visit.",
      },
      members: [
        {
          id: 202,
          title: "Trump administration pauses border construction in Big Bend National Park",
          source: "Houston Public Media",
          link: "https://www.houstonpublicmedia.org/articles/news/big-bend-pause/",
          pub_date: "2026-08-17T19:59:04Z",
          extracted_body: "Scott said he ordered construction paused Sunday night and planned an on-the-ground evaluation with local stakeholders.",
          combinationScore: 100,
          overlapTerms: ["trump", "administration", "pauses", "border", "construction", "big", "bend"],
        },
      ],
      score: 100,
      sourceCount: 2,
      strongMerge: true,
    } as StoryCluster;

    const ledger = buildStructuredFactLedger(cluster);
    const pauseFact = ledger.facts.find(
      (fact) => fact.type === "action" && fact.normalizedText.includes("pauses border construction"),
    );
    expect(pauseFact).toBeTruthy();
    expect(pauseFact?.corroborationCount).toBe(2);
    expect(pauseFact?.sourceFeedItemIds).toEqual([201, 202]);
  });

  it("marks incompatible figures from similar claims as a source conflict", () => {
    const cluster = clusterWith(
      "ERCOT announced the Texas grid plan will add 2,400 megawatts of capacity after the Austin review.",
      "ERCOT announced the Texas grid plan will add 2,400 megawatts of capacity after the Austin review.",
      "ERCOT announced the Texas grid plan will add 2,600 megawatts of capacity after the Austin review.",
    );
    const ledger = buildStructuredFactLedger(cluster);
    expect(ledger.conflicts.length).toBeGreaterThan(0);
    expect(ledger.conflicts.some((fact) => fact.numericValues.includes("2,400 megawatts") && fact.numericValues.includes("2,600 megawatts"))).toBe(true);
    expect(buildStructuredFactPacket(ledger)).toContain("ATTRIBUTE, DO NOT SILENTLY RECONCILE");
  });

  it("keeps quotations tied to the source that contains them", () => {
    const cluster = clusterWith(
      'ERCOT announced the plan. “This gives the grid more flexibility for future demand,” ERCOT said.',
      "Austin officials reported the same grid announcement without quoting ERCOT directly.",
    );
    const ledger = buildStructuredFactLedger(cluster);
    expect(ledger.quotations).toHaveLength(1);
    expect(ledger.quotations[0].sourceLabels).toEqual(["ERCOT"]);
    expect(ledger.quotations[0].sourceFeedItemIds).toEqual([101]);
  });

  it("stores Phase 3 fact provenance in a durable cluster-linked table", () => {
    const migration = readFileSync("supabase/migrations/20260816151000_add_news_event_fact_provenance.sql", "utf8");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.news_event_facts");
    expect(migration).toContain("REFERENCES public.news_event_clusters(id)");
    expect(migration).toContain("corroboration_count");
    expect(migration).toContain("primary_record_support");
    expect(migration).toContain("source_feed_item_ids");
    expect(migration).toContain("has_conflict");
  });

  it("feeds the structured ledger into the existing synthesis call rather than creating a second AI stage", () => {
    const publisher = readFileSync("src/lib/multi-source-publish.ts", "utf8");
    expect(publisher).toContain("STRUCTURED FACT LEDGER");
    expect(publisher).toContain("RAW SOURCE PACKET");
    expect(publisher).toContain("buildStructuredFactLedger");
    expect(publisher).toContain("publishLegacySingleFeedItem(feedItemId)");
  });
});
