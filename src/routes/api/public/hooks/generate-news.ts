import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { enrichArticleRow } from "@/lib/content-quality";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { isPuzzleTitle } from "./ingest-feeds";
import { articleMainWordCount, INGESTED_MIN_MAIN_WORDS, meetsArticleMainWordCount } from "@/lib/article-length";
import {
  EDITORIAL_SYSTEM_ADDENDUM,
  validateArticle,
  type StoryBrief,
} from "@/lib/editorial-pipeline";

type NewsSection = { heading: string; paragraphs: string[] };

function articleBodyText(body: {
  intro: string[];
  sections: { heading?: string; paragraphs?: string[]; bullets?: string[] }[];
  faq?: { q?: string; a?: string }[];
  keyTakeaways?: string[];
}): string {
  const parts: string[] = [];
  (body.intro ?? []).forEach((p) => parts.push(p));
  (body.sections ?? []).forEach((s) => {
    if (s.heading) parts.push(s.heading);
    (s.paragraphs ?? []).forEach((p) => parts.push(p));
    (s.bullets ?? []).forEach((p) => parts.push(p));
  });
  (body.faq ?? []).forEach((f) => {
    if (f.q) parts.push(f.q);
    if (f.a) parts.push(f.a);
  });
  (body.keyTakeaways ?? []).forEach((p) => parts.push(p));
  return parts.join(" ");
}

const RSS_SOURCES: { name: string; url: string; category: string }[] = [
  { name: "Texas Scorecard", url: "https://texasscorecard.com/feed/", category: "Legislature" },
  { name: "The Texan", url: "https://thetexan.news/feed/", category: "Legislature" },
  { name: "Dallas Express", url: "https://dallasexpress.com/feed/", category: "Elections" },
  { name: "The Center Square — Texas", url: "https://www.thecentersquare.com/texas/?f=rss", category: "Tax & Spending" },
  { name: "Texas Public Policy Foundation", url: "https://www.texaspolicy.com/feed/", category: "Tax & Spending" },
  { name: "Houston Chronicle — Politics", url: "https://www.houstonchronicle.com/rss/feed/politics-9764.php", category: "Legislature" },
  { name: "Houston Public Media — News", url: "https://www.houstonpublicmedia.org/feed/?post_type=articles", category: "Legislature" },
  { name: "KHOU 11 — Local", url: "https://www.khou.com/feeds/syndication/rss/news/local", category: "Legislature" },
];

const CATEGORIES = [
  "Legislature",
  "Border",
  "Elections",
  "Tax & Spending",
  "Energy",
  "Education",
  "Non-Political",
] as const;

type RssItem = {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
  source: string;
  sourceCategory: string;
  sourceText?: string;
};

function stripHtml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  return m ? stripHtml(m[1]) : "";
}

function parseRss(xml: string, source: string, sourceCategory: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRe = /<item[\s\S]*?<\/item>/gi;
  const matches = xml.match(itemRe) ?? [];
  for (const block of matches.slice(0, 6)) {
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const description = extractTag(block, "description");
    const pubDate = extractTag(block, "pubDate");
    if (title && link) items.push({ title, link, description, pubDate, source, sourceCategory });
  }
  return items;
}

const TEXAS_KEYWORDS = ["texas", "lone star", "ercot", "txdot", "rgv", "permian"];
const METRO_KEYWORDS = ["houston", "harris county", "katy", "sugar land", "cypress", "the woodlands"];
const POLITICS_KEYWORDS = ["legislature", "governor", "abbott", "paxton", "patrick", "senate", "house bill", "sb ", "hb ", "capitol", "election", "vote", "ballot", "campaign"];
const BREAKING_KEYWORDS = ["breaking", "shooting", "killed", "arrested", "explosion", "tornado", "hurricane", "flood", "emergency", "evacuation", "manhunt", "amber alert", "indicted", "resign"];
const ENGAGEMENT_KEYWORDS = ["exclusive", "revealed", "what we know", "first on", "investigation", "leaked", "exposes", "warns"];

