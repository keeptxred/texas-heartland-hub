import { articleMainWordCount } from "./article-length";
import { duplicateParagraphOccurrences } from "./public-article-readiness";
import { EDITORIAL_SYSTEM_ADDENDUM, editorialMinimumFor, validateArticle, type StoryBrief } from "./editorial-pipeline";
import type { ResearchPacket } from "./newsroom-research-packet";

export type NewsroomDraft = {
  brief: StoryBrief;
  title: string;
  dek: string;
  summary: string;
  relevance: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  keyTakeaways: string[];
  faq: Array<{ q: string; a: string }>;
};

// Keep provider-side structure guidance deliberately lean. Cloudflare documents that
// complex JSON schemas can fail JSON Mode; semantic/detail validation remains local.
export const NEWSROOM_DRAFT_JSON_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    brief: {
      type: "object",
      properties: {
        hasClearNewsEvent: { type: "boolean" },
      },
      required: ["hasClearNewsEvent"],
    },
    title: { type: "string" },
    dek: { type: "string" },
    summary: { type: "string", minLength: 250, maxLength: 600 },
    relevance: { type: "string" },
    sections: {
      type: "array",
      minItems: 4,
      maxItems: 6,
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          paragraphs: {
            type: "array",
            minItems: 2,
            maxItems: 3,
            items: { type: "string", minLength: 380 },
          },
        },
        required: ["heading", "paragraphs"],
      },
    },
    keyTakeaways: { type: "array", items: { type: "string" } },
    faq: {
      type: "array",
      items: {
        type: "object",
        properties: { q: { type: "string" }, a: { type: "string" } },
        required: ["q", "a"],
      },
    },
  },
  required: ["brief", "title", "dek", "summary", "relevance", "sections", "keyTakeaways", "faq"],
};

export type DraftValidation = {
  ok: boolean;
  reasons: string[];
  mainWordCount: number;
};

/**
 * Report exact 1-based locations of repeated substantive draft paragraphs.
 * Follow public-article-readiness's case/whitespace normalization and >=120
 * character threshold; never delete prose to fake a passing word count.
 */
export function repeatedNewsroomParagraphPositions(
  draft: Pick<NewsroomDraft, "sections">,
): Array<{ originalSection: number; originalParagraph: number; repeatSection: number; repeatParagraph: number }> {
  const firstLocation = new Map<string, { section: number; paragraph: number }>();
  const repeats: Array<{
    originalSection: number; originalParagraph: number; repeatSection: number; repeatParagraph: number;
  }> = [];
  for (const [sectionIndex, section] of draft.sections.entries()) {
    for (const [paragraphIndex, text] of section.paragraphs.entries()) {
      const key = text.trim().replace(/\s+/g, " ").toLowerCase();
      if (key.length < 120) continue;
      const first = firstLocation.get(key);
      if (first) {
        repeats.push({
          originalSection: first.section,
          originalParagraph: first.paragraph,
          repeatSection: sectionIndex + 1,
          repeatParagraph: paragraphIndex + 1,
        });
      } else {
        firstLocation.set(key, { section: sectionIndex + 1, paragraph: paragraphIndex + 1 });
      }
    }
  }
  return repeats;
}

