import { repairArticleReadability, validateArticleReadability } from "./editorial-readability";
import { validateMultiSourceDraftAgainstPacket } from "./multisource-draft-quality";

// Shared analyze-first editorial validation for AI-generated articles.

export type StoryBrief = {
  hasClearNewsEvent: boolean;
  storyType?: string;
  category?: string;
  primaryEvent?: string;
  whyNow?: string;
  primarySubject?: string;
  secondarySubjects?: string[];
  organizations?: string[];
  locations?: string[];
  dates?: string[];
  currentOffices?: { name: string; office: string }[];
  officesSought?: { name: string; office: string }[];
  legislation?: string;
  courtOrElection?: string;
  relationships?: { a: string; b: string; relationship: string }[];
  facts?: {
    names?: string[];
    dates?: string[];
    locations?: string[];
    actions?: string[];
    officialRoles?: string[];
    numbers?: string[];
    quotes?: string[];
  };
  analysis?: {
    opinions?: string[];
    predictions?: string[];
    implications?: string[];
  };
};

export type ArticleShape = {
  title?: string;
  dek?: string;
  summary?: string;
  relevance?: string;
  analysis?: string;
  category?: string;
  sections?: { heading?: string; paragraphs?: string[] }[];
  faq?: { q?: string; a?: string }[];
  keyTakeaways?: string[];
};

const ANALYSIS_CATEGORIES = new Set(["non-political", "business", "education", "sports"]);
const COMPACT_SOURCE_MAX_CHARS = 4_500;
const RICH_SOURCE_MIN_CHARS = 9_000;
const COMPACT_NEWS_MIN_WORDS = 650;
const STANDARD_NEWS_MIN_WORDS = 800;
const RICH_ANALYSIS_MIN_WORDS = 1200;

/**
 * Length follows available evidence instead of category alone. A thin but
 * legitimate primary-source update should become a concise factual article,
 * not trigger repeated attempts to manufacture 1,200 words. Rich multi-source
 * or long-form evidence still earns the deeper analysis floor.
 *
 * When sourceText is omitted, preserve the historical category-based contract
 * for callers/tests that have not supplied an evidence packet.
 */
export function editorialMinimumFor(category?: string | null, sourceText?: string | null): number {
  const isAnalysis = ANALYSIS_CATEGORIES.has((category ?? "").trim().toLowerCase());
  if (sourceText == null) return isAnalysis ? RICH_ANALYSIS_MIN_WORDS : STANDARD_NEWS_MIN_WORDS;

  const evidenceChars = sourceText.trim().length;
  if (evidenceChars < COMPACT_SOURCE_MAX_CHARS) return COMPACT_NEWS_MIN_WORDS;
  if (isAnalysis && evidenceChars >= RICH_SOURCE_MIN_CHARS) return RICH_ANALYSIS_MIN_WORDS;
  return STANDARD_NEWS_MIN_WORDS;
}