const NON_BREAKING_TITLE_PATTERNS: RegExp[] = [
  /^\s*(looking for|anyone (?:know|have|tried)|recommend|recommendations?|suggestions?|advice|help|where (?:can|do|to)|how (?:do|to|can)|what(?:'s| is) the best|best way to|has anyone|is there|question:|discussion:|thoughts on)\b/i,
  /\b(my|our) (?:experience|story|take|journey|trip)\b/i,
  /\b(top|best|worst)\s+\d+\b/i,
  /\b\d+\s+(?:things|ways|reasons|tips|places|foods|restaurants|hikes|spots|facts|signs)\b/i,
  /\b(travel guide|city guide|restaurant (?:review|guide)|food review|things to do|day trip|road trip|weekend (?:in|getaway)|hidden gems|bucket list)\b/i,
  /\b(opinion|op-ed|editorial|commentary|column|hot take|unpopular opinion|change my mind)\b/i,
  /\b(quiz|horoscope|crossword|sudoku|puzzle|recipe|meal plan|workout|playlist)\b/i,
  /\b(everything you need to know|complete guide|ultimate guide|explained|explainer|primer|faq)\b/i,
  /\b(house call|mobile (?:vet|veterinar)|pet sitter|babysitter|handyman|plumber|electrician|contractor|realtor)\b/i,
];

const NON_BREAKING_SOURCE_PATTERNS: RegExp[] = [
  /^r\//i,
  /reddit/i,
  /medium/i,
  /substack/i,
  /blog/i,
  /opinion/i,
  /lifestyle/i,
  /travel/i,
  /food(?:ie)?/i,
  /eater/i,
  /culture/i,
];

const HARD_NEWS_SIGNAL =
  /\b(breaking|shooting|killed|arrested|explosion|tornado|hurricane|flood|emergency|evacuation|manhunt|amber alert|indicted|resign|signs|declares|announces|ruling|verdict|convicted|charged|sues|lawsuit|veto|vetoes|appoints|passes|approves|filed|election|ballot|primary|runoff|governor|legislature|senate bill|house bill|\bsb\s?\d|\bhb\s?\d|paxton|abbott|patrick|cornyn|cruz|border|ercot|grid|recall|impeach|storm|wildfire|evacuat|acquires|merger|ipo|championship|traded|signs deal|hired|fired)\b/i;

function isDisqualifiedFromBreaking(item: RssItem): boolean {
  const title = item.title ?? "";
  const src = item.source ?? "";
  if (NON_BREAKING_TITLE_PATTERNS.some((re) => re.test(title))) return true;
  if (NON_BREAKING_SOURCE_PATTERNS.some((re) => re.test(src))) return true;
  return false;
}

function scoreItem(item: RssItem, titleRepetition: number): number {
  const haystack = `${item.title} ${item.description}`.toLowerCase();
  let score = 0;
  if (TEXAS_KEYWORDS.some((k) => haystack.includes(k))) score += 10;
  if (METRO_KEYWORDS.some((k) => haystack.includes(k))) score += 10;
  if (POLITICS_KEYWORDS.some((k) => haystack.includes(k))) score += 8;
  if (BREAKING_KEYWORDS.some((k) => haystack.includes(k))) score += 8;
  if (ENGAGEMENT_KEYWORDS.some((k) => haystack.includes(k))) score += 6;
  if (titleRepetition >= 2) score += 5;
  return score;
}

function titleFingerprint(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 6)
    .sort()
    .join(" ");
}

type ScoredItem = RssItem & { score: number; isBreaking: boolean };

const MIN_VERIFIED_SOURCE_WORDS = 900;

type SourcePreflightDiagnostic = {
  title: string;
  source: string;
  sourceWords: number;
};

type SourcePreflightSummary = {
  threshold: number;
  selected_count: number;
  skipped_count: number;
  stories: SourcePreflightDiagnostic[];
};

class InsufficientVerifiedSourceError extends Error {
  diagnostics: SourcePreflightSummary;

  constructor(diagnostics: SourcePreflightSummary) {
    super('All selected stories failed verified-source sufficiency preflight');
    this.name = 'InsufficientVerifiedSourceError';
    this.diagnostics = diagnostics;
  }
}

function sourceWordCount(value: string | undefined): number {
  return (value ?? '').trim().split(/\s+/).filter(Boolean).length;
}

function scoreAndFilter(items: RssItem[]): ScoredItem[] {
  const fingerprints = new Map<string, number>();
  for (const it of items) {
    const fp = titleFingerprint(it.title);
    fingerprints.set(fp, (fingerprints.get(fp) ?? 0) + 1);
  }
  return items
    .map((it) => {
      const reps = fingerprints.get(titleFingerprint(it.title)) ?? 1;
      const score = scoreItem(it, reps);
      const haystack = `${it.title} ${it.description}`;
      const hasHardNews = HARD_NEWS_SIGNAL.test(haystack);
      const disqualified = isDisqualifiedFromBreaking(it);
      const isBreaking = score >= 18 && hasHardNews && !disqualified;
      return { ...it, score, isBreaking };
    })
    .filter((it) => it.score >= 12 && !isPuzzleTitle(it.title))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function fetchWithTimeout(url: string, ms = 10000): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "KeepTXRed/1.0 (+https://keeptxred.com)" },
    });
    clearTimeout(t);
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null;
  }
}

