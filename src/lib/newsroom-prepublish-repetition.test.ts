import { describe, expect, it } from "vitest";
import { repeatedNewsroomParagraphPositions, newsroomRewriteSystemPrompt, validateNewsroomDraft, type NewsroomDraft } from "./newsroom-rewrite-adapter";
import type { ResearchPacket } from "./newsroom-research-packet";
import { duplicateParagraphOccurrences } from "./public-article-readiness";

const packet: ResearchPacket = {
  packetVersion: 1,
  clusterId: "verified-source",
  subject: "Texas agency budget announcement",
  pillar: "texas-politics-government",
  recommendedFormat: "SINGLE",
  editorialScore: 91,
  rules: {
    useOnlyProvidedSources: true,
    doNotInventFacts: true,
    doNotInventQuotes: true,
    preserveAttribution: true,
    preferPrimarySources: true,
  },
  sources: [{
    feedItemId: 1,
    source: "Texas Agency",
    url: "https://www.texas.gov/example",
    title: "Texas agency announcement",
    description: "",
    extractedBody: "The Texas agency issued its official announcement.",
    publishedAt: "2026-10-14T12:00:00Z",
    isPrimarySource: true,
    sourceReputationScore: 95,
  }],
};

function createDraft(paragraphs: string[]): NewsroomDraft {
  return {
    brief: { hasClearNewsEvent: true, primarySubject: "Texas agency", primaryEvent: "announced new agency action" },
    title: "Texas Agency Announces New Budget Action",
    dek: "A Texas agency issued an official announcement about a new action and detailed its scope for state residents.",
    summary: "A Texas agency issued an announcement concerning its operations and how it would carry out a state responsibility. Its published record identifies the subject of the announcement and gives Texas readers an official point of reference for the decision.",
    relevance: "The agency is responsible for public activities in Texas, and the official action affects how the public understands its work.",
    sections: Array.from({ length: 6 }, (_, i) => ({
      heading: `Section ${i + 1}`,
      paragraphs: [paragraphs[i * 3], paragraphs[i * 3 + 1], paragraphs[i * 3 + 2]],
    })),
    keyTakeaways: ["An official announcement was released.", "Texas readers can refer to the agency record."],
    faq: [{ q: "What changed?", a: "The agency issued a new official announcement." }],
  };
}

describe("newsroom prepublication duplicate paragraph gate", () => {
  it("rejects drafts that would trigger post-publication repetition suppression", () => {
    const repeated = ("The Texas agency issued an official announcement and described the public decision in its record. " +
      "Readers can check that record to establish the announcement date and determine which public responsibilities it addresses. ").repeat(3);
    const draft = createDraft(Array(18).fill(repeated));
    expect(duplicateParagraphOccurrences({
      sections: [{ heading: "Section", paragraphs: draft.sections.flatMap((section) => section.paragraphs) }],
    })).toBeGreaterThan(2);
    const result = validateNewsroomDraft(draft, packet);
    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("repeated_newsroom_paragraphs");
  });

  it("locates every repeat precisely, without rewriting or deleting source-grounded paragraphs", () => {
    const base = ("The source documents the Texas agency's dated official action and the specific steps it identifies. ").repeat(3);
    const paragraphs = Array.from({ length: 18 }, (_, i) => base + " Confirmed reference " + i + ".");
    paragraphs[4] = paragraphs[0].toUpperCase().replace(/ /g, "  ");
    paragraphs[12] = paragraphs[0];
    paragraphs[17] = paragraphs[6];
    const draft = createDraft(paragraphs);
    expect(repeatedNewsroomParagraphPositions(draft)).toEqual([
      { originalSection: 1, originalParagraph: 1, repeatSection: 2, repeatParagraph: 2 },
      { originalSection: 1, originalParagraph: 1, repeatSection: 5, repeatParagraph: 1 },
      { originalSection: 3, originalParagraph: 1, repeatSection: 6, repeatParagraph: 3 },
    ]);
    expect(duplicateParagraphOccurrences({ sections: draft.sections })).toBe(3);
    expect(draft.sections[1].paragraphs[1]).toBe(paragraphs[4]);
  });

  it("does not misdiagnose repeated short fragments as substantive paragraphs", () => {
    const draft = createDraft(Array.from({ length: 18 }, (_, i) => i % 2 ? "Short note." : "Short note."));
    expect(repeatedNewsroomParagraphPositions(draft)).toEqual([]);
    expect(duplicateParagraphOccurrences({ sections: draft.sections })).toBe(0);
  });

  it("requires distinct source-backed roles in the initial draft rather than padding", () => {
    const instructions = newsroomRewriteSystemPrompt(packet);
    expect(instructions).toContain("Plan distinct factual roles for all 18 paragraphs");
    expect(instructions).toContain("No substantive paragraph may appear more than once");
    expect(instructions).toContain("set brief.hasClearNewsEvent=false");
  });

  it("rejects a single repeated substantive paragraph before publication", () => {
    const unique = Array.from({ length: 18 }, (_, i) =>
      "Official agency source excerpt " + String(i) + ": " + ("The public record describes the announced agency action in Texas and provides a source-backed reference. ").repeat(5),
    );
    unique[11] = unique[0];
    const draft = createDraft(unique);
    expect(duplicateParagraphOccurrences({
      sections: draft.sections,
    })).toBe(1);
    const result = validateNewsroomDraft(draft, packet);
    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("repeated_newsroom_paragraphs");
  });

  it("does not invent a repetition failure for unique substantive paragraphs", () => {
    const unique = Array.from({ length: 18 }, (_, i) =>
      "Official agency source excerpt " + String(i) + ": " + ("The public record describes the announced agency action in Texas and provides a source-backed reference. ").repeat(5),
    );
    const draft = createDraft(unique);
    const result = validateNewsroomDraft(draft, packet);
    expect(result.reasons).not.toContain("repeated_newsroom_paragraphs");
  });
});
