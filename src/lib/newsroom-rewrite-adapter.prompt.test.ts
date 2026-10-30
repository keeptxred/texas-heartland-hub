import { readFileSync } from "node:fs";
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

type SchemaProperties = {
  summary: { minLength: number; maxLength: number };
  sections: { items: { properties: { paragraphs: { items: { minLength: number } } } } };
};

describe("Phase 13 draft generation targets", () => {
  it("gives the model a safety margin above the long-form word floor", () => {
    const prompt = newsroomRewriteSystemPrompt(packet);
    expect(prompt).toContain("Sports category");
    expect(prompt).toContain("requires at least 1200 main-story words");
    expect(prompt).toContain("85–110 words per substantive paragraph");
    expect(prompt).toContain("at or below 130 words and no more than 4 sentences");
    expect(prompt).toContain("150-word / 5-sentence ceiling");
    expect(prompt).toContain("4 to 6 substantive sections");
    expect(prompt).toContain("Reduce section/paragraph count");
    expect(prompt).toContain("at least 1300 words");
    expect(prompt).toContain("Do not exceed 90 words under any circumstance");
  });

  it("keeps lawsuits attributed and forces repairs to consolidate redundant headings rather than pad", () => {
    const prompt = newsroomRewriteSystemPrompt(packet);
    expect(prompt).toContain("not a court finding or independently established conclusion");
    expect(prompt).toContain("distinguish what a lawsuit claims from what a judge ruled");
    expect(prompt).toContain("Do not narrate praise, advocacy, or moral conclusions as facts");
    expect(prompt).toContain('Do not create separate sections for the same underlying evidence');

    // These two protections must remain in the repair path, not just
    // the first-pass prompt. Nothing changes the AI budget or editorial floor.
    const generator = readFileSync(
      "src/routes/api/public/hooks/generate-newsroom.ts", "utf8",
    );
    expect(generator).toContain("consolidate those redundant headings into the minimum four");
    expect(generator).toContain("existing main-story word floor");
    expect(generator).toContain("repeatedParagraphLocations:");
  });

  it("constrains summary and paragraph sizes in the provider schema", () => {
    const properties = NEWSROOM_DRAFT_JSON_SCHEMA.properties as SchemaProperties;
    expect(properties.summary.maxLength).toBe(600);
    expect(properties.summary.minLength).toBe(250);
    expect(properties.sections.items.properties.paragraphs.items.minLength).toBe(380);
  });
});
