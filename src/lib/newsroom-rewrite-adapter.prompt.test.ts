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
  summary: { minLength?: number; maxLength: number };
  sections: { minItems: number; items: { properties: { paragraphs: { minItems: number; items: { minLength?: number } } } } };
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

  it("allows an honest empty-model abstention while final publication still enforces word and shape gates", () => {
    const properties = NEWSROOM_DRAFT_JSON_SCHEMA.properties as SchemaProperties;
    expect(properties.summary.maxLength).toBe(600);
    // The provider JSON schema must permit empty arrays/strings when
    // brief.hasClearNewsEvent=false, or it pushes the model to invent text.
    expect(properties.summary.minLength).toBeUndefined();
    expect(properties.sections.minItems).toBe(0);
    expect(properties.sections.items.properties.paragraphs.minItems).toBe(0);
    expect(properties.sections.items.properties.paragraphs.items.minLength).toBeUndefined();
    const adapter = readFileSync("src/lib/newsroom-rewrite-adapter.ts", "utf8");
    expect(adapter).toContain("sections.length < 4 || typedDraft.sections.length > 6");
    expect(adapter).toContain("section.paragraphs.length < 2 || section.paragraphs.length > 6");
    expect(adapter).toContain("if (mainWordCount < requiredMainWords)");
    expect(adapter).toContain("reasons.push(\"below_news_word_floor\")");
  });
});
