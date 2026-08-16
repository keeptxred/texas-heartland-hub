import { isPrimaryRecordSource } from "@/lib/publication-quality-gate";
import type { StoryCluster } from "@/lib/story-clustering";
import type { FactVerificationDecision } from "@/lib/fact-verification-gate";

export type PublicationTimingMode = "publish_now" | "collect_briefly";

export type PublicationTimingDecision = {
  mode: PublicationTimingMode;
  reason: string;
  waitUntil?: string;
  breaking: boolean;
  ageMinutes: number;
};

export type PublicationClaim = {
  acquired: boolean;
  alreadyPublished: boolean;
  publishedSlug?: string;
  claimToken?: string;
  reason: string;
};

const BREAKING_RE = /\b(breaking|emergency|evacuat(?:e|ion)|tornado|hurricane|wildfire|flash flood|amber alert|active shooter|shooting|explosion|earthquake|major outage|grid emergency|declared disaster|shelter in place|missing child)\b/i;
const COLLECTION_WINDOW_MINUTES = 12;
const CLAIM_TTL_SECONDS = 20 * 60;

function firstSeenMs(cluster: StoryCluster): number {
  const values = [cluster.primary, ...cluster.members]
    .map((item) => item.pub_date)
    .filter((value): value is string => typeof value === "string" && Number.isFinite(Date.parse(value)))
    .map((value) => Date.parse(value));
  return values.length ? Math.min(...values) : Date.now();
}

function storyText(cluster: StoryCluster): string {
  return [cluster.primary, ...cluster.members]
    .map((item) => `${item.title ?? ""} ${item.description ?? ""}`)
    .join(" ");
}

export function assessPublicationTiming(
  cluster: StoryCluster,
  verification: FactVerificationDecision,
  now = new Date(),
): PublicationTimingDecision {
  const firstSeen = firstSeenMs(cluster);
  const ageMinutes = Math.max(0, (now.getTime() - firstSeen) / 60000);
  const breaking = BREAKING_RE.test(storyText(cluster));
  const primaryRecord = [cluster.primary, ...cluster.members].some(isPrimaryRecordSource);

  if (breaking) {
    return { mode: "publish_now", reason: "breaking-news exception after verification", breaking: true, ageMinutes };
  }
  if (primaryRecord) {
    return { mode: "publish_now", reason: "primary record available", breaking: false, ageMinutes };
  }
  if (cluster.sourceCount >= 3 || verification.corroboratedMajorFacts >= 2) {
    return { mode: "publish_now", reason: "sufficient independent corroboration", breaking: false, ageMinutes };
  }
  if (cluster.sourceCount === 2 && ageMinutes < COLLECTION_WINDOW_MINUTES) {
    return {
      mode: "collect_briefly",
      reason: `two-source event is inside the ${COLLECTION_WINDOW_MINUTES}-minute collection window`,
      waitUntil: new Date(firstSeen + COLLECTION_WINDOW_MINUTES * 60000).toISOString(),
      breaking: false,
      ageMinutes,
    };
  }
  return { mode: "publish_now", reason: "collection window elapsed", breaking: false, ageMinutes };
}

export async function acquirePublicationClaim(db: any, clusterId: string | null): Promise<PublicationClaim> {
  if (!clusterId) {
    return { acquired: true, alreadyPublished: false, reason: "durable cluster unavailable; existing fallback path retained" };
  }
  const claimToken = crypto.randomUUID();
  try {
    const { data, error } = await db.rpc("claim_news_event_cluster_publication", {
      p_cluster_id: clusterId,
      p_claim_token: claimToken,
      p_claim_ttl_seconds: CLAIM_TTL_SECONDS,
    });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (row?.published_slug) {
      return {
        acquired: false,
        alreadyPublished: true,
        publishedSlug: row.published_slug,
        reason: "event already has a published canonical article",
      };
    }
    if (row?.acquired) {
      return { acquired: true, alreadyPublished: false, claimToken, reason: "atomic event publication claim acquired" };
    }
    return { acquired: false, alreadyPublished: false, reason: "another worker currently owns the event publication claim" };
  } catch (error) {
    console.warn("[multi-source] publication claim unavailable; retaining existing fallback", error instanceof Error ? error.message : String(error));
    return { acquired: true, alreadyPublished: false, reason: "claim RPC unavailable; existing fallback path retained" };
  }
}

export async function releasePublicationClaim(db: any, clusterId: string | null, claimToken?: string): Promise<void> {
  if (!clusterId || !claimToken) return;
  try {
    const { error } = await db.rpc("release_news_event_cluster_publication_claim", {
      p_cluster_id: clusterId,
      p_claim_token: claimToken,
    });
    if (error) throw error;
  } catch (error) {
    console.warn("[multi-source] publication claim release skipped", error instanceof Error ? error.message : String(error));
  }
}

export async function persistTimingDecision(
  db: any,
  feedItemId: number,
  clusterId: string | null,
  decision: PublicationTimingDecision,
): Promise<void> {
  try {
    const { data } = await db.from("texas_news_feed").select("cluster_json").eq("id", feedItemId).maybeSingle();
    const current = data?.cluster_json && typeof data.cluster_json === "object" ? data.cluster_json : {};
    const timingMetadata = {
      mode: decision.mode,
      reason: decision.reason,
      wait_until: decision.waitUntil ?? null,
      breaking: decision.breaking,
      age_minutes: Number(decision.ageMinutes.toFixed(1)),
      decided_at: new Date().toISOString(),
    };
    const { error } = await db.from("texas_news_feed").update({
      cluster_json: { ...current, publication_timing: timingMetadata },
    }).eq("id", feedItemId);
    if (error) throw error;

    if (clusterId) {
      const { data: clusterRow, error: readClusterError } = await db
        .from("news_event_clusters")
        .select("metadata")
        .eq("id", clusterId)
        .maybeSingle();
      if (readClusterError) throw readClusterError;
      const currentClusterMetadata = clusterRow?.metadata && typeof clusterRow.metadata === "object"
        ? clusterRow.metadata
        : {};
      const { error: clusterError } = await db.from("news_event_clusters").update({
        next_publish_eligible_at: decision.mode === "collect_briefly" ? decision.waitUntil ?? null : null,
        metadata: { ...currentClusterMetadata, publication_timing: timingMetadata },
      }).eq("id", clusterId);
      if (clusterError) throw clusterError;
    }
  } catch (error) {
    console.warn("[multi-source] publication timing metadata not persisted", error instanceof Error ? error.message : String(error));
  }
}