export const EDITORIAL_SYSTEM_ADDENDUM = `

EDITORIAL PIPELINE (MANDATORY — output BEFORE any article prose):
You MUST include a "brief" object as the FIRST field of the JSON you return.
The brief is your analysis of the source material. Use ONLY brief.facts as the
factual foundation of the article. Never invent facts, quotes, polling,
consultants, statistics, offices, or relationships.

"brief": {
  "hasClearNewsEvent": true,
  "storyType": "best-fit story type",
  "category": "best-fit category",
  "primaryEvent": "what happened",
  "whyNow": "why it is news now",
  "primarySubject": "main person, organization, or topic",
  "secondarySubjects": [],
  "organizations": [],
  "locations": [],
  "dates": [],
  "currentOffices": [],
  "officesSought": [],
  "relationships": [],
  "facts": {
    "names": [], "dates": [], "locations": [], "actions": [],
    "officialRoles": [], "numbers": [], "quotes": []
  },
  "analysis": { "opinions": [], "predictions": [], "implications": [] }
}

RULES DERIVED FROM THE BRIEF:
- If there is no clear event, set hasClearNewsEvent to false and leave article fields empty.
- The first paragraph must answer what happened, who is involved, when, and why it matters now.
- Every named person or organization must be supported by the source and represented in the brief.
- A relationship entry is required only when two subjects are asserted to be connected in the same sentence. A factual attendee list or separate mentions do not require pairwise relationship entries.
- Never confuse a current office with an office being sought.
- Do not invent polling, unnamed analysts, observers, consultants, experts, statistics, quotes, or public-opinion claims.

EVIDENCE-DRIVEN MAIN-STORY LENGTH REQUIREMENTS:
- The word-count floor applies to main-story prose only: summary + analysis + section paragraph strings. Do not count the title, dek, headings, FAQ, keywords, key takeaways, or metadata.
- Let the supplied evidence determine depth. Compact single-source material should become a concise but substantive article, generally at least about 650 main-story words.
- Standard source-backed news should generally reach at least 800 main-story words.
- Rich source packets for non-political, business, education, or sports analysis should reach at least 1,200 main-story words when the evidence actually supports that depth.
- The local validator computes the exact evidence tier from the supplied source packet; if it reports a word-count failure, repair to that exact number rather than assuming 1,200 words.
- These are minimums, not targets to pad toward. Reach the applicable tier using only source-supported detail, chronology, stakeholders, consequences, and useful reader context.
- Never invent or repeat facts merely to satisfy length. A clean 650–850 word factual news report is better than padded copy from a thin release.

AEO / ANSWER-FIRST SUMMARY REQUIREMENTS:
- The "summary" field is the article's direct-answer block. Write it as a self-contained 45–90 word answer to the headline/topic.
- Put the answer in the first sentence. Do not begin with throat-clearing such as "In a development," "This story is about," or "Keep TX Red is tracking."
- Name the primary subject and concrete action/event immediately. Include the relevant Texas location, agency, office, date, or consequence when the source supports it.
- A reader or AI system should be able to quote the summary alone and understand what happened and why it matters.
- Do not repeat the headline verbatim and do not add unsupported interpretation merely to make the summary sound definitive.

READABILITY / WEB STRUCTURE REQUIREMENTS:
- Write for a news website, not a print essay. Paragraphs must be visually short and easy to scan.
- Target roughly 40–100 words per normal paragraph. Avoid paragraphs over 130 words; never exceed 150 words unless the paragraph is a direct quotation that cannot be split safely.
- Most paragraphs should contain 1–4 sentences. Do not put more than 5 prose sentences into one paragraph.
- One distinct idea belongs in one paragraph. Start a new paragraph when the subject, time frame, stakeholder, consequence, example, or argument changes.
- In JSON output, EACH visible paragraph must be its own string inside the relevant paragraphs[] array. Never place multiple paragraphs separated by blank lines or newline characters inside one paragraphs[] string.
- Do not compress several paragraphs into a single string merely to satisfy a word-count requirement. Add factual depth through additional paragraphs instead.
- When sections are requested, use specific, descriptive H2-style headings that tell the reader what the section is about. Avoid generic headings such as "Conclusion", "Overview", "Background", or "The story" when a more specific heading is possible.
- Do not manufacture filler sections or repetitive headings. Section breaks should reflect genuine changes in topic or reader intent.
- Keep lists as lists when the source material is naturally enumerated; do not turn a list of separate points into one dense prose paragraph.
- Preserve quotations as quotations and do not bury a long quotation inside an unrelated prose paragraph.
`;

export const EDITORIAL_STRICT_RETRY_ADDENDUM = `

RETRY — STRICT MODE:
The previous draft failed editorial validation. Repair the supplied draft instead
of restarting from scratch. Preserve every supported fact that is already correct
and change the smallest amount needed to clear each listed validation failure.
Return a concrete, source-supported title of at least 10 characters. The summary
must be a self-contained, answer-first 45–90 word explanation whose first sentence
states what happened. Recalculate the main-story word count using summary +
analysis + section paragraphs only. If the validator reports a tiered_main_word_count
failure, use the exact denominator in that failure as the required evidence-driven
floor. Add only source-supported detail; never use filler, repetition, or invented
facts to reach it. Correct readability failures by splitting oversized paragraphs
into separate paragraph array items at natural idea boundaries, keeping normal
paragraphs below 130 words, never placing multiple blank-line-separated paragraphs
inside one paragraphs[] string, and using descriptive section headings instead of
generic filler. If a factual article cannot be produced, set brief.hasClearNewsEvent
to false and leave article fields empty.
`;

