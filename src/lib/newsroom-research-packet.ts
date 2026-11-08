import { isSyntheticNewsroomEvidence } from "./newsroom-evidence-integrity";
import { newsroomLikelySameOriginalReport } from "./newsroom-publication-preflight";
import { trimTdemPressReleaseArchive } from "./tdem-press-release-body";

export type ResearchPacketSource = {
  feedItemId: number;
  title: string;
  source: string;
  url: string;
  publishedAt: string | null;
  description: string;
  extractedBody: string;
  isPrimarySource: boolean;
  sourceReputationScore: number | null;
};

export type ResearchPacket = {
  packetVersion: 1;
  clusterId: string;
  subject: string;
  pillar: string | null;
  recommendedFormat: string;
  editorialScore: number;
  rules: {
    useOnlyProvidedSources: true;
    doNotInventFacts: true;
    doNotInventQuotes: true;
    preserveAttribution: true;
    preferPrimarySources: true;
  };
  sources: ResearchPacketSource[];
};

const PACKET_BOILERPLATE = /^(?:multi-source story packet\.?|use only facts supported by the sources below\.?|reconcile duplicate facts\.?|attribute claims when sources differ\.?|do not copy source wording\.?|independent sources:|treat this as one developing texas story|source \d+:|headline:|url:|date:|source material:|---)/i;

