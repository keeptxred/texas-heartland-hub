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

function sourceEvidenceSegments(source: ResearchPacketSource): string[] {
  const combined = `${source.description ?? ""}\n${source.extractedBody ?? ""}`;
  return combined
    .split(/\n+|(?<=[.!?])\s+/)
    .map(normalizeEvidenceSegment)
    .filter((segment) => segment.length >= 40 && !PACKET_BOILERPLATE.test(segment));
}

export function compactResearchPacket(packet: ResearchPacket): ResearchPacket {
  const seen = new Set<string>();
  const sources = packet.sources.map((source) => {
    const unique: string[] = [];
    for (const segment of sourceEvidenceSegments(source)) {
      const key = segment.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(segment);
    }
    return {
      ...source,
      description: "",
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
      description: source.description.slice(0, 3000),
      extractedBody: source.extractedBody.slice(0, 8000),
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
