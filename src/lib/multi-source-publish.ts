import {
  buildSourcePacket,
  buildStoryCluster,
  clusterSourceList,
  type ClusterableFeedItem,
  type StoryCluster,
} from "@/lib/story-clustering";
import { persistEventCluster } from "@/lib/event-cluster-persistence";
import {
  buildStructuredFactLedger,
  buildStructuredFactPacket,
  persistStructuredFacts,
} from "@/lib/structured-fact-provenance";
import {
  assessFactVerification,
  buildVerificationInstructions,
  type FactVerificationDecision,
} from "@/lib/fact-verification-gate";
import {
  buildStoryAngleInstructions,
  selectStoryAngle,
  type StoryAnglePlan,
} from "@/lib/story-angle-selector";
import {
  acquirePublicationClaim,
  assessPublicationTiming,
  persistTimingDecision,
  releasePublicationClaim,
} from "@/lib/publication-lifecycle";
import {
  acquireLivingStoryUpdateClaim,
  releaseLivingStoryUpdateClaim,
  updateCanonicalLivingStory,
} from "@/lib/living-story-update";
import { assessStoryNovelty, type StoryNovelty } from "@/lib/story-novelty";
import { assessPublicationReadiness } from "@/lib/publication-quality-gate";
import { publishSingleFeedItem as publishLegacySingleFeedItem } from "@/lib/ingest-feeds-legacy";

type PublishResult = {
  ok: boolean;
  slug?: string;
  error?: string;
  alreadyPublished?: boolean;
  clusteredSources?: number;
  developingStory?: "confirmation" | "follow_up";
  noveltyScore?: number;
};

const CLUSTER_LOOKBACK_HOURS = 72;
const SAME_EVENT_SCORE = 80;
const MAX_CLUSTER_SOURCES = 5;
const MAX_FACT_PACKET_CHARS = 9000;

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

async function fetchReadableText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "KeepTXRed/1.2 (+https://keeptxred.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml/i.test(type)) return null;
    const html = await response.text();
    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<(header|footer|nav|aside|form)[\s\S]*?<\/\1>/gi, " ");
    const article = stripped.match(/<article[\s\S]*?<\/article>/i)?.[0] ?? stripped;
    const text = article
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
    if (wordCount(text) < 80) return null;
    return text.slice(0, 6500);
  } catch {
    return null;
  }
}

async function enrichClusterBodies(cluster: StoryCluster, supabaseAdmin: any): Promise<StoryCluster> {
  const rows = [cluster.primary, ...cluster.members];
  const enriched: ClusterableFeedItem[] = [];

  for (const row of rows) {
    let body = (row.extracted_body ?? "").trim();
    const description = (row.description ?? "").trim();
    if (!body && wordCount(description) < 180 && /^https?:\/\//i.test(row.link)) {
      body = (await fetchReadableText(row.link)) ?? "";
      if (body && row.id) {
        await supabaseAdmin.from("texas_news_feed").update({ extracted_body: body }).eq("id", row.id);
      }
    }
    enriched.push({ ...row, extracted_body: body || description });
  }

  const primary = enriched[0];
  const members = cluster.members.map((member, index) => ({ ...member, ...enriched[index + 1] }));
  return { ...cluster, primary, members };
}

async function writeClusterMetadata(
  supabaseAdmin: any,
  cluster: StoryCluster,
  slug?: string,
  development?: { kind: "confirmation" | "follow_up"; novelty?: StoryNovelty },
): Promise<void> {
  const rows = [cluster.primary, ...cluster.members];
  const ids = rows
    .map((row) => row.id)
    .filter((id): id is number => typeof id === "number");
  if (!ids.length) return;
  const metadata = {
    cluster_score: cluster.score,
    source_count: cluster.sourceCount,
    source_links: clusterSourceList(cluster),
    clustered_at: new Date().toISOString(),
    development_kind: development?.kind ?? null,
    novelty_score: development?.novelty?.score ?? null,
    novelty_actions: development?.novelty?.newActions ?? [],
    novelty_numbers: development?.novelty?.newNumbers ?? [],
  };
  const { error } = await supabaseAdmin.from("texas_news_feed").update({ cluster_json: metadata }).in("id", ids);
  if (error) console.warn("[multi-source] cluster metadata not persisted", error.message);
  if (slug) {
    const linkableIds = rows
      .filter((row) => !row.internal_slug)
      .map((row) => row.id)
      .filter((id): id is number => typeof id === "number");
    if (linkableIds.length) {
      await supabaseAdmin.from("texas_news_feed").update({ internal_slug: slug }).in("id", linkableIds);
    }
  }
}

