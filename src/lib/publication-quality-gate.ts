import { sourceFamily, type ClusterableFeedItem, type StoryCluster } from "@/lib/story-clustering";
import { sourceFamilyFromUrl } from "@/lib/article-source-integrity";

export type PublicationReadiness = {
  publish: boolean;
  reason: string;
  mode: "multi_source" | "primary_record" | "hold_for_corroboration";
  authorityTopic: boolean;
  primaryRecord: boolean;
  independentSourceCount: number;
};

const AUTHORITY_TOPIC_RE =
  /\b(election|vot(?:e|er|ing)|ballot|candidate|campaign|runoff|redistrict|property tax|appraisal|homestead|tax rate|tax bill|legislature|legislative|house bill|senate bill|\bHB\s*\d+\b|\bSB\s*\d+\b|statute|law|court|supreme court|attorney general|secretary of state|governor|constitutional amendment)\b/i;

const PUBLIC_IMPACT_RE =
  /\b(statewide|texas|county|city|district|school|education|tax|election|voter|law|court|rule|regulation|budget|utility|ercot|grid|water|border|public safety|emergency|disaster|hurricane|flood|wildfire|drought)\b/i;

const PRIMARY_SOURCE_RE =
  /\b(office of the governor|texas secretary of state|texas attorney general|texas supreme court|texas court of criminal appeals|texas legislature|texas legislative council|texas education agency|texas comptroller|texas ethics commission|texas workforce commission|texas department of public safety|texas department of transportation|texas parks\s*&\s*wildlife|ercot|county of |city of |school district|police department|sheriff'?s office)\b/i;

function storyText(item: ClusterableFeedItem): string {
  return `${item.title ?? ""} ${item.description ?? ""} ${item.extracted_body ?? ""}`.trim();
}

export function isPrimaryRecordSource(item: ClusterableFeedItem): boolean {
  const family = sourceFamily(item);
  const text = `${item.source ?? ""} ${item.link ?? ""}`;
  return /(^|\.)gov(?::\d+)?(?:\/|$)/i.test(family) || /\.gov(?:\/|$)/i.test(text) || PRIMARY_SOURCE_RE.test(text);
}

export function isAuthorityTopic(item: ClusterableFeedItem): boolean {
  return AUTHORITY_TOPIC_RE.test(storyText(item));
}

function hasSubstantivePrimaryRecord(item: ClusterableFeedItem): boolean {
  const text = storyText(item);
  const words = text ? text.split(/\s+/).length : 0;
  return words >= 80 || (words >= 35 && PUBLIC_IMPACT_RE.test(text));
}

/** Count genuinely independent publisher families, not feed/canonical hostnames. */
export function independentPublisherFamilyCount(cluster: StoryCluster): number {
  const families = new Set<string>();
  for (const item of [cluster.primary, ...cluster.members]) {
    const family = sourceFamilyFromUrl(item.link) ?? sourceFamily(item);
    if (family) families.add(family);
  }
  return families.size;
}

/**
 * Google-facing publication gate.
 *
 * The newsroom may ingest any relevant feed item, but it should not mint a
 * crawlable article merely because an AI rewrite can reach a word-count floor.
 * New articles need either genuinely independent corroboration or a substantive
 * primary record. Feed/canonical/subdomain variants from one publisher count as
 * one source family. Secondary single-source reports stay in the feed/admin
 * queue until another independent publisher arrives.
 */
export function assessPublicationReadiness(cluster: StoryCluster): PublicationReadiness {
  const primaryRecord = isPrimaryRecordSource(cluster.primary);
  const authorityTopic = isAuthorityTopic(cluster.primary);
  const independentSourceCount = independentPublisherFamilyCount(cluster);

  if (cluster.strongMerge && independentSourceCount >= 2) {
    return {
      publish: true,
      reason: `independent multi-source event (${independentSourceCount} publisher families)`,
      mode: "multi_source",
      authorityTopic,
      primaryRecord,
      independentSourceCount,
    };
  }

  if (primaryRecord && hasSubstantivePrimaryRecord(cluster.primary)) {
    return {
      publish: true,
      reason: authorityTopic
        ? "substantive primary record on a core Texas authority topic"
        : "substantive primary Texas public record",
      mode: "primary_record",
      authorityTopic,
      primaryRecord: true,
      independentSourceCount,
    };
  }

  return {
    publish: false,
    reason: independentSourceCount < 2 && cluster.sourceCount >= 2
      ? "same-publisher feed/canonical variants do not satisfy independent corroboration"
      : authorityTopic
        ? "secondary single-source authority story held for independent corroboration"
        : "secondary single-source story held for independent corroboration",
    mode: "hold_for_corroboration",
    authorityTopic,
    primaryRecord,
    independentSourceCount,
  };
}