export function newsroomRewriteSystemPrompt(packet: ResearchPacket): string {
  const mergeRule = packet.recommendedFormat === "MERGE"
    ? "This is a MERGE package. Reconcile overlapping reports into one story, preserve attribution for outlet-specific facts, and do not treat repeated reporting as independent new facts."
    : packet.recommendedFormat === "SYNTHESIS"
      ? "This is a SYNTHESIS package. Explain the broader pattern only when the provided evidence supports it; distinguish separate events and never infer a trend beyond the sources."
      : "This is a SINGLE package. Stay tightly focused on the concrete event supported by the source packet.";
  const category = categoryForPillar(packet.pillar);
  const requiredMainWords = editorialMinimumFor(category);
  const targetMainWords = requiredMainWords + 100;

  return `You are the senior editor for Keep TX Red. Produce one source-grounded Texas news article from the supplied newsroom research packet.

${mergeRule}

NON-NEGOTIABLE RULES:
- Use only facts, names, dates, figures, quotes, and relationships present in the supplied packet.
- Prefer direct primary sources when they conflict with secondary coverage.
- Never invent quotes, polling, prices, availability, unnamed experts, analysts, observers, or source content.
- Never write generic attribution phrases such as "experts say", "experts suggest", "experts believe", "analysts say", "observers say", or equivalent wording. Name the supplied source responsible for a claim or omit the claim.
- Preserve attribution where a claim belongs to a particular source.
- Headline must be factual, specific, under 110 characters, and not clickbait.
- Dek must be 90–190 characters, factual, and expand on the headline rather than repeat it verbatim.
- Summary must be answer-first and 55–75 words. Do not exceed 90 words under any circumstance.
- The relevance field MUST be prose explaining why the story matters to Texas readers, never a numeric score.
- Use heading (not title) for every section object.
- Use q for the QUESTION and a for the ANSWER in every FAQ object.
- Write 4 to 6 substantive sections, each containing 2 to 3 separate paragraphs, choosing the smallest structure that can cover the packet's distinct source-backed facts.
- Do not create standalone FAQ, FAQs, Sources, Source Attribution, Conclusion, or filler sections; FAQ and source attribution are handled separately by the application.
- This packet maps to the ${category} category. Its validator requires at least ${requiredMainWords} main-story words.
- Aim for 85–110 words per substantive paragraph, with approximately 10–12 paragraphs when evidence permits. Meet the category-specific main-story floor by verified facts, not by manufacturing an extra section or repeating claims.
- Keep every paragraph at or below 130 words and no more than 4 sentences. These are hard readability targets with margin below the publication validator's 150-word / 5-sentence ceiling; split distinct facts into separate paragraphs instead of producing one long paragraph.
- Every section paragraph should be at least about 380 characters of source-supported prose unless the packet cannot factually support that depth.
- Each section paragraph must contain source-supported detail rather than generic commentary, predictions, public reaction, or moral framing.
- Before drafting, identify distinct source-backed factual roles for each proposed paragraph. Reduce section/paragraph count rather than assigning the same event fact to multiple sections. Assign each paragraph a different documented event detail, record, statement, chronology point, procedure, conflicting account, or confirmed consequence.
- Before returning JSON, compare all section paragraphs with one another after trimming, lowercasing and normalizing whitespace. No substantive paragraph may appear more than once, even under another heading.
- Keep paragraphs readable and fact-dense; do not repeat material to reach length.
- Before returning JSON, verify that summary + relevance + section paragraphs together total at least ${targetMainWords} words of original, non-repeated, source-supported main-story prose.
- If the packet cannot support a truthful article at the required length, set brief.hasClearNewsEvent=false and return empty strings/arrays for the article fields while still satisfying the required JSON keys.
- Return exactly one JSON object matching the supplied JSON schema.
${EDITORIAL_SYSTEM_ADDENDUM}`;
}

export function newsroomRewriteUserPrompt(packet: ResearchPacket): string {
  return JSON.stringify({
    packetVersion: packet.packetVersion,
    clusterId: packet.clusterId,
    subject: packet.subject,
    pillar: packet.pillar,
    recommendedFormat: packet.recommendedFormat,
    editorialScore: packet.editorialScore,
    rules: packet.rules,
    sources: packet.sources,
  });
}

