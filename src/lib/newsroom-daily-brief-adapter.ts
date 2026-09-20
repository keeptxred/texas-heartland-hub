import { articleMainWordCount, INGESTED_MIN_MAIN_WORDS, meetsArticleMainWordCount } from "./article-length";
import { EDITORIAL_SYSTEM_ADDENDUM } from "./editorial-pipeline";
import type { ResearchPacket } from "./newsroom-research-packet";

export type DailyBriefPacketItem = {
  candidateId: string;
  clusterId: string;
  editorialScore: number;
  recommendedFormat: string;
  packet: ResearchPacket;
};

export type TexasDailyBriefDraft = {
  title: string;
  dek: string;
  summary: string;
  items: Array<{
    clusterId: string;
    heading: string;
    whyItMatters: string;
    paragraphs: string[];
  }>;
  watchNext: string[];
  faq: Array<{ q: string; a: string }>;
};

export type DailyBriefValidation = {
  ok: boolean;
  reasons: string[];
  mainWordCount: number;
};

export function dailyBriefSystemPrompt(itemCount: number): string {
  return `You are the senior editor for Keep TX Red. Produce one Texas Daily Brief covering exactly ${itemCount} secondary statewide developments from the supplied research packets.

NON-NEGOTIABLE RULES:
- Use only facts, names, dates, figures, quotes, and relationships present in the supplied packets.
- Do not add outside knowledge or speculate beyond the source material.
- Prefer direct primary sources when they conflict with secondary coverage.
- Never invent quotes, polling, prices, availability, unnamed experts, analysts, observers, or source content.
- Preserve attribution where a claim belongs to a particular source.
- Do not force a pillar mix. Cover the supplied developments in descending editorial importance.
- Do not merge unrelated developments merely to create a theme.
- For each supplied cluster return exactly one item and preserve its exact clusterId.
- Each item must have exactly 2 substantive paragraphs plus a concise whyItMatters field.
- The complete brief must safely clear ${INGESTED_MIN_MAIN_WORDS} words of useful main-story prose without repetition or filler.
- Headline must be factual, specific, under 110 characters, and begin with "Texas Daily Brief:".
- Summary must be answer-first and 55–80 words.
- Return exactly one JSON object with fields: title, dek, summary, items, watchNext, faq.
${EDITORIAL_SYSTEM_ADDENDUM}`;
}

export function dailyBriefUserPrompt(items: readonly DailyBriefPacketItem[]): string {
  return JSON.stringify({
    briefType: "texas-daily-brief",
    itemCount: items.length,
    developments: items.map((item) => ({
      candidateId: item.candidateId,
      clusterId: item.clusterId,
      editorialScore: item.editorialScore,
      recommendedFormat: item.recommendedFormat,
      subject: item.packet.subject,
      pillar: item.packet.pillar,
      packetRules: item.packet.rules,
      sources: item.packet.sources,
    })),
  });
}

export function dailyBriefBodyJson(draft: TexasDailyBriefDraft, sourceItems: readonly DailyBriefPacketItem[], updated: string) {
  const sources = sourceItems
    .flatMap((item) => item.packet.sources.map((source) => ({ label: `${source.source} — source`, url: source.url })))
    .filter((source, index, rows) => rows.findIndex((row) => row.url === source.url) === index);

  return {
    updated,
    intro: [draft.summary.trim()],
    sections: [
      ...draft.items.map((item) => ({
        heading: item.heading,
        paragraphs: [...item.paragraphs, item.whyItMatters],
      })),
      {
        heading: "What to watch next",
        paragraphs: draft.watchNext,
      },
      {
        heading: "Source attribution",
        paragraphs: ["Keep TX Red rewrote the coverage independently and links to the original for verification."],
      },
    ],
    faq: draft.faq,
    sources,
    keyTakeaways: draft.items.map((item) => item.whyItMatters),
  };
}

export function validateDailyBriefDraft(
  draft: TexasDailyBriefDraft,
  selected: readonly DailyBriefPacketItem[],
): DailyBriefValidation {
  const reasons: string[] = [];
  if (!draft?.title?.startsWith("Texas Daily Brief:")) reasons.push("headline_prefix");
  if (!draft?.summary || draft.summary.trim().split(/\s+/).length < 45) reasons.push("thin_summary");
  if (!Array.isArray(draft?.items) || draft.items.length !== selected.length) reasons.push("item_count");

  const expectedClusters = selected.map((item) => item.clusterId).sort();
  const actualClusters = (draft?.items ?? []).map((item) => item.clusterId).sort();
  if (JSON.stringify(expectedClusters) !== JSON.stringify(actualClusters)) reasons.push("cluster_mismatch");

  for (const item of draft?.items ?? []) {
    if (!item.heading?.trim() || !item.whyItMatters?.trim()) reasons.push("thin_item_metadata");
    if (!Array.isArray(item.paragraphs) || item.paragraphs.length !== 2) reasons.push("paragraph_count");
  }

  const bodyJson = dailyBriefBodyJson(draft, selected, new Date().toISOString().slice(0, 10));
  const mainWordCount = articleMainWordCount(bodyJson);
  if (mainWordCount < INGESTED_MIN_MAIN_WORDS || !meetsArticleMainWordCount("news", bodyJson)) {
    reasons.push("below_news_word_floor");
  }
  return { ok: reasons.length === 0, reasons: [...new Set(reasons)], mainWordCount };
}