// Retained for compatibility with older generator adapters, but normal
// production rewrites are capped at the initial pass plus one targeted repair.
export const EDITORIAL_LENGTH_COMPLETION_ADDENDUM = `

LENGTH COMPLETION — FINAL REPAIR PASS:
Complete an existing verified draft only to the exact evidence-driven word floor
reported by local validation. Never pad, repeat, speculate, or add unsupported
facts. Return the complete corrected article JSON.
`;

const BANNED_UNSUPPORTED_PATTERNS: RegExp[] = [
  /\bpolitical momentum\b/i,
  /\bgrassroots movement\b/i,
  /\bgrowing influence\b/i,
  /\bvoters are shifting\b/i,
  /\banalysts say\b/i,
  /\banalysts believe\b/i,
  /\bobservers (?:say|believe|note)\b/i,
  /\bexperts (?:say|suggest|believe)\b/i,
  /\bconsultants (?:say|note|believe)\b/i,
  /\bsources close to\b/i,
  /\bpublic opinion (?:is|has) shift/i,
  /\bpolls (?:show|indicate|suggest)\b/i,
];

const GENERIC_SUMMARY_OPENERS: RegExp[] = [
  /^in a (?:new|major|recent|significant) development\b/i,
  /^this (?:story|article|report)\b/i,
  /^keep tx red (?:is|will be) tracking\b/i,
  /^keep texas red (?:is|will be) tracking\b/i,
  /^there (?:has been|is|are)\b/i,
];

const SOURCE_ALIAS_STOP_TOKENS = new Set([
  "texas", "texans", "houston", "dallas", "austin", "fort", "worth", "san", "antonio",
  "city", "county", "state", "united", "states", "american", "national", "association",
  "department", "office", "company", "group", "team", "news", "sports", "football",
  "baseball", "basketball", "soccer", "hockey", "university", "college", "school",
]);

function articleProse(article: ArticleShape): string {
  const parts: string[] = [];
  if (article.summary) parts.push(article.summary);
  if (article.relevance) parts.push(article.relevance);
  for (const section of article.sections ?? []) {
    if (section?.heading) parts.push(section.heading);
    for (const paragraph of section?.paragraphs ?? []) parts.push(paragraph);
  }
  return parts.join(" \n\n");
}

function mainStoryProse(article: ArticleShape): string {
  return [
    article.summary ?? "",
    article.analysis ?? "",
    ...(article.sections ?? []).flatMap((section) => section.paragraphs ?? []),
  ].join(" ");
}

function firstParagraph(article: ArticleShape): string {
  return (article.summary ?? article.sections?.[0]?.paragraphs?.[0] ?? "").trim();
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsName(haystack: string, name: string): boolean {
  if (!name) return false;
  return new RegExp(`\\b${escapeRegExp(name)}\\b`, "i").test(haystack);
}

function sentenceHasBoth(sentence: string, a: string, b: string): boolean {
  return containsName(sentence, a) && containsName(sentence, b);
}

function tokensFrom(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 4),
  );
}

function sourceSupportsSubject(sourceText: string, subject: string): boolean {
  if (containsName(sourceText, subject)) return true;

  const sourceTokens = tokensFrom(sourceText);
  const subjectTokens = [...tokensFrom(subject)];
  const aliasToken = [...subjectTokens]
    .reverse()
    .find((token) => !SOURCE_ALIAS_STOP_TOKENS.has(token));

  // A normalized/full subject may be supported by its trailing distinctive token:
  // "Seahawks" supports "Seattle Seahawks", while the shared city "Seattle" alone
  // does not support a different organization such as "Seattle Mariners".
  return Boolean(aliasToken && sourceTokens.has(aliasToken));
}

function headlineMatchesBody(article: ArticleShape, brief?: StoryBrief): boolean {
  const title = article.title ?? "";
  const first = firstParagraph(article);
  if (!title || !first) return false;

  const titleTokens = tokensFrom(title);
  const bodyTokens = tokensFrom(first);
  const stop = new Set([
    "texas", "texans", "houston", "dallas", "austin", "keep", "news", "story", "today",
    "state", "this", "that", "with", "what", "when", "where", "will", "have", "into",
    "from", "about",
  ]);

  for (const token of titleTokens) {
    if (!stop.has(token) && bodyTokens.has(token)) return true;
  }
  if (brief?.primarySubject && containsName(title, brief.primarySubject)) return true;
  if (brief?.primaryEvent) {
    for (const token of tokensFrom(brief.primaryEvent)) {
      if (!stop.has(token) && titleTokens.has(token)) return true;
    }
  }
  return false;
}

