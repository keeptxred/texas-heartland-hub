import { describe, expect, it } from "vitest";
import { buildResearchPacket } from "./newsroom-research-packet";

describe("newsroom research packets", () => {
  it("places verified primary sources ahead of secondary coverage", () => {
    const packet = buildResearchPacket({
      clusterId: "cluster-1",
      subject: "agency releases grid report",
      pillar: "texas-energy-oil",
      recommendedFormat: "MERGE",
      editorialScore: 82,
      sources: [
        { feedItemId: 2, title: "Coverage", source: "News Outlet", url: "https://news.example/2", publishedAt: null, description: "coverage", extractedBody: "coverage body", isPrimarySource: false, sourceReputationScore: 90 },
        { feedItemId: 1, title: "Official report", source: "ERCOT", url: "https://ercot.example/1", publishedAt: null, description: "official", extractedBody: "official body", isPrimarySource: true, sourceReputationScore: 70 },
      ],
    });
    expect(packet.sources.map((source) => source.feedItemId)).toEqual([1, 2]);
  });

  it("carries explicit anti-fabrication and attribution rules into the packet", () => {
    const packet = buildResearchPacket({ clusterId: "c", subject: "s", pillar: null, recommendedFormat: "SINGLE", editorialScore: 70, sources: [] });
    expect(packet.rules).toEqual({
      useOnlyProvidedSources: true,
      doNotInventFacts: true,
      doNotInventQuotes: true,
      preserveAttribution: true,
      preferPrimarySources: true,
    });
  });

  it("caps stored source excerpts so one source cannot dominate the prompt budget", () => {
    const packet = buildResearchPacket({
      clusterId: "c",
      subject: "s",
      pillar: null,
      recommendedFormat: "SINGLE",
      editorialScore: 70,
      sources: [{ feedItemId: 1, title: "t", source: "s", url: "u", publishedAt: null, description: "d".repeat(5000), extractedBody: "b".repeat(10000), isPrimarySource: false, sourceReputationScore: null }],
    });
    expect(packet.sources[0].description.length).toBe(3000);
    expect(packet.sources[0].extractedBody.length).toBe(8000);
  });
});