async function writeQualityHoldMetadata(
  supabaseAdmin: any,
  feedItemId: number,
  readiness: ReturnType<typeof assessPublicationReadiness>,
  cluster: StoryCluster,
): Promise<void> {
  const metadata = {
    cluster_score: cluster.score,
    source_count: cluster.sourceCount,
    source_links: clusterSourceList(cluster),
    clustered_at: new Date().toISOString(),
    publication_readiness: readiness.mode,
    publication_hold_reason: readiness.reason,
    authority_topic: readiness.authorityTopic,
    primary_record: readiness.primaryRecord,
  };
  const { error } = await supabaseAdmin
    .from("texas_news_feed")
    .update({ cluster_json: metadata })
    .eq("id", feedItemId);
  if (error) console.warn("[multi-source] publication hold metadata not persisted", error.message);
}

async function writeFactVerificationHoldMetadata(
  supabaseAdmin: any,
  feedItemId: number,
  decision: FactVerificationDecision,
  cluster: StoryCluster,
): Promise<void> {
  const metadata = {
    cluster_score: cluster.score,
    source_count: cluster.sourceCount,
    source_links: clusterSourceList(cluster),
    clustered_at: new Date().toISOString(),
    publication_readiness: decision.mode,
    publication_hold_reason: decision.reason,
    fact_verification: {
      traceable_major_facts: decision.traceableMajorFacts,
      corroborated_major_facts: decision.corroboratedMajorFacts,
      primary_record_major_facts: decision.primaryRecordMajorFacts,
      material_conflict_keys: decision.materialConflictKeys,
      attributed_claim_keys: decision.attributedClaimKeys,
    },
  };
  const { error } = await supabaseAdmin
    .from("texas_news_feed")
    .update({ cluster_json: metadata })
    .eq("id", feedItemId);
  if (error) console.warn("[multi-source] fact verification hold metadata not persisted", error.message);
}

async function writeStoryAngleMetadata(
  supabaseAdmin: any,
  feedItemId: number,
  anglePlan: StoryAnglePlan | null,
): Promise<void> {
  if (!anglePlan) return;
  const { data } = await supabaseAdmin
    .from("texas_news_feed")
    .select("cluster_json")
    .eq("id", feedItemId)
    .maybeSingle();
  const current = data?.cluster_json && typeof data.cluster_json === "object" ? data.cluster_json : {};
  const storyAngle = {
    angle_type: anglePlan.angleType,
    lead_fact_key: anglePlan.leadFactKey,
    lead_fact: anglePlan.leadFact,
    evidence_score: anglePlan.leadScore,
    alternate_facts: anglePlan.alternateFacts,
    selected_at: new Date().toISOString(),
  };
  const { error } = await supabaseAdmin
    .from("texas_news_feed")
    .update({ cluster_json: { ...current, story_angle: storyAngle } })
    .eq("id", feedItemId);
  if (error) console.warn("[multi-source] story angle metadata not persisted", error.message);
}

async function updateArticleAttribution(supabaseAdmin: any, slug: string, cluster: StoryCluster): Promise<void> {
  const sources = clusterSourceList(cluster).map((source) => ({
    label: `${source.label} — source`,
    url: source.url,
  }));
  const { data: article } = await supabaseAdmin
    .from("daily_articles")
    .select("body_json")
    .eq("slug", slug)
    .maybeSingle();
  if (!article?.body_json || typeof article.body_json !== "object") return;

  const existingSources = Array.isArray((article.body_json as Record<string, unknown>).sources)
    ? ((article.body_json as Record<string, unknown>).sources as Array<{ label?: string; url?: string }>)
    : [];
  const byUrl = new Map<string, { label?: string; url?: string }>();
  for (const source of [...existingSources, ...sources]) {
    if (source.url) byUrl.set(source.url, source);
  }
  const bodyJson = {
    ...(article.body_json as Record<string, unknown>),
    sources: [...byUrl.values()],
  };
  await supabaseAdmin
    .from("daily_articles")
    .update({ body_json: bodyJson, source_name: "Multiple independent sources" })
    .eq("slug", slug);
}

