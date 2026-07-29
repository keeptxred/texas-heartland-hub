import { ABSOLUTE_MIN_SOURCE_WORDS, countUsableSourceWords, normalizeUsableSourceText } from "@/lib/rewrite-preflight";

export type RewriteSourceKind =
  | "cached-extraction"
  | "reddit-selftext"
  | "linked-article"
  | "stored-description"
  | "none";

export type RewriteSourceInput = {
  cachedExtraction?: string | null;
  storedDescription?: string | null;
  redditSelftext?: string | null;
  linkedArticleText?: string | null;
  linkedArticleUrl?: string | null;
};

export type ResolvedRewriteSource = {
  text: string;
  wordCount: number;
  primaryKind: RewriteSourceKind;
  includedKinds: RewriteSourceKind[];
  meetsAbsoluteMinimum: boolean;
};

type Candidate = {
  kind: Exclude<RewriteSourceKind, "none">;
  text: string;
};

/**
 * Resolves the exact source text that should be displayed, preflighted and
 * sent to the rewrite pipeline. Keeping this decision in one helper prevents
 * the admin UI and server publish path from counting different text.
 */
export function resolveRewriteSource(input: RewriteSourceInput): ResolvedRewriteSource {
  const cached = normalizeUsableSourceText(input.cachedExtraction);
  if (cached) {
    const wordCount = countUsableSourceWords(cached);
    return {
      text: cached,
      wordCount,
      primaryKind: "cached-extraction",
      includedKinds: ["cached-extraction"],
      meetsAbsoluteMinimum: wordCount >= ABSOLUTE_MIN_SOURCE_WORDS,
    };
  }

  const candidates: Candidate[] = [
    {
      kind: "stored-description",
      text: normalizeUsableSourceText(input.storedDescription),
    },
    {
      kind: "reddit-selftext",
      text: normalizeUsableSourceText(input.redditSelftext),
    },
    {
      kind: "linked-article",
      text: normalizeUsableSourceText(input.linkedArticleText),
    },
  ];
  const usableCandidates = candidates.filter((candidate) => candidate.text.length > 0);

  if (usableCandidates.length === 0) {
    return {
      text: "",
      wordCount: 0,
      primaryKind: "none",
      includedKinds: [],
      meetsAbsoluteMinimum: false,
    };
  }

  const seen = new Set<string>();
  const unique = usableCandidates.filter((candidate) => {
    const key = candidate.text.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const parts = unique.map((candidate) => {
    if (candidate.kind === "reddit-selftext") {
      return `REDDIT SELFTEXT:\n${candidate.text}`;
    }
    if (candidate.kind === "linked-article") {
      const suffix = input.linkedArticleUrl ? ` (${input.linkedArticleUrl})` : "";
      return `LINKED SOURCE${suffix}:\n${candidate.text}`;
    }
    return candidate.text;
  });

  const text = normalizeUsableSourceText(parts.join("\n\n"));
  const wordCount = countUsableSourceWords(text);
  const primary = [...unique].sort(
    (a, b) => countUsableSourceWords(b.text) - countUsableSourceWords(a.text),
  )[0];

  return {
    text,
    wordCount,
    primaryKind: primary?.kind ?? "none",
    includedKinds: unique.map((candidate) => candidate.kind),
    meetsAbsoluteMinimum: wordCount >= ABSOLUTE_MIN_SOURCE_WORDS,
  };
}
