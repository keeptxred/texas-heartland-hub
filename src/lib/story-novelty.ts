import type { ClusterableFeedItem } from "@/lib/story-clustering";

export type StoryNovelty = {
  score: number;
  material: boolean;
  newNumbers: string[];
  newActions: string[];
  novelTerms: string[];
};

const STOP = new Set([
  "the","and","for","that","with","from","this","have","has","had","was","were","are","but","not","into","about","after","before","over","under","more","than","texas","said","says","will","would","could","should","their","they","them","its","new","story","source","reported",
]);

const ACTION_PATTERNS: Array<[string, RegExp]> = [
  ["approved", /\bapprov(?:e|ed|es|al)\b/i],
  ["signed", /\bsign(?:ed|s|ing)\b/i],
  ["halted", /\b(?:halt|pause|paused|suspend|suspended|stop|stopped)\b/i],
  ["resumed", /\b(?:resume|resumed|restart|restarted)\b/i],
  ["filed", /\b(?:filed|files|filing)\b/i],
  ["ruled", /\b(?:ruled|ruling|injunction|order issued)\b/i],
  ["announced", /\bannounc(?:e|ed|es|ement)\b/i],
  ["declared", /\bdeclar(?:e|ed|es|ation)\b/i],
  ["opened", /\bopen(?:ed|s|ing)\b/i],
  ["closed", /\bclos(?:e|ed|es|ing|ure)\b/i],
  ["expanded", /\bexpand(?:ed|s|ing|ansion)\b/i],
  ["reduced", /\b(?:reduce|reduced|reduces|cut|cuts|lowered|lowers)\b/i],
  ["increased", /\b(?:increase|increased|increases|raised|raises)\b/i],
  ["settled", /\bsettle(?:d|s|ment)\b/i],
  ["resigned", /\bresign(?:ed|s|ation)\b/i],
  ["arrested", /\barrest(?:ed|s)\b/i],
  ["charged", /\bcharg(?:ed|es|ing)\b/i],
  ["launched", /\blaunch(?:ed|es|ing)\b/i],
  ["canceled", /\bcancel(?:ed|led|s|ing|ling)\b/i],
  ["delayed", /\bdelay(?:ed|s|ing)\b/i],
];

function normalized(text: string): string {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9%$.' -]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function terms(text: string): Set<string> {
  const out = new Set<string>();
  for (const token of normalized(text).split(/\s+/)) {
    const clean = token.replace(/^['.-]+|['.-]+$/g, "");
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

function actions(text: string): Set<string> {
  const out = new Set<string>();
  for (const [label, pattern] of ACTION_PATTERNS) {
    if (pattern.test(text)) out.add(label);
  }
  return out;
}

export function assessStoryNovelty(
  incoming: Pick<ClusterableFeedItem, "title" | "description" | "extracted_body">,
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

  const incomingTerms = terms(incomingText);
  const existingTerms = terms(existingText);
  const novelTerms = [...incomingTerms].filter((value) => !existingTerms.has(value)).slice(0, 12);
  const noveltyRatio = incomingTerms.size ? novelTerms.length / Math.min(12, incomingTerms.size) : 0;

  const score = Math.min(
    100,
    Math.min(36, newNumbers.length * 18) +
      Math.min(36, newActions.length * 18) +
      Math.round(Math.min(1, noveltyRatio) * 28),
  );
  const material =
    score >= 48 ||
    newActions.length >= 2 ||
    (newActions.length >= 1 && newNumbers.length >= 1 && score >= 40);

  return { score, material, newNumbers, newActions, novelTerms };
}
