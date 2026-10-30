import { describe, expect, it } from "vitest";
import { normalizeNewsroomDraft, reflowNewsroomParagraph, newsroomNonRepeatingRepairOutline, repeatedNewsroomParagraphPositions, newsroomRewriteSystemPrompt, validateNewsroomDraft, type NewsroomDraft } from "./newsroom-rewrite-adapter";
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

  it("losslessly reflows 10-sentence 200-plus-word reporting into readable source-identical paragraphs", () => {
    const long = Array.from({ length: 10 }, (_, i) =>
      "Record " + (i + 1) + " documents a distinct dated fact about the Texas agency decision with specific officials and " +
      "relevant public responsibilities and verified statutory context for affected residents across the state.",
    ).join(" ");
    expect(long.split(/\s+/).length).toBeGreaterThan(200);
    const chunks = reflowNewsroomParagraph(long);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join(" ")).toBe(long);
    expect(chunks.every((chunk) => chunk.split(/\s+/).length <= 110)).toBe(true);
    expect(chunks.every((chunk) => (chunk.match(/\./g) ?? []).length <= 4)).toBe(true);
  });

  it("integrates lossless reflow into normalized sections and preserves section headings", () => {
    const normal = "One short sourced statement about an official Texas decision.";
    const long = Array.from({ length: 9 }, (_, i) =>
      "A named Texas state agency's official record documents step " + (i + 1) +
      " and its specific timing, procedural purpose, and publicly available evidence for readers.",
    ).join(" ");
    const draft = createDraft(Array(18).fill(normal));
    draft.sections[1].paragraphs = [long, normal, normal];
    const normalized = normalizeNewsroomDraft(draft) as NewsroomDraft;
    const section = normalized.sections[1];
    expect(section.heading).toBe("Section 2");
    expect(section.paragraphs.length).toBeGreaterThan(3);
    expect(section.paragraphs.join(" ")).toBe([long, normal, normal].join(" "));
    expect(section.paragraphs.every((chunk) => chunk.split(/\s+/).length <= 110)).toBe(true);
  });

  it("never conceals an unsplittable overlong sentence or repairs duplicate source text", () => {
    const runOn = Array(160).fill("documented").join(" ") + ".";
    expect(reflowNewsroomParagraph(runOn)).toEqual([runOn]);
    const repeated = ("The agency issued a detailed report of the same announcement and date. ").repeat(4).trim();
    expect(reflowNewsroomParagraph(repeated).join(" ")).toBe(repeated);
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

  it("gives AI repair a nonrepetitive source-faithful seed without deleting the original failed draft", () => {
    // Reproduce the October 29 source-grounded draft shape: six sections,
    // four verbatim repeated paragraphs; some sections then contain zero or
    // one unique paragraphs and are NOT suitable for direct publication.
    const originals = Array.from({ length: 16 }, (_, i) =>
      "Source-backed distinct factual paragraph " + i + ": " +
      "The official record identifies a concrete dated administrative action and the agency responsible for it. ".repeat(4),
    );
    const draft = createDraft(Array.from({ length: 18 }, (_, i) =>
      originals[i % originals.length]));
    draft.sections = [
      { heading: "Official filing", paragraphs: originals.slice(0, 3) },
      { heading: "Cited public records", paragraphs: originals.slice(3, 6) },
      { heading: "State's stated position", paragraphs: originals.slice(6, 9) },
      { heading: "Possible implications", paragraphs: [originals[9], originals[8], originals[10]] },
      { heading: "County response", paragraphs: [originals[11], originals[5]] },
      { heading: "Repeated records", paragraphs: [originals[3], originals[4]] },
    ];
    const oldCopy = JSON.stringify(draft);
    expect(repeatedNewsroomParagraphPositions(draft)).toHaveLength(4);
    const outline = newsroomNonRepeatingRepairOutline(draft);
    expect(repeatedNewsroomParagraphPositions(outline)).toHaveLength(0);
    expect(outline.sections.map((section) => section.paragraphs.length)).toEqual([3, 3, 3, 2, 1, 0]);
    expect(outline.title).toBe(draft.title);
    expect(outline.summary).toBe(draft.summary);
    expect(outline.sections[0].paragraphs[0]).toBe(draft.sections[0].paragraphs[0]);
    expect(JSON.stringify(draft)).toBe(oldCopy);
    expect(JSON.stringify(outline)).not.toBe(oldCopy);
    // Repair outline is only model INPUT; it cannot pass publication review.
    expect(validateNewsroomDraft(outline, packet).reasons).toContain("paragraph_count");
  });

  it("does not misdiagnose repeated short fragments as substantive paragraphs", () => {
    const draft = createDraft(Array.from({ length: 18 }, (_, i) => i % 2 ? "Short note." : "Short note."));
    expect(repeatedNewsroomParagraphPositions(draft)).toEqual([]);
    expect(duplicateParagraphOccurrences({ sections: draft.sections })).toBe(0);
  });

  it("requires distinct source-backed roles in the initial draft rather than padding", () => {
    const instructions = newsroomRewriteSystemPrompt(packet);
    expect(instructions).toContain("identify distinct source-backed factual roles for each proposed paragraph");
    expect(instructions).toContain("No substantive paragraph may appear more than once");
    expect(instructions).toContain("Write 4 to 6 substantive sections");
    expect(instructions).toContain("Reduce section/paragraph count");
    expect(instructions).toContain("set brief.hasClearNewsEvent=false");
  });

  it("allows four evidence-rich sections with two unique paragraphs without lowering word or repetition requirements", () => {
    const unique = Array.from({ length: 18 }, (_, i) =>
      "Official record point " + i + ": " + ("The source documents a concrete state agency action, a date, and a cited responsibility for Texas readers. ").repeat(6),
    );
    const draft = createDraft(unique);
    draft.sections = draft.sections.slice(0, 4).map((section) => ({
      ...section,
      paragraphs: section.paragraphs.slice(0, 2),
    }));
    const result = validateNewsroomDraft(draft, packet);
    expect(result.reasons).not.toContain("section_count");
    expect(result.reasons).not.toContain("paragraph_count");
    expect(result.reasons).not.toContain("repeated_newsroom_paragraphs");
    expect(result.mainWordCount).toBeGreaterThan(0);
  });

  it("still rejects undersized sections and one-paragraph filler", () => {
    const draft = createDraft(Array.from({ length: 18 }, (_, i) =>
      "Documented fact number " + i + ". " + ("A dated Texas source describes the agency's publicly recorded decision and authority. ").repeat(7),
    ));
    draft.sections = draft.sections.slice(0, 3);
    draft.sections[0].paragraphs = draft.sections[0].paragraphs.slice(0, 1);
    const result = validateNewsroomDraft(draft, packet);
    expect(result.reasons).toContain("section_count");
    expect(result.reasons).toContain("paragraph_count");
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