async function assessExistingStory(
  supabaseAdmin: any,
  slug: string,
  incoming: ClusterableFeedItem,
): Promise<StoryNovelty | null> {
  const { data: article, error } = await supabaseAdmin
    .from("daily_articles")
    .select("title,dek,body")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !article) return null;
  const existingText = `${article.title ?? ""} ${article.dek ?? ""} ${article.body ?? ""}`;
  return assessStoryNovelty(incoming, existingText);
}

async function preparePublicationLifecycle(
  db: any,
  feedItemId: number,
  clusterId: string | null,
  cluster: StoryCluster,
  factVerification: FactVerificationDecision,
): Promise<{ proceed: boolean; claimToken?: string; result?: PublishResult }> {
  const timing = assessPublicationTiming(cluster, factVerification);
  await persistTimingDecision(db, feedItemId, clusterId, timing);

  if (timing.mode === "collect_briefly") {
    return {
      proceed: false,
      result: {
        ok: false,
        error: `Publication collecting briefly: ${timing.reason}. Recheck after ${timing.waitUntil}.`,
        clusteredSources: cluster.sourceCount,
      },
    };
  }

  const claim = await acquirePublicationClaim(db, clusterId);
  if (claim.alreadyPublished && claim.publishedSlug) {
    await db.from("texas_news_feed").update({ internal_slug: claim.publishedSlug }).eq("id", feedItemId);
    return {
      proceed: false,
      result: {
        ok: true,
        slug: claim.publishedSlug,
        alreadyPublished: true,
        clusteredSources: cluster.sourceCount,
      },
    };
  }
  if (!claim.acquired) {
    return {
      proceed: false,
      result: {
        ok: false,
        error: `Publication deferred: ${claim.reason}.`,
        clusteredSources: cluster.sourceCount,
      },
    };
  }
  return { proceed: true, claimToken: claim.claimToken };
}

