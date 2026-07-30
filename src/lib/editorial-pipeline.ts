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
  sections?: { heading?: string; paragraphs?: string[] }[];
  faq?: { q?: string; a?: string }[];
  keyTakeaways?: string[];
};

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
`;

export const EDITORIAL_STRICT_RETRY_ADDENDUM = `

RETRY — STRICT MODE:
The previous draft failed editorial validation. Regenerate using only verified
source facts. Remove unsupported people, organizations, statistics, quotes,
relationships, and filler. The first paragraph must state what happened, who
was involved, when it occurred, and why it is news. If a factual article cannot
be produced, set brief.hasClearNewsEvent to false and leave article fields empty.
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

function firstParagraph(article: ArticleShape): string {
  return (article.summary ?? article.sections?.[0]?.paragraphs?.[0] ?? "").trim();
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

export function validateArticle(article: ArticleShape, brief?: StoryBrief): ValidationResult {
  const reasons: string[] = [];
  const prose = articleProse(article);
  const proseAndTitle = `${article.title ?? ""} \n ${prose}`;

  if (!article.title || article.title.trim().length < 10) reasons.push("missing_or_short_title");
  if (!prose || prose.trim().length < 200) reasons.push("body_too_short_or_missing");
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

    // The previous validator rejected any secondary subject mentioned anywhere
    // unless it appeared in relationships. That incorrectly rejected official
    // releases containing attendee lists. Enforce relationships only when the
    // prose actually places the primary and secondary subject in the same
    // sentence and therefore asserts a connection between them.
    if (primary) {
      for (const secondaryRaw of brief.secondarySubjects ?? []) {
        const secondary = secondaryRaw?.trim();
        if (!secondary || secondary.toLowerCase() === primary.toLowerCase()) continue;
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
  attempt: "initial" | "strict-retry",
) => Promise<{ raw: string | null } | null>;

export type EditorialResult<T extends ArticleShape> = {
  article: T | null;
  brief: StoryBrief | null;
  validation: ValidationResult;
  attempts: number;
  droppedReason?: "no_clear_news_event" | "validation_failed_twice" | "no_response";
};

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

  const firstValidation = validateArticle(
    parsedFirst.article ?? {},
    parsedFirst.brief ?? undefined,
  );
  if (firstValidation.ok && parsedFirst.article) {
    return {
      article: parsedFirst.article,
      brief: parsedFirst.brief,
      validation: firstValidation,
      attempts: 1,
    };
  }

  const second = await generate(
    EDITORIAL_SYSTEM_ADDENDUM + EDITORIAL_STRICT_RETRY_ADDENDUM,
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

  const secondValidation = validateArticle(
    parsedSecond.article ?? {},
    parsedSecond.brief ?? undefined,
  );
  if (secondValidation.ok && parsedSecond.article) {
    return {
      article: parsedSecond.article,
      brief: parsedSecond.brief,
      validation: secondValidation,
      attempts: 2,
    };
  }

  return {
    article: null,
    brief: parsedSecond.brief ?? parsedFirst.brief,
    validation: secondValidation,
    attempts: 2,
    droppedReason: "validation_failed_twice",
  };
}