function extractPageText(html: string): string {
  return stripHtml(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " "),
  ).slice(0, 14000);
}

async function hydrateSourceContext(item: ScoredItem): Promise<ScoredItem> {
  const html = await fetchWithTimeout(item.link, 15000);
  if (!html) return item;
  const sourceText = extractPageText(html);
  if (sourceText.length < 500) return item;
  return { ...item, sourceText };
}

type RewrittenArticle = {
  brief?: StoryBrief;
  source_index: number;
  category: string;
  title: string;
  dek: string;
  summary?: string;
  relevance?: string;
  sections?: NewsSection[];
  keyTakeaways?: string[];
  faq?: { q: string; a: string }[];
  verified_source_words?: number;
};

function isQuotaOrRateLimitError(error: unknown): boolean {
  const message = String(error).toLowerCase();
  return (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("rate_limit") ||
    message.includes("daily limit") ||
    message.includes("allocation") ||
    message.includes("neurons")
  );
}

function jsonCandidates(content: string): string[] {
  const trimmed = content.trim();
  const candidates = new Set<string>();
  if (trimmed) candidates.add(trimmed);

  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  if (unfenced) candidates.add(unfenced);

  const firstBrace = unfenced.indexOf("{");
  const lastBrace = unfenced.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.add(unfenced.slice(firstBrace, lastBrace + 1));
  }

  return [...candidates];
}

