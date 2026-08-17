import { createFileRoute } from "@tanstack/react-router";
import { sourceAuthorityLabel } from "@/data/source-authority";
import { enrichArticleRow } from "@/lib/content-quality";
import { runCloudflareJson } from "@/lib/cloudflare-json-ai.server";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import {
  categoryForPillar,
  NEWSROOM_DRAFT_JSON_SCHEMA,
  newsroomRewriteSystemPrompt,
  newsroomRewriteUserPrompt,
  normalizeNewsroomDraft,
  slugifyNewsroomTitle,
  validateNewsroomDraft,
  type NewsroomDraft,
} from "@/lib/newsroom-rewrite-adapter";
import {
  compactResearchPacket,
  researchPacketEvidenceChars,
  type ResearchPacket,
  type ResearchPacketSource,
} from "@/lib/newsroom-research-packet";

const SITE = "keeptxred";
const STANDARD_MIN_SOURCE_EVIDENCE_CHARS = 5_000;
const LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS = 9_000;
const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const PRODUCTION_WORKFLOW_PATH = ".github/workflows/run-daily-news-now.yml";
const GENERATED_NEWS_PROVENANCE_SIGNATURE =
  "Keep TX Red rewrote the coverage independently and links to the original for verification.";

type CandidateRow = {
  id: string;
  cluster_id: string;
  editorial_score: number;
  recommended_format: string;
  status: string;
};
type ClusterRow = { id: string; canonical_subject: string; pillar_slug: string | null };
type PacketRow = { cluster_id: string; packet_json: ResearchPacket; source_count: number; primary_source_count: number };

type AuthorityMetadata = {
  model: "aggregated";
  storyClusterId: string;
  recommendedFormat: string;
  sourceCount: number;
  primarySourceCount: number;
  nonPrimarySourceCount: number;
  generatedFromResearchPacket: true;
  indexability: "indexable" | "noindex";
};

function articleBodyText(body: {
  intro: string[];
  sections: Array<{ heading: string; paragraphs: string[] }>;
  faq: Array<{ q: string; a: string }>;
  keyTakeaways: string[];
}): string {
  return [
    ...(body.intro ?? []),
    ...(body.sections ?? []).flatMap((section) => [section.heading, ...(section.paragraphs ?? [])]),
    ...(body.faq ?? []).flatMap((item) => [item.q, item.a]),
    ...(body.keyTakeaways ?? []),
  ].filter(Boolean).join(" ");
}

function evidenceFloorForPillar(pillar: string | null): number {
  const category = categoryForPillar(pillar).toLowerCase();
  return category === "sports" || category === "education" || category === "non-political"
    ? LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS
    : STANDARD_MIN_SOURCE_EVIDENCE_CHARS;
}

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function authorized(request: Request, mode: "shadow" | "publish"): Promise<boolean> {
  const expected = process.env.NEWSROOM_HOOK_TOKEN;
  if (expected && request.headers.get("x-newsroom-hook-token") === expected) return true;
  if (mode !== "publish") return false;

  const token = bearerToken(request);
  if (!token) return false;
  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: PRODUCTION_WORKFLOW_PATH,
    });
    return true;
  } catch {
    return false;
  }
}

