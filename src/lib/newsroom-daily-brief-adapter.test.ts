import { describe, expect, it } from "vitest";
import {
  dailyBriefSystemPrompt,
  dailyBriefUserPrompt,
  validateDailyBriefDraft,
  type DailyBriefPacketItem,
  type TexasDailyBriefDraft,
} from "./newsroom-daily-brief-adapter";
import type { ResearchPacket } from "./newsroom-research-packet";

function packet(clusterId: string, subject: string): ResearchPacket {
  return {
    packetVersion: 1,
    clusterId,
    subject,
    pillar: "texas-news",
    recommendedFormat: "SINGLE",
    editorialScore: 60,
    rules: {
      useOnlyProvidedSources: true,
      doNotInventFacts: true,
      doNotInventQuotes: true,
      preserveAttribution: true,
      preferPrimarySources: true,
    },
    sources: [{
      feedItemId: 1,
      title: subject,
      source: "Texas Agency",
      url: `https://example.gov/${clusterId}`,
      publishedAt: "2026-08-15T12:00:00Z",
      description: `${subject} description`,
      extractedBody: `${subject} body with source-grounded details for the packet.`,
      isPrimarySource: true,
      sourceReputationScore: 95,
    }],
  };
}

const selected: DailyBriefPacketItem[] = [
  { candidateId: "a", clusterId: "c1", editorialScore: 65, recommendedFormat: "SINGLE", packet: packet("c1", "Texas water project advances") },
  { candidateId: "b", clusterId: "c2", editorialScore: 62, recommendedFormat: "MERGE", packet: packet("c2", "State board approves grant round") },
  { candidateId: "c", clusterId: "c3", editorialScore: 60, recommendedFormat: "SINGLE", packet: packet("c3", "Texas university announces expansion") },
];

describe("Texas Daily Brief adapter", () => {
  it("requires source-only coverage without forcing a pillar mix", () => {
    const prompt = dailyBriefSystemPrompt(3);
    expect(prompt).toContain("exactly 3 secondary statewide developments");
    expect(prompt).toContain("Use only facts");
    expect(prompt).toContain("Do not force a pillar mix");
    expect(prompt).toContain("Never invent quotes");
  });

  it("serializes each selected cluster with its source packet", () => {
    const payload = JSON.parse(dailyBriefUserPrompt(selected));
    expect(payload.itemCount).toBe(3);
    expect(payload.developments.map((item: { clusterId: string }) => item.clusterId)).toEqual(["c1", "c2", "c3"]);
    expect(payload.developments[0].sources[0].source).toBe("Texas Agency");
  });

  it("rejects a brief that changes the selected cluster set", () => {
    const draft: TexasDailyBriefDraft = {
      title: "Texas Daily Brief: Three updates across the state",
      dek: "A concise look at several Texas developments.",
      summary: "Texas officials and institutions advanced several developments across the state today, including a water project, a grant round and a university expansion. The Daily Brief brings those secondary updates together in one source-grounded report while preserving the distinction between the separate events and the agencies or institutions responsible for each action.",
      items: [
        { clusterId: "c1", heading: "Water project", whyItMatters: "It affects state infrastructure planning.", paragraphs: ["One factual paragraph.", "A second factual paragraph."] },
        { clusterId: "c2", heading: "Grant round", whyItMatters: "It affects state funding.", paragraphs: ["One factual paragraph.", "A second factual paragraph."] },
        { clusterId: "wrong", heading: "Expansion", whyItMatters: "It affects capacity.", paragraphs: ["One factual paragraph.", "A second factual paragraph."] },
      ],
      watchNext: ["Watch official implementation updates."],
      faq: [{ q: "What is the Texas Daily Brief?", a: "A grouped update on secondary statewide developments." }],
    };
    const result = validateDailyBriefDraft(draft, selected);
    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("cluster_mismatch");
  });

  it("rejects thin output before any publish path", () => {
    const draft: TexasDailyBriefDraft = {
      title: "Texas Daily Brief: Three updates across the state",
      dek: "A concise look at several Texas developments.",
      summary: "Texas officials and institutions advanced several developments across the state today, including a water project, a grant round and a university expansion. The Daily Brief brings those secondary updates together in one source-grounded report while preserving the distinction between the separate events and the agencies or institutions responsible for each action.",
      items: selected.map((item) => ({ clusterId: item.clusterId, heading: item.packet.subject, whyItMatters: "Texas relevance.", paragraphs: ["Too short.", "Still too short."] })),
      watchNext: ["Watch for updates."],
      faq: [],
    };
    const result = validateDailyBriefDraft(draft, selected);
    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("below_news_word_floor");
  });
});
