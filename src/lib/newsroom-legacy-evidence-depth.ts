import type { StoryCluster } from "./story-clustering";
import {
  buildResearchPacket,
  researchPacketEvidenceChars,
  type ResearchPacketSource,
} from "./newsroom-research-packet";
import { newsroomIndependentPublisherFamilyFromUrl } from "./newsroom-publication-preflight";

// Match the existing standard newsroom evidence floor BEFORE the older
// multi-source writer can spend paid AI on a synthetic "MULTI-SOURCE PACKET".
// Longer article classes still face their stricter unchanged editorial floors.
// This is an admission guard, never a substitute for publication validation.
export const LEGACY_NEWSROOM_MIN_ORIGINAL_EVIDENCE_CHARS = 5_000;

export function assessLegacyNewsroomEvidenceDepth(cluster: StoryCluster): {
  eligible: boolean;
  evidenceChars: number;
  requiredChars: number;
  sourceUrls: number;
} {
  const originalSources: ResearchPacketSource[] = [cluster.primary, ...cluster.members]
    .filter((source) => newsroomIndependentPublisherFamilyFromUrl(source.link) !== null)
    .map((source, index) => ({
      feedItemId: source.id ?? index,
      title: source.title,
      source: source.source,
      url: source.link,
      publishedAt: source.pub_date ?? null,
      description: source.description ?? "",
      // A cached raw publisher article is eligible evidence. The separate
      // AI-generated synthesis scaffold never enters this function.
      extractedBody: source.extracted_body ?? "",
      isPrimarySource: source.viral_signals?.primary_source === true,
      sourceReputationScore: null,
    }));

  const packet = buildResearchPacket({
    clusterId: "legacy-original-evidence-preflight",
    subject: cluster.primary.title,
    pillar: null,
    recommendedFormat: cluster.strongMerge ? "MERGE" : "SINGLE",
    editorialScore: 0,
    sources: originalSources,
  });
  const evidenceChars = researchPacketEvidenceChars(packet);
  return {
    eligible: evidenceChars >= LEGACY_NEWSROOM_MIN_ORIGINAL_EVIDENCE_CHARS,
    evidenceChars,
    requiredChars: LEGACY_NEWSROOM_MIN_ORIGINAL_EVIDENCE_CHARS,
    sourceUrls: originalSources.length,
  };
}