export type ValidationResult = { ok: boolean; reasons: string[] };

export function validateArticle(article: ArticleShape, brief?: StoryBrief, sourceText?: string): ValidationResult {
  const reasons: string[] = [];
  const prose = articleProse(article);
  const proseAndTitle = `${article.title ?? ""} \n ${prose}`;
  const summary = (article.summary ?? "").trim();

  if (!article.title || article.title.trim().length < 10) reasons.push("missing_or_short_title");
  if (!prose || prose.trim().length < 200) reasons.push("body_too_short_or_missing");
  if (!summary) {
    reasons.push("missing_direct_answer_summary");
  } else {
    const summaryWords = countWords(summary);
    if (summaryWords < 35 || summaryWords > 110) reasons.push("direct_answer_summary_length");
    if (GENERIC_SUMMARY_OPENERS.some((pattern) => pattern.test(summary))) {
      reasons.push("generic_summary_opener");
    }
  }

  const tierCategory = article.category ?? brief?.category;
  const tierMinimum = editorialMinimumFor(tierCategory, sourceText);
  const mainWords = countWords(mainStoryProse(article));
  if (mainWords < tierMinimum) reasons.push(`tiered_main_word_count:${mainWords}/${tierMinimum}`);

  reasons.push(...validateArticleReadability(article));

  if (article.title && prose && !headlineMatchesBody(article, brief)) {
    reasons.push("headline_does_not_match_body");
  }

  for (const pattern of BANNED_UNSUPPORTED_PATTERNS) {
    if (pattern.test(proseAndTitle)) {
      reasons.push(`banned_phrase:${pattern.source}`);
      break;
    }
  }

  if (brief) {
    const primary = (brief.primarySubject ?? "").trim();
    const relationships = brief.relationships ?? [];
    const sentences = prose.split(/(?<=[.!?])\s+/).filter(Boolean);

    if (primary) {
      for (const secondaryRaw of brief.secondarySubjects ?? []) {
        const secondary = secondaryRaw?.trim();
        if (!secondary || secondary.toLowerCase() === primary.toLowerCase()) continue;
        if (sourceText && sourceSupportsSubject(sourceText, secondary)) continue;

        const assertedTogether = sentences.some((sentence) =>
          sentenceHasBoth(sentence, primary, secondary),
        );
        if (!assertedTogether) continue;

        const hasRelationship = relationships.some((relationship) => {
          const a = (relationship?.a ?? "").trim().toLowerCase();
          const b = (relationship?.b ?? "").trim().toLowerCase();
          const p = primary.toLowerCase();
          const s = secondary.toLowerCase();
          return (a === p && b === s) || (a === s && b === p);
        });
        if (!hasRelationship) reasons.push(`unrelated_subject:${secondary}`);
      }
    }

    for (const sought of brief.officesSought ?? []) {
      if (!sought?.name || !sought.office) continue;
      const name = escapeRegExp(sought.name);
      const office = escapeRegExp(sought.office);
      const pattern = new RegExp(
        `\\b${name}\\b[^.]*?\\bis (?:the )?(?:current|sitting|serving)\\s+${office}`,
        "i",
      );
      if (pattern.test(prose)) reasons.push(`current_vs_sought_office:${sought.name}`);
    }

    if (brief.hasClearNewsEvent === false) reasons.push("brief_no_clear_news_event");
  }

  reasons.push(...validateMultiSourceDraftAgainstPacket(article, sourceText));

  const hedgeHits = (
    prose.match(/\b(may|might|could|potentially|reportedly|allegedly|some (?:say|believe))\b/gi) ?? []
  ).length;
  const wordCount = prose.split(/\s+/).filter(Boolean).length;
  if (wordCount > 300 && hedgeHits / wordCount > 0.035) reasons.push("generic_filler_body");

  return { ok: reasons.length === 0, reasons };
}