function sourceText(packet: ResearchPacket): string {
  return packet.sources
    .map((source) => `${source.title}\n${source.description}\n${source.extractedBody}`)
    .join("\n\n")
    .slice(0, 50000);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function hasNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const GENERIC_EXPERT_SENTENCE_RE = /[^.!?]*\bexperts\s+(?:say|suggest|believe)\b[^.!?]*(?:[.!?]|$)/gi;

export function stripGenericExpertAttribution(value: string): string {
  return value
    .replace(GENERIC_EXPERT_SENTENCE_RE, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Reuse the model's already source-grounded answer-first summary when its
 * short dek merely repeats the headline. No second model call or invented
 * reporting; leave an unusable summary for the ordinary repair validator.
 */
export function newsroomSourceBackedDek(title: string, dek: string, summary: string): string {
  const cleanDek = dek.replace(/\s+/g, " ").trim();
  const cleanTitle = title.replace(/\s+/g, " ").trim().toLowerCase();
  if (cleanDek.length >= 80 && cleanDek.toLowerCase() !== cleanTitle) return cleanDek;
  const cleanSummary = summary.replace(/\s+/g, " ").trim();
  if (cleanSummary.length < 80 || cleanSummary.toLowerCase() === cleanTitle) return cleanDek;
  const sentences = cleanSummary.split(/(?<=[.!?])\s+/);
  let candidate = "";
  for (const sentence of sentences) {
    if (candidate.length > 0 && (candidate.length + sentence.length + 1) > 240) break;
    candidate = [candidate, sentence].filter(Boolean).join(" ");
    if (candidate.length >= 100) break;
  }
  if (candidate.length < 80) candidate = cleanSummary.slice(0, 240).replace(/\s+\S*$/, "");
  return candidate.length >= 80 && candidate.toLowerCase() !== cleanTitle ? candidate : cleanDek;
}

export function normalizeNewsroomDraft(value: unknown): unknown {
  if (!isRecord(value) || !Array.isArray(value.faq)) return value;
  const faq = value.faq.map((item) => {
    if (!isRecord(item) || typeof item.q !== "string" || typeof item.a !== "string") return item;
    const q = item.q.trim();
    const a = item.a.trim();
    const normalized = !q.endsWith("?") && a.endsWith("?")
      ? { ...item, q: a, a: q }
      : { ...item, q, a };
    return {
      ...normalized,
      q: stripGenericExpertAttribution(normalized.q),
      a: stripGenericExpertAttribution(normalized.a),
    };
  });
  const sections = Array.isArray(value.sections)
    ? value.sections.map((section) => isRecord(section) && Array.isArray(section.paragraphs)
      ? {
          ...section,
          heading: typeof section.heading === "string" ? stripGenericExpertAttribution(section.heading) : section.heading,
          paragraphs: section.paragraphs.map((paragraph) => typeof paragraph === "string"
            ? stripGenericExpertAttribution(paragraph)
            : paragraph),
        }
      : section)
    : value.sections;
  const keyTakeaways = Array.isArray(value.keyTakeaways)
    ? value.keyTakeaways.map((item) => typeof item === "string" ? stripGenericExpertAttribution(item) : item)
    : value.keyTakeaways;
  return {
    ...value,
    title: typeof value.title === "string" ? stripGenericExpertAttribution(value.title) : value.title,
    dek: typeof value.dek === "string" && typeof value.summary === "string"
      ? newsroomSourceBackedDek(
        typeof value.title === "string" ? stripGenericExpertAttribution(value.title) : "",
        stripGenericExpertAttribution(value.dek),
        stripGenericExpertAttribution(value.summary),
      )
      : value.dek,
    summary: typeof value.summary === "string" ? stripGenericExpertAttribution(value.summary) : value.summary,
    relevance: typeof value.relevance === "string" ? stripGenericExpertAttribution(value.relevance) : value.relevance,
    analysis: typeof value.analysis === "string" ? stripGenericExpertAttribution(value.analysis) : value.analysis,
    sections,
    keyTakeaways,
    faq,
  };
}

function draftShapeReasons(value: unknown): string[] {
  if (!isRecord(value)) return ["invalid_draft_object"];
  const reasons: string[] = [];
  const brief = value.brief;
  if (!isRecord(brief) || typeof brief.hasClearNewsEvent !== "boolean") reasons.push("invalid_brief");
  for (const field of ["title", "dek", "summary", "relevance"] as const) {
    if (!hasNonEmptyString(value[field])) reasons.push(`invalid_${field}`);
  }
  if (!Array.isArray(value.sections)) {
    reasons.push("invalid_sections");
  } else if (value.sections.some((section) =>
    !isRecord(section) ||
    !hasNonEmptyString(section.heading) ||
    !Array.isArray(section.paragraphs) ||
    section.paragraphs.some((paragraph) => !hasNonEmptyString(paragraph)))) {
    reasons.push("invalid_section_shape");
  }
  if (!Array.isArray(value.keyTakeaways) || value.keyTakeaways.some((item) => !hasNonEmptyString(item))) {
    reasons.push("invalid_key_takeaways");
  }
  if (!Array.isArray(value.faq) || value.faq.some((item) =>
    !isRecord(item) || !hasNonEmptyString(item.q) || !hasNonEmptyString(item.a))) {
    reasons.push("invalid_faq");
  }
  return reasons;
}

export function validateNewsroomDraft(draft: unknown, packet: ResearchPacket): DraftValidation {
  const shapeReasons = draftShapeReasons(draft);
  if (shapeReasons.length) return { ok: false, reasons: shapeReasons, mainWordCount: 0 };

  const typedDraft = draft as NewsroomDraft;
  if (!typedDraft.brief.hasClearNewsEvent) {
    return { ok: false, reasons: ["brief_no_clear_news_event"], mainWordCount: 0 };
  }

  const bodyJson = {
    intro: [typedDraft.summary],
    sections: [
      { heading: "Texas relevance", paragraphs: [typedDraft.relevance] },
      ...typedDraft.sections,
    ],
    faq: typedDraft.faq,
    keyTakeaways: typedDraft.keyTakeaways,
  };
  const mainWordCount = articleMainWordCount(bodyJson);
  const reasons: string[] = [];
  try {
    reasons.push(...validateArticle(typedDraft, typedDraft.brief, sourceText(packet)).reasons);
  } catch {
    reasons.push("editorial_validation_exception");
  }
  // Shadow validation occurs before publication assembly adds body_json.sources.
  // Do not call the publication-level meetsArticleMainWordCount() helper here:
  // it correctly requires source URLs and would reject an otherwise valid draft
  // solely because the source list is attached later. Packet evidence has already
  // passed the 5k/9k source gate before AI generation, so enforce the newsroom's
  // category-specific prose floor directly at this stage instead.
  const requiredMainWords = editorialMinimumFor(categoryForPillar(packet.pillar));
  if (mainWordCount < requiredMainWords) reasons.push("below_news_word_floor");
  if (typedDraft.dek.trim().length < 80
      || typedDraft.dek.replace(/\s+/g, " ").trim().toLowerCase()
        === typedDraft.title.replace(/\s+/g, " ").trim().toLowerCase()) {
    reasons.push("weak_newsroom_dek");
  }
  // One duplicated substantive paragraph is already a reader-facing editorial
  // defect. Reject it *before* a newly generated draft reaches publication.
  // Keep historical public-readiness rules separate to avoid silently changing
  // indexability for older, already-published articles.
  if (duplicateParagraphOccurrences(bodyJson) > 0) {
    reasons.push("repeated_newsroom_paragraphs");
  }
  if (typedDraft.sections.length < 4 || typedDraft.sections.length > 6) reasons.push("section_count");
  if (typedDraft.sections.some((section) => section.paragraphs.length < 2 || section.paragraphs.length > 3)) reasons.push("paragraph_count");
  return { ok: reasons.length === 0, reasons: [...new Set(reasons)], mainWordCount };
}

export function categoryForPillar(pillar: string | null): string {
  if (pillar === "sports" || pillar?.startsWith("sports-")) return "Sports";
  if (pillar?.includes("election")) return "Elections";
  if (pillar?.includes("border")) return "Border";
  if (pillar?.includes("energy")) return "Energy";
  if (pillar?.includes("education")) return "Education";
  if (pillar?.includes("tax") || pillar?.includes("economy")) return "Tax & Spending";
  if (pillar?.includes("politics") || pillar?.includes("government") || pillar?.includes("legislature")) return "Legislature";
  return "Non-Political";
}

export function slugifyNewsroomTitle(title: string, datePrefix: string): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  return `${datePrefix}-${slug}`;
}
