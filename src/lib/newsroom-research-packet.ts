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
