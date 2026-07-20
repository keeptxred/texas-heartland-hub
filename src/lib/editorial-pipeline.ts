// Editorial pipeline shared by every AI article generator.
//
// This module does NOT touch schema, routing, publishing, SEO, or the admin
// workflows. It only shapes the AI prompt and validates the AI output before
// an article is allowed to enter the normal daily_articles insert path.
//
// The pipeline enforces four things:
//   1. Story analysis — the model must emit a `brief` block classifying the
//      story, listing entities, dates, current/sought offices, and stating
//      whether a clear news event exists. `hasClearNewsEvent === false`
//      means the generator returns null instead of fabricating an article.
//   2. Internal fact extraction — the `brief.facts` block separates verified
//      facts (names, dates, locations, actions, official roles, numbers,
//      quotes) from `brief.analysis` (opinions, predictions, implications).
//      Only facts may be used as the article's factual foundation.
//   3. Relationship validation — when the story mentions more than one
//      person or organization, `brief.relationships` must explain how they
//      relate. Unrelated subjects mentioned in the article body without a
//      relationship entry fail validation.
//   4. Editorial quality validation — headline vs. body match, banned
//      unsupported filler phrases, invented polling / consultants / stats,
//      current-vs-sought-office confusion, generic-filler body.
//
// Callers wrap their existing AI call so the model receives
// `EDITORIAL_SYSTEM_ADDENDUM` on the first pass and
// `EDITORIAL_STRICT_RETRY_ADDENDUM` on the retry. `validateArticle()` is run
// after each parse. `runEditorialRewrite()` glues it together.

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
  sections?: { heading?: string; paragraphs?: string[] }[];
  faq?: { q?: string; a?: string }[];
  keyTakeaways?: string[];
};

// Appended to every generator's system prompt. Forces the model to output a
// `brief` block BEFORE writing the article and to obey the fact / phrasing
// rules for the article itself.
export const EDITORIAL_SYSTEM_ADDENDUM = `

EDITORIAL PIPELINE (MANDATORY — output BEFORE any article prose):
You MUST include a "brief" object as the FIRST field of the JSON you return.
The brief is your analysis of the source material. Use ONLY the brief.facts
block as the factual foundation of the article body. Never invent facts,
quotes, polling, consultants, statistics, or relationships.

"brief": {
  "hasClearNewsEvent": true|false,   // false = source has no clear event; caller will discard
  "storyType": "breaking news | politics | legislation | local news | business | sports | weather | crime/public safety | opinion | reddit/community discussion | feature | evergreen",
  "category": "your best-fit category",
  "primaryEvent": "one sentence: what actually happened",
  "whyNow": "one sentence: why this is news right now",
  "primarySubject": "the single main person/org/topic",
  "secondarySubjects": ["other people/orgs the source actually mentions"],
  "organizations": [],
  "locations": [],
  "dates": [],
  "currentOffices": [{"name":"...","office":"currently held office"}],
  "officesSought": [{"name":"...","office":"office being sought"}],
  "legislation": "bill/court/election details if applicable, else omit",
  "relationships": [
    {"a":"name","b":"name","relationship":"how the source proves they relate"}
  ],
  "facts": {
    "names":[], "dates":[], "locations":[], "actions":[],
    "officialRoles":[], "numbers":[], "quotes":[]
  },
  "analysis": {
    "opinions":[], "predictions":[], "implications":[]
  }
}

RULES DERIVED FROM THE BRIEF:
- If hasClearNewsEvent is false, still emit the brief but keep article fields empty. The caller will discard.
- The article's FIRST paragraph MUST answer: what happened, who is involved, when, and why it is news. Do not open with vague analysis.
- Every person or organization named in the article body must appear in brief.primarySubject, brief.secondarySubjects, or brief.organizations. Do not introduce anyone the source did not actually mention.
- If two or more subjects appear together in a sentence, brief.relationships MUST contain an entry proving their connection from the source. Otherwise treat them separately or remove the unrelated subject.
- Never confuse a subject's current office with an office they are seeking. Use brief.currentOffices vs brief.officesSought exactly.
- Do not invent polling, unnamed "analysts", unnamed "observers", unnamed "consultants", "experts", "sources close to", or generic public-opinion claims. Do not use the phrases: "political momentum", "grassroots movement", "growing influence", "voters are shifting", "analysts say", "observers believe", "experts suggest", "consultants say", unless the source explicitly supports them AND the supporting fact is listed in brief.facts.
- Do not invent statistics or numbers. Every numeric claim in the body must appear in brief.facts.numbers.
`;

