import { describe, expect, it } from "vitest";
import {
  compactResearchPacket,
  researchPacketEvidenceChars,
  type ResearchPacket,
} from "./newsroom-research-packet";

function packetWith(bodyA: string, bodyB = ""): ResearchPacket {
  return {
    packetVersion: 1,
    clusterId: "cluster-dedup",
    subject: "test subject",
    pillar: "texas-news",
    recommendedFormat: "MERGE",
    editorialScore: 75,
    rules: {
      useOnlyProvidedSources: true,
      doNotInventFacts: true,
      doNotInventQuotes: true,
      preserveAttribution: true,
      preferPrimarySources: true,
    },
    sources: [
      {
        feedItemId: 1,
        title: "Source one",
        source: "Outlet A",
        url: "https://example.com/a",
        publishedAt: null,
        description: "",
        extractedBody: bodyA,
        isPrimarySource: false,
        sourceReputationScore: 90,
      },
      {
        feedItemId: 2,
        title: "Source two",
        source: "Outlet B",
        url: "https://example.com/b",
        publishedAt: null,
        description: "",
        extractedBody: bodyB,
        isPrimarySource: false,
        sourceReputationScore: 80,
      },
    ],
  };
}

describe("newsroom research packet evidence", () => {
  it("removes recursive packet boilerplate and exact repeated evidence", () => {
    const fact = "Texas officials announced a concrete policy change affecting state grant funding on Friday.";
    const packet = packetWith(
      `MULTI-SOURCE STORY PACKET.\nUse only facts supported by the sources below.\nSOURCE 1:\nSOURCE MATERIAL:\n${fact}\n${fact}`,
      fact,
    );
    const compact = compactResearchPacket(packet);
    const combined = compact.sources.map((source) => source.extractedBody).join("\n");
    expect(combined.match(/Texas officials announced/g)).toHaveLength(1);
    expect(combined).not.toContain("MULTI-SOURCE STORY PACKET");
    expect(combined).not.toContain("SOURCE MATERIAL:");
  });

  it("counts only unique substantive evidence rather than raw nested packet size", () => {
    const fact = "Texas officials announced a concrete policy change affecting state grant funding on Friday.";
    const packet = packetWith(`${fact} ${fact} ${fact}`, fact);
    expect(researchPacketEvidenceChars(packet)).toBeLessThan(`${fact} ${fact} ${fact}${fact}`.length);
    expect(researchPacketEvidenceChars(packet)).toBeGreaterThanOrEqual(fact.length);
  });
});
