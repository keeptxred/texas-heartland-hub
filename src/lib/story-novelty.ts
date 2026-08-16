import type { ClusterableFeedItem } from "@/lib/story-clustering";

export type StoryNovelty = {
  score: number;
  material: boolean;
  newNumbers: string[];
  newActions: string[];
  newDates: string[];
  hasNewPrimaryDocument: boolean;
  novelTerms: string[];
};

type StoryNoveltyInput = Pick<ClusterableFeedItem, "title" | "description" | "extracted_body">
  & Partial<Pick<ClusterableFeedItem, "source" | "link">>;

const STOP = new Set([
  "the","and","for","that","with","from","this","have","has","had","was","were","are","but","not","into","about","after","before","over","under","more","than","texas","said","says","will","would","could","should","their","they","them","its","new","story","source","reported",
]);

const ACTION_PATTERNS: Array<[string, RegExp]> = [
  ["approved", /\bapprov(?:e|ed|es|al)\b/gi],
  ["signed", /\bsign(?:ed|s|ing)\b/gi],
  ["halted", /\b(?:halt|pause|paused|suspend|suspended|stop|stopped)\b/gi],
  ["resumed", /\b(?:resume|resumed|restart|restarted)\b/gi],
  ["filed", /\b(?:filed|files|filing)\b/gi],
  ["ruled", /\b(?:ruled|ruling|injunction|order issued)\b/gi],
  ["announced", /\bannounc(?:e|ed|es|ement)\b/gi],
  ["declared", /\bdeclar(?:e|ed|es|ation)\b/gi],
  ["opened", /\bopen(?:ed|s|ing)\b/gi],
  ["closed", /\bclos(?:e|ed|es|ing|ure)\b/gi],
  ["expanded", /\bexpand(?:ed|s|ing|ansion)\b/gi],
  ["reduced", /\b(?:reduce|reduced|reduces|cut|cuts|lowered|lowers)\b/gi],
  ["increased", /\b(?:increase|increased|increases|raised|raises)\b/gi],
  ["settled", /\bsettle(?:d|s|ment)\b/gi],
  ["resigned", /\bresign(?:ed|s|ation)\b/gi],
  ["arrested", /\barrest(?:ed|s)\b/gi],
  ["charged", /\bcharg(?:ed|es|ing)\b/gi],
  ["launched", /\blaunch(?:ed|es|ing)\b/gi],
  ["canceled", /\bcancel(?:ed|led|s|ing|ling)\b/gi],
  ["delayed", /\bdelay(?:ed|s|ing)\b/gi],
];

const NEGATED_ACTION_RE = /\b(?:no|not|never|without)\b[^.!?;]{0,32}$/i;
const DATE_RE = /\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december)\s+(?:\d{1,2}(?:,\s*20\d{2})?|20\d{2})\b|\b20\d{2}-\d{2}-\d{2}\b/gi;
const PRIMARY_SOURCE_RE = /\b(office of the governor|texas secretary of state|texas attorney general|texas supreme court|texas court of criminal appeals|texas legislature|texas education agency|texas comptroller|texas ethics commission|texas workforce commission|texas department of public safety|texas department of transportation|texas parks\s*&\s*wildlife|ercot|police department|sheriff'?s office|county of |city of |school district)\b/i;

function normalized(text: string): string {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9%$,.' -]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function terms(text: string): Set<string> {
  const out = new Set<string>();
  for (const token of normalized(text).split(/\s+/)) {
    const clean = token.replace(/^['.,-]+|['.,-]+$/g, "");
    if (clean.length < 5 || STOP.has(clean) || /^\d/.test(clean)) continue;
    out.add(clean);
  }
  return out;
}

function numbers(text: string): Set<string> {
  const out = new Set<string>();
  const normalizedText = normalized(text);
  const matches = normalizedText.match(/(?:\$\s*)?\b\d[\d,]*(?:\.\d+)?(?:\s*(?:%|percent|million|billion|thousand|mw|gw|acres?|miles?|days?|hours?|years?))?/gi) ?? [];
  for (const match of matches) {
    const value = match.replace(/\s+/g, " ").trim();
    if (value.length > 1 && !/^20\d{2}$/.test(value)) out.add(value);
  }
  return out;
}

function dates(text: string): Set<string> {
  const out = new Set<string>();
  for (const match of text.match(DATE_RE) ?? []) out.add(match.toLowerCase().replace(/\s+/g, " ").trim());
  return out;
}

function actions(text: string): Set<string> {
  const out = new Set<string>();
  for (const [label, pattern] of ACTION_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const index = match.index ?? 0;
      const before = text.slice(Math.max(0, index - 40), index);
      if (NEGATED_ACTION_RE.test(before)) continue;
      out.add(label);
      break;
    }
  }
  return out;
}

function looksLikePrimaryDocument(incoming: StoryNoveltyInput): boolean {
  const source = `${incoming.source ?? ""} ${incoming.link ?? ""}`;
  return /\.gov(?:\/|$)/i.test(source) || PRIMARY_SOURCE_RE.test(source);
}

export function assessStoryNovelty(
  incoming: StoryNoveltyInput,
  existingArticleText: string,
): StoryNovelty {
  const incomingText = `${incoming.title} ${incoming.description ?? ""} ${incoming.extracted_body ?? ""}`;
  const existingText = existingArticleText ?? "";

  const incomingNumbers = numbers(incomingText);
  const existingNumbers = numbers(existingText);
  const newNumbers = [...incomingNumbers].filter((value) => !existingNumbers.has(value)).slice(0, 6);

  const incomingActions = actions(incomingText);
  const existingActions = actions(existingText);
  const newActions = [...incomingActions].filter((value) => !existingActions.has(value)).slice(0, 6);

  const incomingDates = dates(incomingText);
  const existingDates = dates(existingText);
  const newDates = [...incomingDates].filter((value) => !existingDates.has(value)).slice(0, 6);

  const incomingTerms = terms(incomingText);
  const existingTerms = terms(existingText);
  const novelTerms = [...incomingTerms].filter((value) => !existingTerms.has(value)).slice(0, 12);
  const noveltyRatio = incomingTerms.size ? novelTerms.length / Math.min(12, incomingTerms.size) : 0;
  const hasNewPrimaryDocument = looksLikePrimaryDocument(incoming)
    && (newActions.length > 0 || newNumbers.length > 0 || newDates.length > 0);

  const score = Math.min(
    100,
    Math.min(36, newNumbers.length * 18) +
      Math.min(36, newActions.length * 18) +
      Math.min(12, newDates.length * 6) +
      (hasNewPrimaryDocument ? 12 : 0) +
      Math.round(Math.min(1, noveltyRatio) * 28),
  );
  const material =
    score >= 48 ||
    newActions.length >= 2 ||
    (newActions.length >= 1 && newNumbers.length >= 1 && score >= 40) ||
    (hasNewPrimaryDocument && score >= 36);

  return { score, material, newNumbers, newActions, newDates, hasNewPrimaryDocument, novelTerms };
}