function parseAiArticles(content: string): RewrittenArticle[] {
  let lastError: unknown;
  for (const candidate of jsonCandidates(content)) {
    try {
      const parsed = JSON.parse(candidate) as { articles?: unknown };
      if (!Array.isArray(parsed?.articles)) continue;
      return parsed.articles.filter((article): article is RewrittenArticle => Boolean(article && typeof article === "object"));
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`AI returned malformed JSON: ${String(lastError ?? "no articles array")}`);
}

const VAGUE_ATTRIBUTION_PATTERNS: RegExp[] = [
  /\banalysts (?:say|believe)\b/i,
  /\bobservers (?:say|believe|note)\b/i,
  /\bexperts (?:say|suggest|believe)\b/i,
  /\bconsultants (?:say|note|believe)\b/i,
  /\bsources close to\b/i,
];

function stripVagueAttributionSentences(value?: string): string | undefined {
  if (typeof value !== "string") return value;
  const sentences = value.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [value];
  const kept = sentences
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .filter((sentence) => !VAGUE_ATTRIBUTION_PATTERNS.some((pattern) => pattern.test(sentence)));
  return kept.join(" ").trim();
}

function sanitizeVagueAttribution(article: RewrittenArticle): void {
  article.title = stripVagueAttributionSentences(article.title) || article.title;
  article.dek = stripVagueAttributionSentences(article.dek) || article.dek;
  article.summary = stripVagueAttributionSentences(article.summary);
  article.relevance = stripVagueAttributionSentences(article.relevance);
  if (Array.isArray(article.sections)) {
    article.sections = article.sections.map((section) => ({
      ...section,
      heading: stripVagueAttributionSentences(section.heading) || section.heading,
      paragraphs: (section.paragraphs ?? [])
        .map((paragraph) => stripVagueAttributionSentences(paragraph) || "")
        .filter(Boolean),
    }));
  }
}

function rewrittenMainWordCount(article: Pick<RewrittenArticle, "summary" | "sections">): number {
  const mainText = [
    article.summary ?? "",
    ...(article.sections ?? []).flatMap((section) => [
      section.heading ?? "",
      ...(section.paragraphs ?? []),
    ]),
  ].join(" ");
  return mainText.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeSummaryLength(summary?: string, sections?: NewsSection[]): string | undefined {
  if (typeof summary !== "string") return summary;
  const trimmed = summary.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);

  if (words.length > 90) {
    const sentences = trimmed.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [];
    const kept: string[] = [];
    let keptWords = 0;
    for (const sentence of sentences) {
      const sentenceText = sentence.trim();
      if (!sentenceText) continue;
      const sentenceWords = sentenceText.split(/\s+/).filter(Boolean).length;
      if (keptWords + sentenceWords > 90) break;
      kept.push(sentenceText);
      keptWords += sentenceWords;
    }
    if (keptWords >= 45) return kept.join(" ");
    return words.slice(0, 90).join(" ");
  }

  if (words.length >= 45) return trimmed;

  const firstBodyParagraph = (sections ?? [])
    .flatMap((section) => section?.paragraphs ?? [])
    .map((paragraph) => paragraph?.trim() ?? "")
    .find(Boolean);

  if (!firstBodyParagraph) return trimmed;

  const supplementSentences = firstBodyParagraph.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [firstBodyParagraph];
  const combined: string[] = [trimmed];
  let combinedWords = words.length;
  for (const sentence of supplementSentences) {
    const sentenceText = sentence.trim();
    if (!sentenceText || trimmed.includes(sentenceText)) continue;
    const sentenceWords = sentenceText.split(/\s+/).filter(Boolean).length;
    if (combinedWords + sentenceWords > 90) {
      const remaining = Math.max(0, 90 - combinedWords);
      if (remaining > 0) combined.push(sentenceText.split(/\s+/).slice(0, remaining).join(" "));
      break;
    }
    combined.push(sentenceText);
    combinedWords += sentenceWords;
    if (combinedWords >= 45) break;
  }

  return combined.join(" ").trim();
}

async function rewriteBatchWithAi(items: ScoredItem[], lovableApiKey: string, correctiveInstruction = "") {
  const list = items
    .map((it, i) => {
      const sourceMaterial = (it.sourceText || it.description).slice(0, 14000);
      return `${i + 1}. [score=${it.score}${it.isBreaking ? " BREAKING" : ""}] [${it.source} — ${it.sourceCategory}] ${it.title}\n   VERIFIED SOURCE MATERIAL: ${sourceMaterial}\n   URL: ${it.link}`;
    })
    .join("\n\n");

  const system = `You are the senior editor of Keep TX Red, a Texas news site optimized for Google Discover and high click-through rates. Stay factually neutral in headlines; reserve principled conservative framing for analysis. Never invent quotes or statistics.

GOOGLE DISCOVER HEADLINE FORMULAS — pick the best fit per story:
  • "BREAKING: <event> impacts Texas residents"
  • "Texas officials respond to <event> affecting <city>"
  • "What we know about <event> in Texas today"
  • "<topic> sparks reaction across Texas"

HEADLINE RULES:
- Under 110 characters, no clickbait, no "shocking", no all-caps shouting beyond the optional "BREAKING:" prefix.
- MUST mention Texas or a major Texas city (Houston, Dallas, Austin, San Antonio, Fort Worth, El Paso).
- Use the "BREAKING:" prefix ONLY when the input is flagged BREAKING.

DEK (first paragraph + meta description) RULES:
- 2 sentences max, hooks the reader, 140–240 characters.
- Sentence 1 names Texas + a specific city.
- Sentence 2 gives the most newsworthy fact.

BODY RULES (required for every picked story):
- The hard publication floor is ${INGESTED_MIN_MAIN_WORDS} qualifying words. Allocate the output budget to COUNTED MAIN STORY PROSE, not auxiliary fields.
- "summary": exactly 55–75 words, neutral and answer-first, grounded in concrete facts from the verified source material.
- "sections": exactly 6 substantive H2-style sections. EACH section must contain exactly 3 separate paragraphs. Target 50–70 words per paragraph. These 18 section paragraphs are the primary qualifying article body and should total roughly 900–1,200 factual words by themselves.
- Texas relevance, source attribution, FAQ, key takeaways, title, dek, and source lists DO NOT count toward the ${INGESTED_MIN_MAIN_WORDS}-word publication floor. Do not spend the main word budget on those fields.
- Use ONLY facts supported by the supplied verified source material. Avoid repetition and filler. Never use vague unsupported attribution such as “analysts say,” “observers believe,” “experts say/suggest/believe,” “consultants say,” or “sources close to.” Attribute claims to a named person or organization only when the verified source supports that attribution. If the verified source material genuinely cannot support an original factual article of at least ${INGESTED_MIN_MAIN_WORDS} qualifying words without inventing or repeating material, set brief.hasClearNewsEvent=false and leave the article body empty instead of fabricating content.
- "relevance": a concise Texas relevance section explaining the specific Texas stake (which city/region/agency/law is affected and why it matters to Texans).
- "keyTakeaways": exactly 3 short bullet strings.
- "faq": exactly 3 Q&A entries answering likely reader questions concisely from the verified source.

Pick every story in this batch (up to ${Math.min(3, items.length)} stories). Return ONLY valid JSON:
{"articles":[{"source_index":1,"category":"Legislature","title":"...","dek":"...","summary":"...","relevance":"...","sections":[{"heading":"...","paragraphs":["..."]}],"keyTakeaways":["..."],"faq":[{"q":"...","a":"..."}]}]}

Valid categories: ${CATEGORIES.join(", ")}.

CATEGORY CLASSIFICATION RULES (strict):
- Classify as "Non-Political" when the story is NOT primarily about: elections or campaigns, political parties, government or legislation, public policy, court rulings tied to politics, border policy, or political opinion. Examples: human-interest, animal stories, viral stories, community news, Texas culture, festivals/events, weather, travel, lifestyle, entertainment, sports, science, space, health (unless primarily political), and consumer news.
- Do NOT use "Education" as a fallback. Only assign "Education" when the primary subject is K–12 schools, colleges or universities, school boards, teachers, students, curriculum, education funding, or academic policy.
- When in doubt between "Education" and "Non-Political" for a human-interest story (e.g. a zoo animal, a festival, a community profile), pick "Non-Political".`;

  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": lovableApiKey,
    },
    body: JSON.stringify({
      model: "@cf/qwen/qwen3-30b-a3b-fp8",
      messages: [
        { role: "system", content: system + EDITORIAL_SYSTEM_ADDENDUM + (correctiveInstruction ? `\n\n${correctiveInstruction}` : "") + `\n\nBATCH NOTE: for a batch call, include the "brief" object INSIDE each articles[] entry, e.g. {"articles":[{"brief":{...}, "source_index":..., "title":..., ...}]}. Any article whose brief.hasClearNewsEvent is false will be discarded — leave that entry's body fields empty rather than fabricating.` },
        { role: "user", content: `Source stories:\n\n${list}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            articles: {
              type: "array",
              maxItems: 3,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  brief: {
                    type: "object",
                    additionalProperties: true,
                    properties: { hasClearNewsEvent: { type: "boolean" } },
                    required: ["hasClearNewsEvent"],
                  },
                  source_index: { type: "integer", minimum: 1, maximum: 3 },
                  category: { type: "string", enum: CATEGORIES },
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
                  keyTakeaways: {
                    type: "array",
                    minItems: 3,
                    maxItems: 3,
                    items: { type: "string" },
                  },
                  faq: {
                    type: "array",
                    minItems: 3,
                    maxItems: 3,
                    items: { type: "object", additionalProperties: false, properties: { q: { type: "string" }, a: { type: "string" } }, required: ["q", "a"] },
                  },
                },
                required: ["brief", "source_index", "category", "title", "dek", "summary", "relevance", "sections", "keyTakeaways", "faq"],
              },
            },
          },
          required: ["articles"],
        },
      },
      max_tokens: 16000,
    }),
  });

  if (!r.ok) {
    const body = await r.text();
    throw new Error(`AI gateway ${r.status}: ${body.slice(0, 300)}`);
  }

  const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "";
  const raw = parseAiArticles(content);
  const kept: RewrittenArticle[] = [];
  const rejectionReasons: string[] = [];
  for (const a of raw) {
    if (a?.brief?.hasClearNewsEvent === false) {
      rejectionReasons.push("brief_no_clear_news_event");
      continue;
    }
    if (!Number.isInteger(a.source_index) || a.source_index < 1 || a.source_index > items.length) {
      rejectionReasons.push("invalid_source_index");
      continue;
    }
    sanitizeVagueAttribution(a);
    a.summary = normalizeSummaryLength(a.summary, a.sections);
    const source = items[a.source_index - 1];
    const sourceText = source ? `${source.title} ${source.sourceText || source.description}` : undefined;
    const v = validateArticle(
      {
        title: a.title,
        dek: a.dek,
        summary: a.summary,
        relevance: a.relevance,
        sections: a.sections,
        faq: a.faq,
        keyTakeaways: a.keyTakeaways,
      },
      a.brief,
      sourceText,
    );
    if (!v.ok) {
      rejectionReasons.push(...v.reasons);
      console.warn("[generate-news] editorial validation dropped article", { title: a.title, reasons: v.reasons });
      continue;
    }
    kept.push(a);
  }
  if (kept.length === 0) {
    const reasons = [...new Set(rejectionReasons)].slice(0, 12);
    throw new Error(
      `AI response produced ${raw.length} article(s), none passed editorial validation: ${reasons.join(",") || "no_articles"}`,
    );
  }
  return kept;
}

async function rewriteWithAi(items: ScoredItem[], lovableApiKey: string) {
  const selected = await Promise.all(
    items.slice(0, 10).map(async (item, originalIndex) => ({
      story: await hydrateSourceContext(item),
      originalIndex,
    })),
  );

  const diagnostics: SourcePreflightSummary = {
    threshold: MIN_VERIFIED_SOURCE_WORDS,
    selected_count: selected.length,
    skipped_count: 0,
    stories: selected.map(({ story }) => ({
      title: story.title,
      source: story.source,
      sourceWords: sourceWordCount(story.sourceText || story.description),
    })),
  };

  const eligible = selected.filter(({ story }, index) => {
    const sourceWords = diagnostics.stories[index].sourceWords;
    const passes = sourceWords >= MIN_VERIFIED_SOURCE_WORDS;
    if (!passes) {
      diagnostics.skipped_count += 1;
      console.warn("[generate-news] skipped thin verified source before AI rewrite", {
        title: story.title,
        source: story.source,
        sourceWords,
        threshold: MIN_VERIFIED_SOURCE_WORDS,
      });
    }
    return passes;
  });

  if (eligible.length === 0) {
    throw new InsufficientVerifiedSourceError(diagnostics);
  }

  const combined: RewrittenArticle[] = [];
  const failures: string[] = [];

  // Long-form stories get their own structured-output request and full output-token budget.
  // Thin verified sources have already been removed, so no AI quota is spent on them.
  for (let index = 0; index < eligible.length; index += 1) {
    const { story, originalIndex } = eligible[index];
    try {
      const rewritten = await rewriteBatchWithAi([story], lovableApiKey);
      const firstArticle = rewritten.find((candidate) => candidate.source_index === 1);
      if (firstArticle) {
        let article = firstArticle;
        let mainWords = rewrittenMainWordCount(article);

        if (mainWords < INGESTED_MIN_MAIN_WORDS) {
          const correctiveInstruction = `CORRECTIVE LONG-FORM PASS: The previous valid draft produced only ${mainWords} qualifying main-story words, below the ${INGESTED_MIN_MAIN_WORDS}-word publication floor. Regenerate the COMPLETE article from the same verified source. Keep exactly 6 sections with exactly 3 separate paragraphs each. EACH of the 18 section paragraphs must be 65–80 words, so section prose alone totals at least 1,170 words before the summary. Use all concrete chronology, named entities, figures, decisions, causes, effects, and context explicitly supported by the verified source. Do not repeat yourself and do not invent facts. If the verified source cannot support that length without invention or repetition, set brief.hasClearNewsEvent=false instead.`;
          try {
            const corrected = await rewriteBatchWithAi([story], lovableApiKey, correctiveInstruction);
            const correctedArticle = corrected.find((candidate) => candidate.source_index === 1);
            const correctedWords = correctedArticle ? rewrittenMainWordCount(correctedArticle) : 0;
            if (correctedArticle && correctedWords > mainWords) {
              article = correctedArticle;
              mainWords = correctedWords;
            }
          } catch (correctiveError) {
            if (isQuotaOrRateLimitError(correctiveError)) throw correctiveError;
            console.warn("[generate-news] corrective long-form pass failed; retaining first valid draft for final hard gate", {
              sourceIndex: originalIndex + 1,
              title: story.title,
              firstDraftWords: mainWords,
              error: String(correctiveError),
            });
          }
        }

        combined.push({
          ...article,
          source_index: originalIndex + 1,
          verified_source_words: sourceWordCount(story.sourceText || story.description),
        });
      } else {
        const message = `story ${originalIndex + 1} produced no editorially valid article`;
        failures.push(message);
        console.warn("[generate-news] individual story produced no editorially valid article", {
          sourceIndex: originalIndex + 1,
          title: story.title,
        });
      }
    } catch (storyError) {
      if (isQuotaOrRateLimitError(storyError)) throw storyError;
      failures.push(String(storyError));
      console.warn("[generate-news] individual story rewrite skipped after one attempt", {
        sourceIndex: originalIndex + 1,
        title: story.title,
        error: String(storyError),
      });
    }

    if (index < eligible.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (combined.length === 0 && failures.length > 0) {
    throw new Error(`All selected rewrites failed: ${failures.slice(0, 3).join(" | ")}`);
  }

  return combined.slice(0, 10);
}

export const Route = createFileRoute("/api/public/hooks/generate-news")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const lovableApiKey = process.env.LOVABLE_API_KEY;

        if (!supabaseUrl || !serviceKey || !lovableApiKey) {
          return Response.json({ error: "Missing required environment variables" }, { status: 500 });
        }

        // Optional windowing so a caller can process one ranked story per
        // request instead of one long batch run.
        const query = new URL(request.url).searchParams;
        const clamp = (raw: string | null, min: number, max: number, fallback: number) => {
          if (raw === null || raw.trim() === "") return fallback;
          const parsed = Number(raw);
          if (!Number.isFinite(parsed)) return fallback;
          return Math.min(Math.max(Math.trunc(parsed), min), max);
        };
        const offset = clamp(query.get("offset"), 0, 19, 0);
        const limit = clamp(query.get("limit"), 1, 3, 3);
        const windowed = query.has("offset") || query.has("limit");

        const feeds = await Promise.all(
          RSS_SOURCES.map(async (s) => {
            const xml = await fetchWithTimeout(s.url);
            return xml ? parseRss(xml, s.name, s.category) : [];
          }),
        );
        const rawItems = feeds.flat();
        if (rawItems.length === 0) {
          return Response.json({ error: "No RSS items fetched" }, { status: 502 });
        }

        const scored = scoreAndFilter(rawItems);
        if (scored.length === 0) {
          return Response.json({ error: "No items met the publish threshold" }, { status: 200 });
        }

        // Slice BEFORE the rewrite. `items` is the local array every downstream
        // source_index lookup resolves against, so mapping stays correct.
        const items = windowed ? scored.slice(offset, offset + limit) : scored;
        if (items.length === 0) {
          return Response.json(
            {
              ok: true,
              no_items: true,
              reason: "offset_beyond_scored_items",
              offset,
              limit,
              scored_count: scored.length,
              inserted: 0,
            },
            { status: 200 },
          );
        }

        let rewritten: RewrittenArticle[];
        try {
          rewritten = await rewriteWithAi(items, lovableApiKey);
        } catch (err) {
          if (err instanceof InsufficientVerifiedSourceError) {
            return Response.json(
              {
                ok: true,
                no_items: true,
                reason: "insufficient_verified_source",
                inserted: 0,
                diagnostics: err.diagnostics,
              },
              { status: 200 },
            );
          }
          console.error("AI rewrite failed", err);
          return Response.json({ error: "AI rewrite failed", details: String(err) }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const now = new Date();
        const datePrefix = now.toISOString().slice(0, 10);
        const rows = rewritten
          .filter(
            (a) =>
              a.title &&
              a.dek &&
              a.source_index >= 1 &&
              a.source_index <= items.length &&
              typeof a.summary === "string" &&
              typeof a.relevance === "string" &&
              a.relevance.trim().length >= 40,
          )
          .map((a) => {
            const src = items[a.source_index - 1];
            const category = (CATEGORIES as readonly string[]).includes(a.category) ? a.category : src.sourceCategory;
            const slug = `${datePrefix}-${slugify(a.title)}`;
            const takeaways =
              Array.isArray(a.keyTakeaways) && a.keyTakeaways.length > 0
                ? a.keyTakeaways.slice(0, 5)
                : [`Source: ${src.source}.`, "Keep TX Red rewrote this update for Texas readers."];
            const bodyJson = {
              updated: now.toISOString().slice(0, 10),
              intro: [a.summary!.trim()],
              sections: [
                { heading: "Texas relevance", paragraphs: [a.relevance!.trim()] },
                ...(Array.isArray(a.sections)
                  ? a.sections.filter((s) => s?.heading && Array.isArray(s.paragraphs) && s.paragraphs.length > 0).slice(0, 10)
                  : []),
                {
                  heading: "Source attribution",
                  paragraphs: [
                    `This story was reported using a public release from ${src.source}. Keep TX Red rewrote the coverage independently and links to the original for verification.`,
                  ],
                },
              ],
              faq: Array.isArray(a.faq) ? a.faq.slice(0, 6) : [],
              sources: [{ label: `${src.source} — original report`, url: src.link }],
              keyTakeaways: takeaways,
            };
            return {
              slug,
              internal_url: `/news/${slug}`,
              is_ingested: false,
              category,
              title: a.title.slice(0, 200),
              dek: a.dek.slice(0, 400),
              source_name: src.source,
              source_url: src.link,
              published_at: now.toISOString(),
              score: src.score,
              is_breaking: src.isBreaking,
              kind: "news",
              body: articleBodyText(bodyJson),
              body_json: bodyJson,
            };
          })
          .filter(
            (row) =>
              articleMainWordCount(row.body_json) >= INGESTED_MIN_MAIN_WORDS &&
              meetsArticleMainWordCount(row.kind, row.body_json),
          );

        if (rows.length === 0) {
          const mainWordCounts = rewritten.map(rewrittenMainWordCount);
          const sourceWordCounts = rewritten.map((article) => {
            if (typeof article.verified_source_words === "number") return article.verified_source_words;
            const source = items[article.source_index - 1];
            return sourceWordCount(source?.sourceText || source?.description);
          });
          return Response.json(
            {
              error: "No valid rewritten articles",
              diagnostics: {
                rewritten: rewritten.length,
                min_main_words: INGESTED_MIN_MAIN_WORDS,
                min_verified_source_words: MIN_VERIFIED_SOURCE_WORDS,
                main_word_counts: mainWordCounts.slice(0, 10),
                source_word_counts: sourceWordCounts.slice(0, 10),
              },
            },
            { status: 500 },
          );
        }

        rows.forEach((r) => enrichArticleRow(r));

        const { error: insertError, count } = await supabase
          .from("daily_articles")
          .upsert(rows, { onConflict: "slug", count: "exact" });

        if (insertError) {
          console.error("Insert failed", insertError);
          return Response.json({ error: insertError.message }, { status: 500 });
        }

        await Promise.allSettled(rows.map((row) => generateFeaturedImageForSlugDirect(row.slug, true)));

        return Response.json({
          ok: true,
          inserted: count ?? rows.length,
          fetched: rawItems.length,
          scored: items.length,
          breaking: rows.filter((r) => r.is_breaking).length,
        });
      },
    },
  },
});