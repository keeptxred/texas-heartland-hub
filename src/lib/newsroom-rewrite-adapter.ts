import { articleMainWordCount, INGESTED_MIN_MAIN_WORDS, meetsArticleMainWordCount } from "./article-length";
import { EDITORIAL_SYSTEM_ADDENDUM, validateArticle, type StoryBrief } from "./editorial-pipeline";
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

export const NEWSROOM_DRAFT_JSON_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    brief: {
      type: "object",
      properties: {
        hasClearNewsEvent: { type: "boolean" },
        storyType: { type: "string" },
        category: { type: "string" },
        primaryEvent: { type: "string" },
        whyNow: { type: "string" },
        primarySubject: { type: "string" },
        secondarySubjects: { type: "array", items: { type: "string" } },
        organizations: { type: "array", items: { type: "string" } },
        locations: { type: "array", items: { type: "string" } },
        dates: { type: "array", items: { type: "string" } },
        currentOffices: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: { name: { type: "string" }, office: { type: "string" } },
            required: ["name", "office"],
          },
        },
        officesSought: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: { name: { type: "string" }, office: { type: "string" } },
            required: ["name", "office"],
          },
        },
        relationships: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: { a: { type: "string" }, b: { type: "string" }, relationship: { type: "string" } },
            required: ["a", "b", "relationship"],
          },
        },
        facts: {
          type: "object",
          additionalProperties: false,
          properties: {
            names: { type: "array", items: { type: "string" } },
            dates: { type: "array", items: { type: "string" } },
            locations: { type: "array", items: { type: "string" } },
            actions: { type: "array", items: { type: "string" } },
            officialRoles: { type: "array", items: { type: "string" } },
            numbers: { type: "array", items: { type: "string" } },
            quotes: { type: "array", items: { type: "string" } },
          },
          required: ["names", "dates", "locations", "actions", "officialRoles", "numbers", "quotes"],
        },
        analysis: {
          type: "object",
          additionalProperties: false,
          properties: {
            opinions: { type: "array", items: { type: "string" } },
            predictions: { type: "array", items: { type: "string" } },
            implications: { type: "array", items: { type: "string" } },
          },
          required: ["opinions", "predictions", "implications"],
        },
      },
      required: [
        "hasClearNewsEvent", "storyType", "category", "primaryEvent", "whyNow", "primarySubject",
        "secondarySubjects", "organizations", "locations", "dates", "currentOffices", "officesSought",
        "relationships", "facts", "analysis",
      ],
    },
    title: { type: "string" },
    dek: { type: "string" },
    summary: { type: "string" },
    relevance: { type: "string" },
    sections: {
      type: "array",
      minItems: 6,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          heading: { type: "string" },
          paragraphs: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: { type: "string" },
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
        additionalProperties: false,
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

export function newsroomRewriteSystemPrompt(packet: ResearchPacket): string {
  const mergeRule = packet.recommendedFormat === "MERGE"
    ? "This is a MERGE package. Reconcile overlapping reports into one story, preserve attribution for outlet-specific facts, and do not treat repeated reporting as independent new facts."
    : packet.recommendedFormat === "SYNTHESIS"
      ? "This is a SYNTHESIS package. Explain the broader pattern only when the provided evidence supports it; distinguish separate events and never infer a trend beyond the sources."
      : "This is a SINGLE package. Stay tightly focused on the concrete event supported by the source packet.";

  return `You are the senior editor for Keep TX Red. Produce one source-grounded Texas news article from the supplied newsroom research packet.

${mergeRule}

NON-NEGOTIABLE RULES:
- Use only facts, names, dates, figures, quotes, and relationships present in the supplied packet.
- Prefer direct primary sources when they conflict with secondary coverage.
- Never invent quotes, polling, prices, availability, unnamed experts, analysts, observers, or source content.
- Preserve attribution where a claim belongs to a particular source.
- Headline must be factual, specific, under 110 characters, and not clickbait.
- Summary must be answer-first and 55–75 words.
- The relevance field MUST be prose explaining why the story matters to Texas readers, never a numeric score.
- Use heading (not title) for every section object.
- Use q and a (not question and answer) for every FAQ object.
- Write exactly 6 substantive sections with exactly 3 separate paragraphs per section.
- Target 65–80 words per section paragraph so qualifying main-story prose safely clears ${INGESTED_MIN_MAIN_WORDS} words.
- Keep paragraphs readable and fact-dense; do not repeat material to reach length.
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
  if (mainWordCount < INGESTED_MIN_MAIN_WORDS || !meetsArticleMainWordCount("news", bodyJson)) {
    reasons.push("below_news_word_floor");
  }
  if (typedDraft.sections.length !== 6) reasons.push("section_count");
  if (typedDraft.sections.some((section) => section.paragraphs.length !== 3)) reasons.push("paragraph_count");
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