function uniquePacketSources(sources: ResearchPacketSource[]): ResearchPacketSource[] {
  const seen = new Set<string>();
  return [...sources]
    .filter((source) => Boolean(source.url))
    .sort((a, b) => Number(b.isPrimarySource) - Number(a.isPrimarySource)
      || (b.sourceReputationScore ?? 0) - (a.sourceReputationScore ?? 0)
      || a.feedItemId - b.feedItemId)
    .filter((source) => {
      const key = source.url.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function coverageTimeline(sources: ResearchPacketSource[]): string[] {
  const seen = new Set<string>();
  return sources
    .filter((source) => source.publishedAt && Number.isFinite(Date.parse(source.publishedAt)))
    .sort((a, b) => Date.parse(a.publishedAt ?? "") - Date.parse(b.publishedAt ?? ""))
    .filter((source) => {
      const key = `${source.publishedAt?.slice(0, 10)}|${source.title.trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(-6)
    .map((source) => {
      const date = new Date(source.publishedAt as string).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Chicago",
      });
      return `${date} — ${source.source}: ${source.title}`;
    });
}

function provenanceSummary(input: {
  sourceCount: number;
  primarySourceCount: number;
  recommendedFormat: string;
}): string {
  const primary = input.primarySourceCount === 1
    ? "1 primary or official record"
    : `${input.primarySourceCount} primary or official records`;
  const remaining = Math.max(0, input.sourceCount - input.primarySourceCount);
  const other = remaining === 1 ? "1 other published source" : `${remaining} other published sources`;
  const format = input.recommendedFormat.toLowerCase();
  return `Keep TX Red built this ${format} story from ${input.sourceCount} linked source records in one story cluster, including ${primary} and ${other}. Source links are preserved below so readers can check the underlying material directly. Inclusion of a source does not imply endorsement.`;
}

function newsroomRepairUserPrompt(
  packet: ResearchPacket,
  previousDraft: NewsroomDraft,
  validationReasons: string[],
): string {
  return JSON.stringify({
    instruction: "Repair the previous draft rather than restarting. Preserve every source-supported fact that already works. Fix every listed validation failure, remove unsupported/generic phrasing, keep the exact required JSON shape, and do not add facts that are absent from the packet. Return the complete corrected draft JSON.",
    validationFailures: validationReasons,
    previousDraft,
    packet: JSON.parse(newsroomRewriteUserPrompt(packet)),
  });
}

function productionAuthorityEligible(packetRow: PacketRow): boolean {
  return packetRow.source_count >= 2 || packetRow.primary_source_count >= 1;
}

async function handler({ request }: { request: Request }) {
  const url = new URL(request.url);
  const requestedMode = url.searchParams.get("mode") === "publish" ? "publish" : "shadow";
  if (!(await authorized(request, requestedMode))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.NEWSROOM_AI_ENABLED !== "true") {
    return Response.json({ ok: false, disabled: true, reason: "newsroom_ai_disabled" }, { status: 503 });
  }
  if (requestedMode === "publish" && process.env.NEWSROOM_PUBLISH_ENABLED !== "true") {
    return Response.json({ ok: false, disabled: true, reason: "newsroom_publish_disabled" }, { status: 503 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Newsroom tables intentionally lead generated Supabase types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;

  const { data: candidateData, error: candidateError } = await db
    .from("news_publish_candidates")
    .select("id,cluster_id,editorial_score,recommended_format,status")
    .in("status", ["PENDING", "HELD"])
    .in("recommended_format", ["SINGLE", "MERGE", "SYNTHESIS"])
    .order("editorial_score", { ascending: false })
    .limit(100);
  if (candidateError) return Response.json({ error: candidateError.message }, { status: 500 });
  const candidates = (candidateData ?? []) as CandidateRow[];
  if (!candidates.length) return Response.json({ ok: true, no_items: true, reason: "no_candidates", aiCalls: 0 });

  const clusterIds = candidates.map((candidate) => candidate.cluster_id);
  const candidateIds = candidates.map((candidate) => candidate.id);
  const baseQueries = [
    db.from("news_story_clusters").select("id,canonical_subject,pillar_slug").in("id", clusterIds),
    db.from("news_research_packets").select("cluster_id,packet_json,source_count,primary_source_count").in("cluster_id", clusterIds),
  ];
  const shadowDraftQuery = requestedMode === "shadow"
    ? db.from("newsroom_generation_drafts").select("candidate_id").eq("mode", "shadow").in("candidate_id", candidateIds)
    : Promise.resolve({ data: [], error: null });
  const [clusterResult, packetResult, shadowDraftResult] = await Promise.all([...baseQueries, shadowDraftQuery]);
  const { data: clusterData, error: clusterError } = clusterResult;
  const { data: packetData, error: packetError } = packetResult;
  const { data: shadowDraftData, error: shadowDraftError } = shadowDraftResult;
  if (clusterError) return Response.json({ error: clusterError.message }, { status: 500 });
  if (packetError) return Response.json({ error: packetError.message }, { status: 500 });
  if (shadowDraftError) return Response.json({ error: shadowDraftError.message }, { status: 500 });

  const clusters = (clusterData ?? []) as ClusterRow[];
  const packets = (packetData ?? []) as PacketRow[];
  const clusterById = new Map(clusters.map((row) => [row.id, row]));
  const packetByCluster = new Map(packets.map((row) => [row.cluster_id, row]));
  const shadowedCandidateIds = new Set<string>((shadowDraftData ?? []).map((row: { candidate_id: string }) => row.candidate_id));
  const unshadowedCandidates = candidates.filter((row) => !shadowedCandidateIds.has(row.id));
  const evidenceEligibleCandidates = unshadowedCandidates.filter((row) => {
    const packetRow = packetByCluster.get(row.cluster_id);
    const cluster = clusterById.get(row.cluster_id);
    if (!packetRow || !cluster || packetRow.source_count <= 0) return false;
    return researchPacketEvidenceChars(packetRow.packet_json) >= evidenceFloorForPillar(cluster.pillar_slug);
  });
  const candidate = requestedMode === "publish"
    ? evidenceEligibleCandidates.find((row) => productionAuthorityEligible(packetByCluster.get(row.cluster_id)!))
    : evidenceEligibleCandidates[0];
  if (!candidate) {
    const reason = requestedMode === "shadow" && unshadowedCandidates.length === 0
      ? "no_unshadowed_candidates"
      : requestedMode === "publish" && evidenceEligibleCandidates.length > 0
        ? "insufficient_authority_evidence"
        : "insufficient_source_evidence";
    return Response.json({ ok: true, no_items: true, reason, aiCalls: 0 });
  }

  const cluster = clusterById.get(candidate.cluster_id);
  const packetRow = packetByCluster.get(candidate.cluster_id);
  if (!cluster || !packetRow) return Response.json({ error: "Selected candidate is missing cluster or packet" }, { status: 500 });
  const evidenceChars = researchPacketEvidenceChars(packetRow.packet_json);
  const evidenceFloor = evidenceFloorForPillar(cluster.pillar_slug);
  const packet = compactResearchPacket(packetRow.packet_json);
  const kind = "normal";

  const { data: reservation, error: reserveError } = await db.rpc("newsroom_reserve_ai_generation", {
    p_site: SITE,
    p_kind: kind,
  });
  if (reserveError) return Response.json({ error: reserveError.message }, { status: 500 });
  if (!reservation?.reserved) {
    return Response.json({ ok: true, no_items: true, reason: "ai_budget_exhausted", budget: reservation, aiCalls: 0 });
  }

  await db.from("news_publish_candidates").update({
    status: "SELECTED",
    selected_at: new Date().toISOString(),
  }).eq("id", candidate.id);

  let generated = false;
  try {
    let ai = await runCloudflareJson<NewsroomDraft>({
      system: newsroomRewriteSystemPrompt(packet),
      user: newsroomRewriteUserPrompt(packet),
      maxTokens: 12000,
      maxAttempts: 1,
      jsonSchema: NEWSROOM_DRAFT_JSON_SCHEMA,
    });
    generated = true;
    let draft = normalizeNewsroomDraft(ai.value) as NewsroomDraft;
    let validation = validateNewsroomDraft(draft, packet);
    const firstValidationReasons = [...validation.reasons];
    let aiCalls = 1;
    let providerAttempts = ai.attempts;
    let repairAttempted = false;

    if (!validation.ok && !validation.reasons.includes("brief_no_clear_news_event")) {
      repairAttempted = true;
      const repaired = await runCloudflareJson<NewsroomDraft>({
        system: `${newsroomRewriteSystemPrompt(packet)}\n\nREPAIR MODE: The previous draft failed local validation. Correct only the listed failures while preserving supported facts and the required six-section structure. Do not invent detail or pad with generic commentary.`,
        user: newsroomRepairUserPrompt(packet, draft, validation.reasons),
        maxTokens: 12000,
        maxAttempts: 1,
        jsonSchema: NEWSROOM_DRAFT_JSON_SCHEMA,
      });
      aiCalls += 1;
      providerAttempts += repaired.attempts;
      ai = repaired;
      draft = normalizeNewsroomDraft(repaired.value) as NewsroomDraft;
      validation = validateNewsroomDraft(draft, packet);
    }

    const { data: draftRows, error: draftError } = await db.from("newsroom_generation_drafts").insert({
      candidate_id: candidate.id,
      cluster_id: candidate.cluster_id,
      mode: requestedMode,
      status: validation.ok ? "GENERATED" : "REJECTED",
      draft_json: draft,
      validation_reasons: validation.reasons,
      main_word_count: validation.mainWordCount,
      provider: ai.provider,
      model: ai.model,
      provider_attempts: providerAttempts,
    }).select("id").limit(1);
    if (draftError) throw new Error(draftError.message);
    const draftId = draftRows?.[0]?.id as string | undefined;

    if (!validation.ok) {
      const shadowFailure = requestedMode === "shadow";
      await db.from("news_publish_candidates").update(shadowFailure ? {
        status: "HELD",
      } : {
        status: "REJECTED",
        rejection_reason: validation.reasons.join(",").slice(0, 1000),
      }).eq("id", candidate.id);
      await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: true });
      return Response.json({
        ok: true,
        generated: true,
        published: false,
        mode: requestedMode,
        candidateId: candidate.id,
        clusterId: candidate.cluster_id,
        draftId,
        evidenceChars,
        evidenceFloor,
        validation,
        firstValidationReasons,
        repairAttempted,
        provider: ai.provider,
        model: ai.model,
        attempts: providerAttempts,
        aiCalls,
      });
    }

    if (requestedMode === "shadow") {
      await db.from("news_publish_candidates").update({ status: "HELD" }).eq("id", candidate.id);
      await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: true });
      return Response.json({
        ok: true,
        generated: true,
        published: false,
        mode: "shadow",
        candidateId: candidate.id,
        clusterId: candidate.cluster_id,
        draftId,
        editorialScore: candidate.editorial_score,
        recommendedFormat: candidate.recommended_format,
        sourceCount: packetRow.source_count,
        primarySourceCount: packetRow.primary_source_count,
        evidenceChars,
        evidenceFloor,
        validation,
        firstValidationReasons,
        repairAttempted,
        provider: ai.provider,
        model: ai.model,
        attempts: providerAttempts,
        aiCalls,
      });
    }

    const now = new Date();
    const slug = slugifyNewsroomTitle(draft.title, now.toISOString().slice(0, 10));
    const packetSources = uniquePacketSources(packet.sources);
    const sourceCount = packetSources.length;
    const primarySourceCount = packetSources.filter((source) => source.isPrimarySource).length;
    const nonPrimarySourceCount = Math.max(0, sourceCount - primarySourceCount);
    const shouldNoindex = sourceCount < 2 && primarySourceCount === 0;
    const timeline = coverageTimeline(packetSources);
    const sources = packetSources.map((source) => ({
      label: sourceAuthorityLabel(source),
      url: source.url,
    }));
    const primary = packetSources.find((source) => source.isPrimarySource) ?? packetSources[0];
    const authority: AuthorityMetadata = {
      model: "aggregated",
      storyClusterId: candidate.cluster_id,
      recommendedFormat: candidate.recommended_format,
      sourceCount,
      primarySourceCount,
      nonPrimarySourceCount,
      generatedFromResearchPacket: true,
      indexability: shouldNoindex ? "noindex" : "indexable",
    };
    const authoritySections = [
      {
        heading: "What We Know — Key Takeaways",
        paragraphs: draft.keyTakeaways.map((takeaway) => takeaway.trim()).filter(Boolean),
      },
      {
        heading: "How This Story Was Built",
        paragraphs: [
          provenanceSummary({ sourceCount, primarySourceCount, recommendedFormat: candidate.recommended_format }),
          "[See Keep TX Red's source classifications and primary-source policy](/sources).",
        ],
      },
      ...(timeline.length >= 2 ? [{
        heading: "Coverage Timeline",
        paragraphs: timeline,
      }] : []),
    ].filter((section) => section.paragraphs.length > 0);
    const bodyJson = {
      updated: now.toISOString().slice(0, 10),
      intro: [draft.summary.trim()],
      sections: [
        ...authoritySections,
        { heading: "Texas relevance", paragraphs: [draft.relevance.trim()] },
        ...draft.sections,
        {
          heading: "Source Attribution",
          paragraphs: [
            GENERATED_NEWS_PROVENANCE_SIGNATURE,
            "Keep TX Red is an aggregation and synthesis publication. This story was independently rewritten from the linked source material rather than copied from a single publisher. Where the research packet contains an exact primary or official record, that record is labeled separately in the source list below.",
          ],
        },
      ],
      faq: draft.faq,
      sources,
      keyTakeaways: [],
      authority,
    };
    const row = {
      slug,
      internal_url: `/news/${slug}`,
      is_ingested: false,
      category: categoryForPillar(cluster.pillar_slug),
      title: draft.title.slice(0, 200),
      dek: draft.dek.slice(0, 400),
      author: "Keep TX Red Newsroom",
      source_name: primary?.source ?? "Keep TX Red aggregation packet",
      source_url: primary?.url ?? null,
      published_at: now.toISOString(),
      score: candidate.editorial_score,
      is_breaking: false,
      kind: "news",
      body: articleBodyText(bodyJson),
      body_json: bodyJson,
    };
    enrichArticleRow(row);

    if (shouldNoindex) {
      const enriched = row as typeof row & { quality_flags?: string[] | null };
      enriched.quality_flags = [...new Set([...(enriched.quality_flags ?? []), "seo_noindex", "single_source_aggregation"] )];
    }

    const { data: articles, error: articleError } = await db
      .from("daily_articles")
      .upsert(row, { onConflict: "slug" })
      .select("id")
      .limit(1);
    if (articleError) throw new Error(articleError.message);
    const articleId = articles?.[0]?.id as string | undefined;

    await Promise.all([
      db.from("news_publish_candidates").update({ status: "PUBLISHED", published_at: now.toISOString() }).eq("id", candidate.id),
      db.from("news_story_clusters").update({ status: "PUBLISHED", published_at: now.toISOString(), published_article_id: articleId ?? null }).eq("id", candidate.cluster_id),
      draftId ? db.from("newsroom_generation_drafts").update({ status: "PUBLISHED", published_article_id: articleId ?? null }).eq("id", draftId) : Promise.resolve(),
    ]);
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: true });

    return Response.json({
      ok: true,
      generated: true,
      published: true,
      candidateId: candidate.id,
      clusterId: candidate.cluster_id,
      draftId,
      articleId,
      slug,
      sourceCount,
      primarySourceCount,
      indexability: shouldNoindex ? "noindex" : "indexable",
      evidenceChars,
      evidenceFloor,
      validation,
      firstValidationReasons,
      repairAttempted,
      provider: ai.provider,
      model: ai.model,
      attempts: providerAttempts,
      aiCalls,
    });
  } catch (error) {
    await db.from("news_publish_candidates").update({ status: "HELD" }).eq("id", candidate.id);
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: generated });
    return Response.json({ error: "Newsroom generation failed", details: String(error) }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/hooks/generate-newsroom")({
  server: { handlers: { POST: handler } },
});