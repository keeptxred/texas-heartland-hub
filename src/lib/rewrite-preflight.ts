// Deterministic, AI-free preflight for the KeepTXRed rewrite pipeline.
//
// Given a feed item's title + already-extracted description (Reddit selftext,
// linked-source text, RSS summary — whatever ingestion has already stored),
// this returns a structured decision on whether it's worth spending an AI
// rewrite credit. It is intentionally cheap: no network calls, no AI, no
// database access. Callers in the UI can render it on every row; server
// callers can use it as a hard gate before invoking the editorial pipeline.

export type RewritePreflightReason =
  | "READY"
  | "PENDING_EXTRACTION"
  | "MISSING_SOURCE_URL"
  | "SOURCE_FETCH_FAILED"
  | "PAYWALL_OR_TRUNCATED"
  | "BODY_TOO_SHORT"
  | "BOILERPLATE_CONTENT"
  | "INSUFFICIENT_FACTS"
  | "NOT_ENGLISH"
  | "UNSUPPORTED_CONTENT_TYPE"
  | "NO_CLEAR_NEWS_EVENT";

export type RewritePreflightResult = {
  rewriteable: boolean;
  reason: RewritePreflightReason;
  message: string;
  sourceWordCount: number;
  factualSignalCount: number;
  hasClearNewsEvent: boolean | null;
};

export type RewritePreflightInput = {
  title: string | null | undefined;
  description: string | null | undefined;
  link?: string | null;
  isBreaking?: boolean;
};

// Practical thresholds. Government releases and other high-signal short
// factual sources bypass BODY_TOO_SHORT via the factual-signal count.
const BREAKING_MIN_WORDS = 250;
const STANDARD_MIN_WORDS = 400;
const FACTUAL_SIGNALS_MIN = 4;
const FACTUAL_SIGNALS_FOR_SHORT_RELEASES = 6;

const PAYWALL_PATTERNS: RegExp[] = [
  /subscribe to continue/i,
  /sign in to continue/i,
  /unlock this article/i,
  /continue reading with (a )?subscription/i,
  /this content is for subscribers/i,
  /become a subscriber/i,
  /register to continue/i,
  /subscribers? only/i,
];

const BOILERPLATE_PATTERNS: RegExp[] = [
  /accept (all )?cookies/i,
  /manage cookie preferences/i,
  /sign up for our newsletter/i,
  /follow us on (facebook|twitter|x|instagram)/i,
  /share this (article|story)/i,
  /related stories?/i,
];

const NEWS_EVENT_PATTERNS: RegExp[] = [
  /\b(signs?|signed|vetoe(s|d)?|announces?|announced|declares?|declared|files?|filed|rules?|ruled|indict(s|ed|ment)?|arrest(s|ed|ing)?|charge(s|d)?|passe(s|d)|approve(s|d)|reject(s|ed)|vote(s|d)?|elects?|elected|appoint(s|ed)|resigns?|resigned|launch(es|ed)?|opens?|opened|closes?|closed|kill(s|ed)|injure(s|d))\b/i,
  /\b(bill|law|ruling|order|lawsuit|indictment|arrest|election|primary|runoff|hearing|verdict|storm|hurricane|tornado|flood|wildfire|shooting|crash|outbreak)\b/i,
];

function normalize(text: string | null | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function wordCount(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

function countMatches(text: string, patterns: RegExp[]): number {
  let n = 0;
  for (const p of patterns) if (p.test(text)) n += 1;
  return n;
}

// Deterministic signals that suggest the extraction actually contains
// reportable facts. We look at common newsroom cues; direct quotations are
// helpful but not required.
function factualSignalCount(text: string): number {
  let n = 0;
  // Proper-noun runs (people, orgs, places) — 2+ capitalized words in a row.
  const properNounRuns = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/g);
  if (properNounRuns) n += Math.min(properNounRuns.length, 6);
  // Dates.
  if (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}\b/.test(text)) n += 1;
  if (/\b(19|20)\d{2}\b/.test(text)) n += 1;
  // Numbers — dollar amounts, percentages, counts.
  if (/\$\s?\d[\d,]*(?:\.\d+)?/.test(text)) n += 1;
  if (/\b\d+(\.\d+)?\s?%/.test(text)) n += 1;
  if (/\b\d[\d,]{2,}\b/.test(text)) n += 1;
  // Official titles / actions.
  if (/\b(Gov(ernor)?|Sen(ator)?|Rep(resentative)?|Attorney General|Judge|Sheriff|Mayor|Commissioner|Chairman|President|Chief|Director|Secretary)\b/.test(text)) n += 1;
  if (/\b(vote|voted|voting|filed|filing|arrest|arrested|indicted|charged|signed|passed|ruled|ordered|announced|declared)\b/i.test(text)) n += 1;
  // Attributed statement (loose).
  if (/\b(said|says|according to|told|announced)\b/i.test(text)) n += 1;
  return n;
}

function detectPaywall(text: string): boolean {
  return countMatches(text, PAYWALL_PATTERNS) > 0;
}

function detectBoilerplateHeavy(text: string): boolean {
  const hits = countMatches(text, BOILERPLATE_PATTERNS);
  const words = wordCount(text);
  // Only flag when the extraction is small AND dominated by boilerplate cues.
  return hits >= 2 && words < 250;
}