function normalizeEvidenceSegment(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&#8217;|&rsquo;/gi, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// A live source record contained a full Cybertruck article in the description
// of an unrelated White House arrest report. Reject only obvious long,
 // cross-story metadata when the extracted article itself supports the headline.
 // Never use this to suppress a source or bypass a publisher-diversity gate.
const OFF_TOPIC_DESCRIPTION_STOP_WORDS = new Set([
  "about", "after", "before", "could", "first", "from", "have", "into",
  "more", "near", "news", "over", "reported", "says", "said", "some",
  "state", "texas", "that", "their", "them", "there", "these", "this",
  "those", "today", "under", "were", "what", "when", "where", "which",
  "while", "with", "would", "years", "official", "officials",
]);

function topicalTerms(text: string): Set<string> {
  return new Set(
    normalizeEvidenceSegment(text).toLowerCase()
      .match(/[a-z0-9]{4,}/g)?.filter((word) => !OFF_TOPIC_DESCRIPTION_STOP_WORDS.has(word)) ?? [],
  );
}

function isDemonstrablyUnrelatedLongDescription(source: ResearchPacketSource): boolean {
  // Short RSS summaries may legitimately use different phrasing from a title.
  // A substantial independently extracted article is required as positive
  // evidence before removing any mismatched, long metadata description.
  if (source.description.length < 500 || source.extractedBody.length < 900) return false;
  const headlineTerms = topicalTerms(source.title);
  if (headlineTerms.size < 5) return false;
  const articleTerms = topicalTerms(source.extractedBody);
  const descriptionTerms = topicalTerms(source.description);
  let articleMatches = 0;
  let descriptionMatches = 0;
  for (const term of headlineTerms) {
    if (articleTerms.has(term)) articleMatches++;
    if (descriptionTerms.has(term)) descriptionMatches++;
  }
  return articleMatches >= 4 && descriptionMatches === 0;
}

function sourceEvidenceSegments(source: ResearchPacketSource): string[] {
  const safeExtractedBody = trimTdemPressReleaseArchive(
    source.url,
    isSyntheticNewsroomEvidence(source.extractedBody) ? "" : source.extractedBody,
  );
  const safeDescription = isSyntheticNewsroomEvidence(source.description) || isDemonstrablyUnrelatedLongDescription(source) ? "" : source.description;
  const combined = `${safeDescription ?? ""}\n${safeExtractedBody ?? ""}`;
  return combined
    .split(/\n+|(?<=[.!?])\s+/)
    .map(normalizeEvidenceSegment)
    .filter((segment) => segment.length >= 40 && !PACKET_BOILERPLATE.test(segment));
}

function evidenceKey(segment: string): string {
  // Canonicalize typography (including curly quotes) before deduplicating
  // publisher evidence; punctuation differences are not new reported facts.
  return segment.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function longWordShingles(body: string): Set<string> {
  const words = evidenceKey(body).split(/\s+/).filter(Boolean);
  const result = new Set<string>();
  if (words.length < 100) return result;
  for (let i = 0; i <= words.length - 8; i++) {
    result.add(words.slice(i, i + 8).join(" "));
  }
  return result;
}

/**
 * Cross-host republications of the same government press release may differ
 * only in quotes, HTML navigation or publisher chrome. Never count a second
 * copy as fresh evidence merely because it has another .gov hostname.
 *
 * Keep different original reports, substantially expanded articles and every
 * source URL. Suppress only a long, near-verbatim report with the same
 * distinctive headline and comparable body length.
 */
function isNearCopyOriginalReport(
  title: string,
  body: string,
  earlier: { title: string; body: string; shingles: Set<string> },
): boolean {
  if (!newsroomLikelySameOriginalReport(title, earlier.title)) return false;
  const shingles = longWordShingles(body);
  if (shingles.size < 60 || earlier.shingles.size < 60) return false;
  const smaller = Math.min(shingles.size, earlier.shingles.size);
  const bigger = Math.max(shingles.size, earlier.shingles.size);
  if (smaller / bigger < 0.65) return false;
  let common = 0;
  for (const value of shingles) if (earlier.shingles.has(value)) common++;
  return common / smaller >= 0.85;
}

export function compactResearchPacket(packet: ResearchPacket): ResearchPacket {
  const seen = new Set<string>();
  const originals: Array<{ title: string; body: string; shingles: Set<string> }> = [];
  const sources = packet.sources.map((source) => {
    const segments = sourceEvidenceSegments(source);
    const body = segments.join(" ");
    const republished = originals.some((earlier) => isNearCopyOriginalReport(source.title, body, earlier));
    if (!republished && body) originals.push({
      title: source.title,
      body,
      shingles: longWordShingles(body),
    });
    const unique: string[] = [];
    if (!republished) for (const segment of segments) {
      const key = evidenceKey(segment);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(segment);
    }
    return {
      ...source,
      description: "",
      // Retain the reprinted publisher's attribution/link, but do not
      // spend word budget or count the same release a second time.
      extractedBody: unique.join("\n"),
    };
  });
  return { ...packet, sources };
}

export function researchPacketEvidenceChars(packet: ResearchPacket): number {
  const compact = compactResearchPacket(packet);
  return compact.sources.reduce((total, source) => total + source.extractedBody.length, 0);
}

export function buildResearchPacket(input: {
  clusterId: string;
  subject: string;
  pillar: string | null;
  recommendedFormat: string;
  editorialScore: number;
  sources: ResearchPacketSource[];
}): ResearchPacket {
  const sources = [...input.sources]
    .sort((a, b) => Number(b.isPrimarySource) - Number(a.isPrimarySource)
      || (b.sourceReputationScore ?? 0) - (a.sourceReputationScore ?? 0)
      || a.feedItemId - b.feedItemId)
    .map((source) => ({
      ...source,
      title: source.title.slice(0, 500),
      description: (isSyntheticNewsroomEvidence(source.description) || isDemonstrablyUnrelatedLongDescription(source) ? "" : source.description).slice(0, 3000),
      extractedBody: (isSyntheticNewsroomEvidence(source.extractedBody) ? "" : source.extractedBody).slice(0, 8000),
    }));

  return {
    packetVersion: 1,
    clusterId: input.clusterId,
    subject: input.subject,
    pillar: input.pillar,
    recommendedFormat: input.recommendedFormat,
    editorialScore: input.editorialScore,
    rules: {
      useOnlyProvidedSources: true,
      doNotInventFacts: true,
      doNotInventQuotes: true,
      preserveAttribution: true,
      preferPrimarySources: true,
    },
    sources,
  };
}
