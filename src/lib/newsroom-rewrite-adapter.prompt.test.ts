import { describe, expect, it } from "vitest";
import {
  NEWSROOM_DRAFT_JSON_SCHEMA,
  newsroomRewriteSystemPrompt,
} from "./newsroom-rewrite-adapter";
import type { ResearchPacket } from "./newsroom-research-packet";

const packet: ResearchPacket = {
  packetVersion: 1,
  clusterId: "cluster",
  subject: "Texas sports schedule",
  pillar: "sports",
  recommendedFormat: "MERGE",
  editorialScore: 79,
  rules: {
    useOnlyProvidedSources: true,
    doNotInventFacts: true,
    doNotInventQuotes: true,
    preserveAttribution: true,
    preferPrimarySources: true,
  },
  sources: [],
};

describe("Phase 13 draft generation targets", () => {
  it("gives the model a safety margin above the long-form word floor", () => {
    const prompt = newsroomRewriteSystemPrompt(packet);
    expect(prompt).toContain("75–90 words per section paragraph");
    expect(prompt).toContain("at least 1300 words");
    expect(prompt).toContain("Do not exceed 90 words under any circumstance");
  });

  it("constrains summary and paragraph sizes in the provider schema", () => {
    const properties = NEWSROOM_DRAFT_JSON_SCHEMA.properties as Record<string, any>;
    expect(properties.summary.maxLength).toBe(600);
    expect(properties.summary.minLength).toBe(250);
    expect(properties.sections.items.properties.paragraphs.items.minLength).toBe(380);
  });
});