function detectNewsEvent(title: string, body: string): boolean | null {
  const t = `${title} ${body}`;
  const hits = countMatches(t, NEWS_EVENT_PATTERNS);
  if (hits >= 2) return true;
  if (hits === 1) return true;
  // Insufficient signal — treat as unknown, not a hard block.
  return null;
}

function reasonMessage(reason: RewritePreflightReason, words: number): string {
  switch (reason) {
    case "READY":
      return `Rewrite ready · ${words} source words`;
    case "PENDING_EXTRACTION":
      return "Checking source · extraction has not been attempted yet";
    case "MISSING_SOURCE_URL":
      return "Not rewriteable · this item has no source URL";
    case "SOURCE_FETCH_FAILED":
      return "Not rewriteable · source page could not be fetched";
    case "PAYWALL_OR_TRUNCATED":
      return "Not rewriteable · paywall or subscription wall prevented extraction";
    case "BODY_TOO_SHORT":
      return `Not rewriteable · only ${words} usable source words were extracted`;
    case "BOILERPLATE_CONTENT":
      return "Not rewriteable · extracted page contained mostly navigation or boilerplate";
    case "INSUFFICIENT_FACTS":
      return "Not rewriteable · source lacks concrete names, dates, or actions";
    case "NOT_ENGLISH":
      return "Not rewriteable · source does not appear to be English";
    case "UNSUPPORTED_CONTENT_TYPE":
      return "Not rewriteable · unsupported source content type";
    case "NO_CLEAR_NEWS_EVENT":
      return "Not rewriteable · no clear news event detected in the source";
  }
}

export function assessRewritePreflight(input: RewritePreflightInput): RewritePreflightResult {
  const title = normalize(input.title);
  const body = normalize(input.description);
  const words = wordCount(body);
  const factual = factualSignalCount(`${title} ${body}`);
  const eventState = detectNewsEvent(title, body);

  const finalize = (reason: RewritePreflightReason): RewritePreflightResult => ({
    rewriteable: reason === "READY",
    reason,
    message: reasonMessage(reason, words),
    sourceWordCount: words,
    factualSignalCount: factual,
    hasClearNewsEvent: eventState,
  });

  if (!input.link || !/^https?:\/\//i.test(input.link)) {
    return finalize("MISSING_SOURCE_URL");
  }
  if (!body) {
    // Description is our stored extraction. If it's empty we haven't attempted
    // enrichment yet (Reddit selftext / linked-article fetch happens on demand
    // in publishSingleFeedItem), so mark it pending, not blocked.
    return finalize("PENDING_EXTRACTION");
  }
  if (detectPaywall(body) && words < STANDARD_MIN_WORDS) {
    return finalize("PAYWALL_OR_TRUNCATED");
  }
  if (detectBoilerplateHeavy(body)) {
    return finalize("BOILERPLATE_CONTENT");
  }

  const min = input.isBreaking ? BREAKING_MIN_WORDS : STANDARD_MIN_WORDS;
  if (words < min) {
    // Allow short but fact-dense sources (government releases, arrests,
    // election results, court orders, weather alerts).
    if (factual >= FACTUAL_SIGNALS_FOR_SHORT_RELEASES) {
      return finalize("READY");
    }
    return finalize("BODY_TOO_SHORT");
  }

  if (factual < FACTUAL_SIGNALS_MIN) {
    return finalize("INSUFFICIENT_FACTS");
  }

  return finalize("READY");
}

export function preflightStatusLabel(result: RewritePreflightResult): string {
  if (result.rewriteable) return `Rewrite ready · ${result.sourceWordCount} source words`;
  if (result.reason === "PENDING_EXTRACTION") return "Checking source";
  return result.message;
}

// Explicit guard used by the paid rewrite path. Throws if a caller ever tries
// to spend AI credits on a source that failed preflight. Exists so we can
// assert in tests that a blocked preflight can never reach the rewrite mock.
export class PreflightBlockedError extends Error {
  readonly reason: RewritePreflightReason;
  readonly result: RewritePreflightResult;
  constructor(result: RewritePreflightResult) {
    super(result.message);
    this.name = "PreflightBlockedError";
    this.reason = result.reason;
    this.result = result;
  }
}

export function assertRewriteableOrThrow(result: RewritePreflightResult): void {
  if (!result.rewriteable) throw new PreflightBlockedError(result);
}

// Snapshot persisted on texas_news_feed.preflight_json so page loads and
// dashboards can render the block reason without recomputing extraction.
export type PreflightPersistedSnapshot = {
  status: RewritePreflightReason;
  reason: RewritePreflightReason;
  message: string;
  sourceWordCount: number;
  factualSignalCount: number;
  checkedAt: string;
  failureStage: "extraction" | "preflight" | "none";
};

export function toPersistedSnapshot(
  result: RewritePreflightResult,
  failureStage: PreflightPersistedSnapshot["failureStage"],
): PreflightPersistedSnapshot {
  return {
    status: result.reason,
    reason: result.reason,
    message: result.message,
    sourceWordCount: result.sourceWordCount,
    factualSignalCount: result.factualSignalCount,
    checkedAt: new Date().toISOString(),
    failureStage,
  };
}