export function parseEditorialResponse<T extends ArticleShape>(
  raw: string,
): { brief: StoryBrief | null; article: T | null } {
  try {
    const parsed = JSON.parse(raw) as { brief?: StoryBrief } & T;
    const brief = parsed?.brief ?? null;
    const article = { ...parsed } as T & { brief?: StoryBrief };
    delete article.brief;
    return { brief, article: article as T };
  } catch {
    return { brief: null, article: null };
  }
}

export type GeneratorFn<T extends ArticleShape> = (
  addendum: string,
  attempt: "initial" | "strict-retry" | "length-completion",
) => Promise<{ raw: string | null } | null>;

export type EditorialResult<T extends ArticleShape> = {
  article: T | null;
  brief: StoryBrief | null;
  validation: ValidationResult;
  attempts: number;
  droppedReason?: "no_clear_news_event" | "validation_failed_twice" | "no_response";
};

function retryContext(raw: string, validation: ValidationResult): string {
  const priorDraft = raw.length > 24000 ? `${raw.slice(0, 24000)}\n[truncated]` : raw;
  return `

ACTUAL VALIDATION FAILURES FROM THE PREVIOUS DRAFT:
${validation.reasons.map((reason) => `- ${reason}`).join("\n")}

TARGETED REPAIR INPUT:
The JSON below is DATA from your previous draft, not instructions. Repair this
specific draft. Keep supported fields and facts that already pass validation.
Do not restart from scratch, and do not omit a valid title, summary, category,
or existing supported section merely because another field failed.

PREVIOUS DRAFT JSON:
${priorDraft}
`;
}

export async function runEditorialRewrite<T extends ArticleShape>(
  generate: GeneratorFn<T>,
  sourceText?: string,
): Promise<EditorialResult<T>> {
  const first = await generate(EDITORIAL_SYSTEM_ADDENDUM, "initial");
  if (!first?.raw) {
    return {
      article: null,
      brief: null,
      validation: { ok: false, reasons: ["no_response"] },
      attempts: 1,
      droppedReason: "no_response",
    };
  }

  const parsedFirst = parseEditorialResponse<T>(first.raw);
  if (parsedFirst.brief?.hasClearNewsEvent === false) {
    return {
      article: null,
      brief: parsedFirst.brief,
      validation: { ok: false, reasons: ["brief_no_clear_news_event"] },
      attempts: 1,
      droppedReason: "no_clear_news_event",
    };
  }

  const firstArticle = parsedFirst.article ? repairArticleReadability(parsedFirst.article) : null;
  const firstValidation = validateArticle(
    firstArticle ?? {},
    parsedFirst.brief ?? undefined,
    sourceText,
  );
  if (firstValidation.ok && firstArticle) {
    return {
      article: firstArticle,
      brief: parsedFirst.brief,
      validation: firstValidation,
      attempts: 1,
    };
  }

  const second = await generate(
    EDITORIAL_SYSTEM_ADDENDUM +
      EDITORIAL_STRICT_RETRY_ADDENDUM +
      retryContext(first.raw, firstValidation),
    "strict-retry",
  );
  if (!second?.raw) {
    return {
      article: null,
      brief: parsedFirst.brief,
      validation: firstValidation,
      attempts: 2,
      droppedReason: "validation_failed_twice",
    };
  }

  const parsedSecond = parseEditorialResponse<T>(second.raw);
  if (parsedSecond.brief?.hasClearNewsEvent === false) {
    return {
      article: null,
      brief: parsedSecond.brief,
      validation: { ok: false, reasons: ["brief_no_clear_news_event"] },
      attempts: 2,
      droppedReason: "no_clear_news_event",
    };
  }

  const secondArticle = parsedSecond.article ? repairArticleReadability(parsedSecond.article) : null;
  const secondValidation = validateArticle(
    secondArticle ?? {},
    parsedSecond.brief ?? undefined,
    sourceText,
  );
  if (secondValidation.ok && secondArticle) {
    return {
      article: secondArticle,
      brief: parsedSecond.brief,
      validation: secondValidation,
      attempts: 2,
    };
  }

  // Two model calls is the hard ceiling for one source. A candidate that still
  // fails after a targeted repair is returned to the caller as failed so the
  // scheduler can cool it down and move to another story instead of spending
  // more credits on the same difficult source.
  return {
    article: null,
    brief: parsedSecond.brief ?? parsedFirst.brief,
    validation: secondValidation,
    attempts: 2,
    droppedReason: "validation_failed_twice",
  };
}