// Sent on the single retry when the first draft fails validation.
export const EDITORIAL_STRICT_RETRY_ADDENDUM = `

RETRY — STRICT MODE:
Your previous draft failed editorial validation. Regenerate the article using
ONLY the verified facts you would list in brief.facts. Do not add any
person, organization, poll, statistic, quote, or relationship that is not
supported directly by the source blurb. Remove every banned filler phrase.
The first paragraph must state what/who/when/why. If you cannot write a
source-grounded article, set brief.hasClearNewsEvent to false and leave the
article fields empty.
`;

// Unsupported filler phrases. These are only banned when they appear without
// a concrete supporting fact nearby (a named source, a percentage, a poll
// name, etc.). We keep the check simple: reject on presence, since our
// generators do not currently cite named polls.
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

function articleProse(article: ArticleShape): string {
  const parts: string[] = [];
  if (article.summary) parts.push(article.summary);
  if (article.relevance) parts.push(article.relevance);
  for (const s of article.sections ?? []) {
    if (s?.heading) parts.push(s.heading);
    for (const p of s?.paragraphs ?? []) parts.push(p);
  }
  return parts.join(" \n\n");
}

function firstParagraph(article: ArticleShape): string {
  return (article.summary ?? article.sections?.[0]?.paragraphs?.[0] ?? "").trim();
}

function tokensFrom(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4),
  );
}

function containsName(haystack: string, name: string): boolean {
  if (!name) return false;
  return new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(haystack);
}

// Very light "does the headline match the story" heuristic: at least one
// meaningful token in the title must appear in the first paragraph, or the
// title must contain the primary subject or primary event keywords.
function headlineMatchesBody(article: ArticleShape, brief?: StoryBrief): boolean {
  const title = article.title ?? "";
  const first = firstParagraph(article);
  if (!title || !first) return false;
  const titleTokens = tokensFrom(title);
  const bodyTokens = tokensFrom(first);
  const stop = new Set([
    "texas", "texans", "houston", "dallas", "austin", "keep", "news", "story", "today", "state",
    "this", "that", "with", "what", "when", "where", "will", "have", "into", "from", "about",
  ]);
  let overlap = 0;
  for (const t of titleTokens) if (!stop.has(t) && bodyTokens.has(t)) overlap++;
  if (overlap >= 1) return true;
  if (brief?.primarySubject && containsName(title, brief.primarySubject)) return true;
  if (brief?.primaryEvent) {
    for (const t of tokensFrom(brief.primaryEvent)) {
      if (!stop.has(t) && titleTokens.has(t)) return true;
    }
  }
  return false;
}

export type ValidationResult = { ok: boolean; reasons: string[] };