export async function publishSingleFeedItem(feedItemId: number): Promise<PublishResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;

  const { data: primary, error } = await db
    .from("texas_news_feed")
    .select("id,title,link,source,description,pub_date,internal_slug,extracted_body")
    .eq("id", feedItemId)
    .maybeSingle();
  if (error || !primary) return { ok: false, error: error?.message ?? "Feed item not found" };
  if (primary.internal_slug) return { ok: true, slug: primary.internal_slug, alreadyPublished: true };

  const since = new Date(Date.now() - CLUSTER_LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
  const { data: recent } = await db
    .from("texas_news_feed")
    .select("id,title,link,source,description,pub_date,internal_slug,extracted_body")
    .gte("pub_date", since)
    .neq("id", feedItemId)
    .order("pub_date", { ascending: false })
    .limit(140);

  let cluster = buildStoryCluster(primary, (recent ?? []) as ClusterableFeedItem[], MAX_CLUSTER_SOURCES);
  if (!cluster.strongMerge) {
    cluster = await enrichClusterBodies(cluster, db);
    const readiness = assessPublicationReadiness(cluster);
    const eventClusterId = await persistEventCluster(db, cluster, { status: "collecting" });
    const ledger = buildStructuredFactLedger(cluster);
    await persistStructuredFacts(db, eventClusterId, ledger);

    if (!readiness.publish) {
      await writeQualityHoldMetadata(db, feedItemId, readiness, cluster);
      console.info("[multi-source] publication held for quality", {
        feedItemId,
        reason: readiness.reason,
        authorityTopic: readiness.authorityTopic,
        primaryRecord: readiness.primaryRecord,
      });
      return {
        ok: false,
        error: `Publication held: ${readiness.reason}. Waiting for an independent source or a substantive primary record.`,
        clusteredSources: cluster.sourceCount,
      };
    }

    const factVerification = assessFactVerification(cluster, ledger);
    if (!factVerification.publish) {
      await writeFactVerificationHoldMetadata(db, feedItemId, factVerification, cluster);
      console.info("[multi-source] publication held for fact verification", {
        feedItemId,
        mode: factVerification.mode,
        reason: factVerification.reason,
      });
      return {
        ok: false,
        error: `Publication held: ${factVerification.reason}.`,
        clusteredSources: cluster.sourceCount,
      };
    }

    const lifecycle = await preparePublicationLifecycle(db, feedItemId, eventClusterId, cluster, factVerification);
    if (!lifecycle.proceed) return lifecycle.result!;

    const singleResult = await publishLegacySingleFeedItem(feedItemId);
    if (singleResult.ok && singleResult.slug) {
      await persistEventCluster(db, cluster, { status: "published", publishedSlug: singleResult.slug });
    } else {
      await releasePublicationClaim(db, eventClusterId, lifecycle.claimToken);
    }
    return { ...singleResult, clusteredSources: cluster.sourceCount };
  }

  cluster = await enrichClusterBodies(cluster, db);
  const eventClusterId = await persistEventCluster(db, cluster, { status: "ready" });
  const ledger = buildStructuredFactLedger(cluster);
  await persistStructuredFacts(db, eventClusterId, ledger);
  const factVerification = assessFactVerification(cluster, ledger);

  if (!factVerification.publish) {
    await writeFactVerificationHoldMetadata(db, feedItemId, factVerification, cluster);
    console.info("[multi-source] multi-source publication held for fact verification", {
      feedItemId,
      mode: factVerification.mode,
      reason: factVerification.reason,
      materialConflictKeys: factVerification.materialConflictKeys,
    });
    return {
      ok: false,
      error: `Publication held: ${factVerification.reason}.`,
      clusteredSources: cluster.sourceCount,
    };
  }

  const existing = cluster.members
    .filter((row) => row.internal_slug && row.combinationScore >= SAME_EVENT_SCORE)
    .sort((a, b) => b.combinationScore - a.combinationScore)[0];

  let existingNovelty: StoryNovelty | null = null;
  if (existing?.internal_slug) {
    existingNovelty = await assessExistingStory(db, existing.internal_slug, primary);

    if (!existingNovelty?.material) {
      await db.from("texas_news_feed").update({ internal_slug: existing.internal_slug }).eq("id", feedItemId);
      await writeClusterMetadata(db, cluster, existing.internal_slug, {
        kind: "confirmation",
        novelty: existingNovelty ?? undefined,
      });
      await updateArticleAttribution(db, existing.internal_slug, cluster);
      await persistEventCluster(db, cluster, { status: "published", publishedSlug: existing.internal_slug });
      return {
        ok: true,
        slug: existing.internal_slug,
        alreadyPublished: true,
        clusteredSources: cluster.sourceCount,
        developingStory: "confirmation",
        noveltyScore: existingNovelty?.score ?? 0,
      };
    }
  }

  const materialExistingSlug = existing?.internal_slug && existingNovelty?.material
    ? existing.internal_slug
    : null;
  let lifecycleClaimToken: string | undefined;
  if (!materialExistingSlug) {
    const lifecycle = await preparePublicationLifecycle(db, feedItemId, eventClusterId, cluster, factVerification);
    if (!lifecycle.proceed) return lifecycle.result!;
    lifecycleClaimToken = lifecycle.claimToken;
  }

  const anglePlan = selectStoryAngle(cluster, ledger, {
    preferredActions: existingNovelty?.material ? existingNovelty.newActions : [],
    preferredNumbers: existingNovelty?.material ? existingNovelty.newNumbers : [],
  });
  const angleInstructions = buildStoryAngleInstructions(anglePlan);
  const packet = buildSourcePacket(cluster);
  const structuredFacts = buildStructuredFactPacket(ledger).slice(0, MAX_FACT_PACKET_CHARS);
  const verificationInstructions = buildVerificationInstructions(factVerification, ledger);
  const sourceNames = [cluster.primary, ...cluster.members].map((row) => row.source);
  const synthesisHeader = [
    "MULTI-SOURCE STORY PACKET.",
    "Use only facts supported by the material below. The structured fact ledger is an extraction aid, not a new source; verify every claim against the raw source packet.",
    "Prefer facts corroborated by independent sources. For directly verifiable facts, prefer official government, agency, court, team, or other primary records over secondary summaries when they conflict.",
    "When the fact ledger marks a conflict, do not average, choose silently, or invent a resolution. Attribute the competing figures or omit the disputed detail unless a primary record resolves it.",
    "Quotes must remain attached to the source that actually contains the quotation. Never create composite or reconstructed quotes.",
    verificationInstructions,
    angleInstructions,
    `Independent sources: ${sourceNames.join(" | ")}.`,
    "Treat this as one developing Texas story when the evidence supports it; do not invent a connection that is not supported.",
    existingNovelty?.material
      ? `MATERIAL FOLLOW-UP DETECTED. Emphasize the new development rather than re-reporting the earlier story. Novelty score: ${existingNovelty.score}. New actions: ${existingNovelty.newActions.join(", ") || "none"}. New figures: ${existingNovelty.newNumbers.join(", ") || "none"}.`
      : "",
  ].filter(Boolean).join("\n");

  const synthesisMaterial = [
    synthesisHeader,
    structuredFacts ? `STRUCTURED FACT LEDGER\n${structuredFacts}` : "",
    `RAW SOURCE PACKET\n${packet}`,
  ].filter(Boolean).join("\n\n");

  await db
    .from("texas_news_feed")
    .update({ extracted_body: synthesisMaterial.slice(0, 26000) })
    .eq("id", feedItemId);

  await writeClusterMetadata(db, cluster, undefined, existingNovelty?.material ? {
    kind: "follow_up",
    novelty: existingNovelty,
  } : undefined);
  await writeStoryAngleMetadata(db, feedItemId, anglePlan);
  await persistEventCluster(db, cluster, { status: "synthesized" });

  if (materialExistingSlug && existingNovelty && eventClusterId) {
    const updateClaim = await acquireLivingStoryUpdateClaim(db, eventClusterId);
    if (!updateClaim.acquired) {
      return {
        ok: false,
        error: `Canonical update deferred: ${updateClaim.reason}.`,
        slug: materialExistingSlug,
        alreadyPublished: true,
        clusteredSources: cluster.sourceCount,
        developingStory: "follow_up",
        noveltyScore: existingNovelty.score,
      };
    }

    const updateResult = await updateCanonicalLivingStory({
      db,
      slug: materialExistingSlug,
      clusterId: eventClusterId,
      feedItemId,
      cluster,
      novelty: existingNovelty,
      anglePlan,
    });
    await releaseLivingStoryUpdateClaim(db, eventClusterId, updateClaim.token);

    if (!updateResult.ok) {
      return {
        ok: false,
        error: `Canonical update failed: ${updateResult.error ?? "unknown error"}.`,
        slug: materialExistingSlug,
        alreadyPublished: true,
        clusteredSources: cluster.sourceCount,
        developingStory: "follow_up",
        noveltyScore: existingNovelty.score,
      };
    }

    await writeClusterMetadata(db, cluster, materialExistingSlug, {
      kind: "follow_up",
      novelty: existingNovelty,
    });
    await writeStoryAngleMetadata(db, feedItemId, anglePlan);
    await updateArticleAttribution(db, materialExistingSlug, cluster);
    await persistEventCluster(db, cluster, { status: "published", publishedSlug: materialExistingSlug });
    return {
      ok: true,
      slug: materialExistingSlug,
      alreadyPublished: true,
      clusteredSources: cluster.sourceCount,
      developingStory: "follow_up",
      noveltyScore: existingNovelty.score,
    };
  }

  if (materialExistingSlug && (!existingNovelty || !eventClusterId)) {
    return {
      ok: false,
      error: "Canonical update blocked because durable event identity is unavailable; refusing to mint a duplicate URL.",
      slug: materialExistingSlug,
      alreadyPublished: true,
      clusteredSources: cluster.sourceCount,
      developingStory: "follow_up",
      noveltyScore: existingNovelty?.score,
    };
  }

  const result = await publishLegacySingleFeedItem(feedItemId);
  if (result.ok && result.slug) {
    await writeClusterMetadata(db, cluster, result.slug);
    await writeStoryAngleMetadata(db, feedItemId, anglePlan);
    await updateArticleAttribution(db, result.slug, cluster);
    await persistEventCluster(db, cluster, { status: "published", publishedSlug: result.slug });
    return {
      ...result,
      clusteredSources: cluster.sourceCount,
    };
  }
  await releasePublicationClaim(db, eventClusterId, lifecycleClaimToken);
  return {
    ...result,
    clusteredSources: cluster.sourceCount,
  };
}
