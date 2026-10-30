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
  it("does not treat a TDEM navigation archive or a syndicated Governor release as extra original reporting", () => {
    const officialTitle = "Governor issues disaster declaration for El Paso County following significant flash flooding impacts";
    const originalBody = Array.from({ length: 12 }, (_, i) =>
      `State officials documented response detail number ${i + 1} for the affected county, including the appropriate state resource, local coordinating agency, and a dated assessment process that residents can verify independently.`
    ).join(" ");
    const packet = packetWith(originalBody, `${originalBody} Related Pages October 29, 2026 October 28, 2026 October 13, 2026 Accessibility Privacy Policy`);
    packet.sources[0] = {
      ...packet.sources[0],
      title: officialTitle,
      url: "https://gov.texas.gov/news/post/official-disaster-declaration",
      isPrimarySource: true,
    };
    packet.sources[1] = {
      ...packet.sources[1],
      title: officialTitle,
      url: "https://www.tdem.texas.gov/press-release/10-29-26",
      isPrimarySource: true,
    };
    const compact = compactResearchPacket(packet);
    expect(compact.sources).toHaveLength(2);
    expect(compact.sources[0].extractedBody.length).toBeGreaterThan(1000);
    expect(compact.sources[1].extractedBody).toBe("");
    expect(compact.sources[1].url).toContain("tdem.texas.gov");
    expect(researchPacketEvidenceChars(packet)).toBeLessThan(originalBody.length * 1.2);
    expect(compact.sources.map((s) => s.extractedBody).join(" ")).not.toContain("Related Pages");
  });

  it("preserves truly distinct reports about a common event even with a matching headline", () => {
    const title = "Texas officials announce emergency response assistance for multiple neighborhoods after flash flooding";
    const packet = packetWith(
      Array.from({ length: 12 }, (_, i) =>
        `Government agency officers described response operation ${i} and how the state declaration allows county staff to coordinate equipment deployments across affected districts.`
      ).join(" "),
      Array.from({ length: 12 }, (_, i) =>
        `Local journalists interviewed neighborhood resident number ${i}, documenting damaged storefronts, road closures, school changes, and independent accounts from households during the flood.`
      ).join(" "),
    );
    packet.sources[0].title = title;
    packet.sources[1].title = title;
    const compact = compactResearchPacket(packet);
    expect(compact.sources[0].extractedBody).not.toBe("");
    expect(compact.sources[1].extractedBody).not.toBe("");
  });

  it("does not hide legitimate expanded reporting when a short original is quoted within it", () => {
    const title = "Texas emergency managers release detailed report about regional water and flood recovery operations";
    const reused = Array.from({ length: 9 }, (_, i) =>
      `County officials reported response action ${i}, the time it was ordered and the equipment used to help residents after the incident.`
    ).join(" ");
    const expanded = Array.from({ length: 24 }, (_, i) =>
      `New independent records show additional assessment number ${i}, specific county documentation and a separate agency timeline not present in the earlier statement.`
    ).join(" ");
    const packet = packetWith(reused, `${reused} ${expanded}`);
    packet.sources[0].title = title;
    packet.sources[1].title = title;
    const compact = compactResearchPacket(packet);
    expect(compact.sources[1].extractedBody).toContain("New independent records");
  });

});