// Runs after the AI returns. Rejects fabricated / off-topic / filler drafts.
export function validateArticle(article: ArticleShape, brief?: StoryBrief): ValidationResult {
  const reasons: string[] = [];
  const prose = articleProse(article);
  const proseAndTitle = `${article.title ?? ""} \n ${prose}`;

  if (!article.title || article.title.trim().length < 10) {
    reasons.push("missing_or_short_title");
  }
  if (!prose || prose.trim().length < 200) {
    reasons.push("body_too_short_or_missing");
  }
  if (article.title && prose && !headlineMatchesBody(article, brief)) {
    reasons.push("headline_does_not_match_body");
  }

  for (const re of BANNED_UNSUPPORTED_PATTERNS) {
    if (re.test(proseAndTitle)) {
      reasons.push(`banned_phrase:${re.source}`);
      break;
    }
  }

  // Unrelated-subject check: any secondary subject named in the article body
  // must appear in brief.relationships as related to the primary subject or
  // primary event.
  if (brief) {
    const primary = (brief.primarySubject ?? "").trim();
    const related = new Set(
      (brief.relationships ?? []).flatMap((r) => [r?.a ?? "", r?.b ?? ""]).map((s) => s.toLowerCase()),
    );
    for (const sub of brief.secondarySubjects ?? []) {
      if (!sub) continue;
      const s = sub.trim();
      if (!s || s.toLowerCase() === primary.toLowerCase()) continue;
      if (!containsName(prose, s)) continue;
      if (!related.has(s.toLowerCase())) {
        reasons.push(`unrelated_subject:${s}`);
      }
    }

    // Current vs. sought office confusion: a person listed with a sought
    // office must not be described in the body as currently holding it.
    for (const seek of brief.officesSought ?? []) {
      if (!seek?.name || !seek.office) continue;
      const nameRe = new RegExp(
        `\\b${seek.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b[^.]*?\\bis (?:the )?(?:current|sitting|serving)\\s+${seek.office.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
        "i",
      );
      if (nameRe.test(prose)) reasons.push(`current_vs_sought_office:${seek.name}`);
    }

    // hasClearNewsEvent === false is a fatal signal.
    if (brief.hasClearNewsEvent === false) {
      reasons.push("brief_no_clear_news_event");
    }
  }

  // Generic-filler heuristic: article body is dominated by hedging language.
  const hedgeHits = (prose.match(/\b(may|might|could|potentially|reportedly|allegedly|some (?:say|believe))\b/gi) ?? []).length;
  const wordish = prose.split(/\s+/).filter(Boolean).length;
  if (wordish > 300 && hedgeHits / wordish > 0.035) {
    reasons.push("generic_filler_body");
  }

  return { ok: reasons.length === 0, reasons };
}

// Parses `{ brief, ...article }` from an AI JSON response. Returns nulls
// individually so callers can distinguish "no brief" from "brief present but
// no clear event".
export function parseEditorialResponse<T extends ArticleShape>(
  raw: string,
): { brief: StoryBrief | null; article: T | null } {
  try {
    const parsed = JSON.parse(raw) as { brief?: StoryBrief } & T;
    const brief = parsed?.brief ?? null;
    const article = { ...parsed } as T & { brief?: StoryBrief };
    delete (article as { brief?: StoryBrief }).brief;
    return { brief, article: article as T };
  } catch {
    return { brief: null, article: null };
  }
}

// Generator callback contract. Receives the addendum text the caller must
// append to its own system prompt, and must return the raw JSON string from
// the model (or null on transport failure). The callback owns the model
// name, max_tokens, timeout, headers, and existing per-generator prompt.
export type GeneratorFn<T extends ArticleShape> = (
  addendum: string,
  attempt: "initial" | "strict-retry",
) => Promise<{ raw: string | null } | null>;

export type EditorialResult<T extends ArticleShape> = {
  article: T | null;
  brief: StoryBrief | null;
  validation: ValidationResult;
  attempts: number;
  droppedReason?: "no_clear_news_event" | "validation_failed_twice" | "no_response";
};

// Runs the analyze -> generate -> validate -> single-retry pipeline around
// an existing AI call. Callers who prefer to keep their own control flow can
// use EDITORIAL_SYSTEM_ADDENDUM, EDITORIAL_STRICT_RETRY_ADDENDUM,
// parseEditorialResponse, and validateArticle directly.
export async function runEditorialRewrite<T extends ArticleShape>(
  generate: GeneratorFn<T>,
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
  const parsed1 = parseEditorialResponse<T>(first.raw);
  if (parsed1.brief?.hasClearNewsEvent === false) {
    return {
      article: null,
      brief: parsed1.brief,
      validation: { ok: false, reasons: ["brief_no_clear_news_event"] },
      attempts: 1,
      droppedReason: "no_clear_news_event",
    };
  }
  const v1 = validateArticle(parsed1.article ?? {}, parsed1.brief ?? undefined);
  if (v1.ok && parsed1.article) {
    return { article: parsed1.article, brief: parsed1.brief, validation: v1, attempts: 1 };
  }

  const second = await generate(
    EDITORIAL_SYSTEM_ADDENDUM + EDITORIAL_STRICT_RETRY_ADDENDUM,
    "strict-retry",
  );
  if (!second?.raw) {
    return {
      article: null,
      brief: parsed1.brief,
      validation: v1,
      attempts: 2,
      droppedReason: "validation_failed_twice",
    };
  }
  const parsed2 = parseEditorialResponse<T>(second.raw);
  if (parsed2.brief?.hasClearNewsEvent === false) {
    return {
      article: null,
      brief: parsed2.brief,
      validation: { ok: false, reasons: ["brief_no_clear_news_event"] },
      attempts: 2,
      droppedReason: "no_clear_news_event",
    };
  }
  const v2 = validateArticle(parsed2.article ?? {}, parsed2.brief ?? undefined);
  if (v2.ok && parsed2.article) {
    return { article: parsed2.article, brief: parsed2.brief, validation: v2, attempts: 2 };
  }
  return {
    article: null,
    brief: parsed2.brief ?? parsed1.brief,
    validation: v2,
    attempts: 2,
    droppedReason: "validation_failed_twice",
  };
}