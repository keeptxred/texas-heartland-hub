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
- Write exactly 6 substantive sections with exactly 3 separate paragraphs per section.
- Target 65–80 words per section paragraph so qualifying main-story prose safely clears ${INGESTED_MIN_MAIN_WORDS} words.
- Keep paragraphs readable and fact-dense; do not repeat material to reach length.
- If the packet cannot support a truthful article at the required length, set brief.hasClearNewsEvent=false and leave prose fields empty.
- Return exactly one JSON object with fields: brief, title, dek, summary, relevance, sections, keyTakeaways, faq.
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

export function validateNewsroomDraft(draft: NewsroomDraft, packet: ResearchPacket): DraftValidation {
  if (!draft?.brief?.hasClearNewsEvent) {
    return { ok: false, reasons: ["brief_no_clear_news_event"], mainWordCount: 0 };
  }

  const bodyJson = {
    intro: [draft.summary],
    sections: [
      { heading: "Texas relevance", paragraphs: [draft.relevance] },
      ...(draft.sections ?? []),
    ],
    faq: draft.faq ?? [],
    keyTakeaways: draft.keyTakeaways ?? [],
  };
  const editorial = validateArticle(draft, draft.brief, sourceText(packet));
  const mainWordCount = articleMainWordCount(bodyJson);
  const reasons = [...editorial.reasons];
  if (mainWordCount < INGESTED_MIN_MAIN_WORDS || !meetsArticleMainWordCount("news", bodyJson)) {
    reasons.push("below_news_word_floor");
  }
  if (!Array.isArray(draft.sections) || draft.sections.length !== 6) reasons.push("section_count");
  if ((draft.sections ?? []).some((section) => !Array.isArray(section.paragraphs) || section.paragraphs.length !== 3)) {
    reasons.push("paragraph_count");
  }
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
