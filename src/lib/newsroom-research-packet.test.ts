import { describe, expect, it } from "vitest";
import { buildResearchPacket, researchPacketEvidenceChars } from "./newsroom-research-packet";

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

  it("drops an unrelated long Tesla description mistakenly attached to a White House arrest article", () => {
    const arrestTitle = "Venezuelan man who said voices told him to kill Trump is arrested near White House, DHS says";
    const arrestBody = ("White House authorities arrested a Venezuelan man after police recovered firearms. " +
      "The Department of Homeland Security said the White House investigation followed arrest reports involving Trump. ").repeat(15);
    const misattachedTeslaDescription = ("Tesla Cybertruck production will end at the Austin Gigafactory. " +
      "Elon Musk wants to increase Cybercab robotaxi output by the middle of next year. ").repeat(9);
    const packet = buildResearchPacket({
      clusterId: "cross-story",
      subject: arrestTitle,
      pillar: "texas-politics-government",
      recommendedFormat: "SINGLE",
      editorialScore: 80,
      sources: [{ feedItemId: 6836756, title: arrestTitle, source: "NBC DFW",
        url: "https://www.nbcdfw.com/news/national-international/venezuelan-man-arrested-near-white-house-dhs-says/4102872/",
        publishedAt: null, description: misattachedTeslaDescription,
        extractedBody: arrestBody, isPrimarySource: false, sourceReputationScore: 80 }],
    });
    expect(packet.sources[0].description).toBe("");
    expect(packet.sources[0].extractedBody).toContain("White House");
    expect(researchPacketEvidenceChars(packet)).toBeGreaterThan(1000);
    // Also protect stored packets created before the ingestion repair.
    const oldPacket = { ...packet, sources: [{ ...packet.sources[0], description: misattachedTeslaDescription }] };
    expect(researchPacketEvidenceChars(oldPacket)).toBe(researchPacketEvidenceChars(packet));
  });

  it("retains a long genuinely related description and short or unhydrated descriptions", () => {
    const title = "Venezuelan man arrested near White House after a reported threat to Trump";
    const body = ("A Venezuelan man was arrested near the White House after a reported threat to Trump. ").repeat(20);
    const description = ("Investigators say a Venezuelan man was arrested near the White House after he allegedly made a threat to Trump. ").repeat(7);
    const make = (d: string, b: string) => buildResearchPacket({
      clusterId: "good", subject: title, pillar: null,
      recommendedFormat: "SINGLE", editorialScore: 70,
      sources: [{ feedItemId: 1, title, source: "Publisher", url: "https://publisher.example/good",
        publishedAt: null, description: d, extractedBody: b,
        isPrimarySource: false, sourceReputationScore: 80 }],
    });
    expect(make(description, body).sources[0].description).toBe(description);
    expect(make("Context reported separately", body).sources[0].description).toBe("Context reported separately");
    expect(make(description, "").sources[0].description).toBe(description);
  });

  it("never treats KTR synthetic multi-source packets as publisher evidence", () => {
    const synthetic = `MULTI-SOURCE STORY PACKET.\nRAW SOURCE PACKET\n${"synthetic generated material. ".repeat(300)}`;
    const packet = buildResearchPacket({
      clusterId: "c-synthetic",
      subject: "source integrity",
      pillar: "texas-politics-government",
      recommendedFormat: "MERGE",
      editorialScore: 75,
      sources: [{
        feedItemId: 1,
        title: "Source story",
        source: "Publisher",
        url: "https://publisher.example/story",
        publishedAt: null,
        description: "MULTI-SOURCE STORY PACKET. synthetic description",
        extractedBody: synthetic,
        isPrimarySource: false,
        sourceReputationScore: 80,
      }],
    });
    expect(packet.sources[0].description).toBe("");
    expect(packet.sources[0].extractedBody).toBe("");
    expect(researchPacketEvidenceChars(packet)).toBe(0);
  });
});
