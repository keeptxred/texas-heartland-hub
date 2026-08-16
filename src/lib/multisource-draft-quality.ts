export type MultiSourceDraftShape = {
  title?: string;
  dek?: string;
  summary?: string;
  relevance?: string;
  analysis?: string;
  sections?: { heading?: string; paragraphs?: string[] }[];
};

const STOP = new Set([
  "that", "this", "with", "from", "have", "has", "had", "were", "was", "will", "would", "could", "should", "into",
  "about", "after", "before", "their", "there", "they", "them", "then", "than", "when", "where", "which", "while", "texas",
  "said", "says", "also", "over", "under", "more", "most", "some", "such", "only", "each", "other", "been", "being", "through",
  "during", "source", "sources", "story", "report", "reported",
]);
const ATTRIBUTION_RE = /\b(according to|said|says|reported|reports|stated|states|announced|wrote|writes|argued|claims?|alleged|estimated|projected|predicted|officials?|agency|court|department|office|campaign|spokesperson)\b/i;

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9%$]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(text: string): Set<string> {
  return new Set(normalize(text).split(" ").filter((token) => token.length >= 4 && !STOP.has(token)));
}

function overlap(a: string, b: string): number {
  const left = tokens(a);
  const right = tokens(b);
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  return shared / Math.min(left.size, right.size);
}

function draftProse(article: MultiSourceDraftShape): string {
  return [
    article.summary ?? "",
    article.relevance ?? "",
    article.analysis ?? "",
    ...(article.sections ?? []).flatMap((section) => section.paragraphs ?? []),
  ].filter(Boolean).join(" ");
}

function proseSentences(prose: string): string[] {
  return prose
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function extractLine(packet: string, prefix: string): string | null {
  const line = packet.split(/\r?\n/).find((row) => row.trim().startsWith(prefix));
  return line ? line.trim().slice(prefix.length).trim() : null;
}

function extractLedgerLines(packet: string): Array<{ text: string; conflict: boolean; supported: boolean }> {
  const start = packet.indexOf("STRUCTURED FACT LEDGER");
  const end = packet.indexOf("RAW SOURCE PACKET");
  if (start < 0 || end <= start) return [];
  return packet
    .slice(start + "STRUCTURED FACT LEDGER".length, end)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => {
      const bracket = line.lastIndexOf(" [");
      const text = (bracket > 2 ? line.slice(2, bracket) : line.slice(2)).trim();
      const meta = bracket > 2 ? line.slice(bracket + 2) : "";
      const sourceCount = Number(meta.match(/sources=(\d+)/i)?.[1] ?? "0");
      return {
        text,
        conflict: /CONFLICT=/i.test(meta),
        supported: sourceCount >= 2 || /primary-record=yes/i.test(meta),
      };
    })
    .filter((row) => row.text.length >= 20);
}

type AttributedClaim = { label: string | null; text: string };

function attributedClaims(packet: string): AttributedClaim[] {
  const value = extractLine(packet, "ATTRIBUTED CLAIMS ONLY — do not state these as settled facts:");
  if (!value) return [];
  return value
    .split(" | ")
    .map((raw) => {
      const claim = raw.trim();
      const match = claim.match(/^\[([^\]]+)\]\s*(.+)$/);
      return {
        label: match?.[1]?.trim() || null,
        text: (match?.[2] ?? claim).trim(),
      };
    })
    .filter((claim) => claim.text.length >= 20);
}

function numberTokens(text: string): string[] {
  return normalize(text).match(/\$?\d[\d,.]*%?/g) ?? [];
}

function factRepresented(fact: string, prose: string): boolean {
  const requiredNumbers = numberTokens(fact);
  return proseSentences(prose).some((sentence) => {
    const normalizedSentence = normalize(sentence);
    if (requiredNumbers.length && !requiredNumbers.every((value) => normalizedSentence.includes(normalize(value)))) {
      return false;
    }
    const normalizedFact = normalize(fact);
    if (normalizedFact.length >= 28 && normalizedSentence.includes(normalizedFact)) return true;
    return overlap(fact, sentence) >= 0.5;
  });
}

