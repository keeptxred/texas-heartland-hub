import { describe, expect, it } from "vitest";
import { validateNewsroomDraft, type NewsroomDraft } from "./newsroom-rewrite-adapter";
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

  it("does not invent a repetition failure for unique substantive paragraphs", () => {
    const unique = Array.from({ length: 18 }, (_, i) =>
      "Official agency source excerpt " + String(i) + ": " + ("The public record describes the announced agency action in Texas and provides a source-backed reference. ").repeat(5),
    );
    const draft = createDraft(unique);
    const result = validateNewsroomDraft(draft, packet);
    expect(result.reasons).not.toContain("repeated_newsroom_paragraphs");
  });
});