function sentenceContaining(prose: string, claim: string): string | null {
  const normalizedClaim = normalize(claim);
  const candidates = proseSentences(prose);
  const exact = candidates.find((sentence) => {
    const normalizedSentence = normalize(sentence);
    return normalizedClaim.length >= 20 && normalizedSentence.includes(normalizedClaim);
  });
  if (exact) return exact;
  return candidates.find((sentence) => overlap(claim, sentence) >= 0.5) ?? null;
}

function claimHasAttribution(sentence: string, claim: AttributedClaim): boolean {
  if (ATTRIBUTION_RE.test(sentence)) return true;
  if (!claim.label) return false;
  const labelTokens = [...tokens(claim.label)];
  if (!labelTokens.length) return false;
  const sentenceTokens = tokens(sentence);
  return labelTokens.some((token) => sentenceTokens.has(token));
}

function nearVerbatimSourceCopy(article: MultiSourceDraftShape, packet: string): boolean {
  const rawStart = packet.indexOf("RAW SOURCE PACKET");
  if (rawStart < 0) return false;
  const raw = normalize(packet.slice(rawStart));
  const paragraphs = [article.summary ?? "", ...(article.sections ?? []).flatMap((section) => section.paragraphs ?? [])];
  return paragraphs.some((paragraph) => {
    const clean = paragraph.trim();
    if (/^[“"].*[”"]$/.test(clean)) return false;
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length < 18) return false;
    const windows: string[] = [];
    for (let i = 0; i <= words.length - 18; i += 12) windows.push(normalize(words.slice(i, i + 18).join(" ")));
    return windows.some((window) => window.length >= 80 && raw.includes(window));
  });
}

/**
 * Final deterministic quality gate for AI drafts generated from the Phase 3–9
 * multi-source packet. It runs inside the existing editorial validator, after
 * generation but before buildArticleRow/upsert, and therefore adds zero AI
 * calls of its own.
 */
export function validateMultiSourceDraftAgainstPacket(
  article: MultiSourceDraftShape,
  sourceText?: string,
): string[] {
  if (!sourceText?.includes("MULTI-SOURCE STORY PACKET.")) return [];

  const reasons: string[] = [];
  const prose = draftProse(article);
  const headline = `${article.title ?? ""} ${article.dek ?? ""} ${article.summary ?? ""}`;
  const independentLine = extractLine(sourceText, "Independent sources:");
  const independentSources = (independentLine ?? "")
    .replace(/\.$/, "")
    .split("|")
    .map((source) => source.trim())
    .filter(Boolean);
  if (new Set(independentSources.map((source) => source.toLowerCase())).size < 2) {
    reasons.push("multisource_provenance_incomplete");
  }

  const leadFact = extractLine(sourceText, "VERIFIED LEAD FACT:");
  if (leadFact && overlap(leadFact, `${headline} ${prose.slice(0, 1200)}`) < 0.25) {
    reasons.push("multisource_angle_drift");
  }

  const ledger = extractLedgerLines(sourceText);
  const strongFacts = ledger.filter((fact) => fact.supported && !fact.conflict).slice(0, 6);
  const represented = strongFacts.filter((fact) => factRepresented(fact.text, prose));
  const required = strongFacts.length <= 2 ? strongFacts.length : Math.max(2, Math.ceil(strongFacts.length * 0.5));
  if (!strongFacts.length || represented.length < required) {
    reasons.push(`multisource_verified_fact_coverage:${represented.length}/${strongFacts.length}`);
  }

  if (ledger.some((fact) => fact.conflict && overlap(fact.text, headline) >= 0.4)) {
    reasons.push("multisource_unresolved_conflict_in_headline");
  }

  const unattributed = attributedClaims(sourceText).filter((claim) => {
    const sentence = sentenceContaining(prose, claim.text);
    return sentence ? !claimHasAttribution(sentence, claim) : false;
  });
  if (unattributed.length) reasons.push(`multisource_unattributed_claim:${unattributed.length}`);

  if (nearVerbatimSourceCopy(article, sourceText)) reasons.push("multisource_near_verbatim_source_copy");

  return reasons;
}
