import { createFileRoute } from "@tanstack/react-router";
import { runCloudflareJson } from "@/lib/cloudflare-json-ai.server";
import { enrichArticleRow } from "@/lib/content-quality";
import {
  dailyBriefBodyJson,
  dailyBriefSystemPrompt,
  dailyBriefUserPrompt,
  validateDailyBriefDraft,
  type DailyBriefPacketItem,
  type TexasDailyBriefDraft,
} from "@/lib/newsroom-daily-brief-adapter";
import { selectDailyBriefItems, type DailyBriefCandidate } from "@/lib/newsroom-daily-brief";
import type { ResearchPacket } from "@/lib/newsroom-research-packet";

const SITE = "keeptxred";
const MIN_BRIEF_ITEMS = 3;
const QUERY_LIMIT = 50;

type CandidateRow = {
  id: string;
  cluster_id: string;
  editorial_score: number;
  recommended_format: string;
  status: string;
  created_at: string;
};
type ClusterRow = {
  id: string;
  first_seen_at: string;
  canonical_subject: string;
  pillar_slug: string | null;
};
type PacketRow = {
  cluster_id: string;
  packet_json: ResearchPacket;
  source_count: number;
  primary_source_count: number;
};

function authorized(request: Request): boolean {
  const expected = process.env.NEWSROOM_HOOK_TOKEN;
  return Boolean(expected && request.headers.get("x-newsroom-hook-token") === expected);
}

function bodyText(body: ReturnType<typeof dailyBriefBodyJson>): string {
  return [
    ...(body.intro ?? []),
    ...(body.sections ?? []).flatMap((section) => [section.heading, ...(section.paragraphs ?? [])]),
    ...(body.faq ?? []).flatMap((item) => [item.q, item.a]),
    ...(body.keyTakeaways ?? []),
  ].filter(Boolean).join(" ");
}

async function handler({ request }: { request: Request }) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.NEWSROOM_AI_ENABLED !== "true" || process.env.NEWSROOM_BRIEF_ENABLED !== "true") {
    return Response.json({ ok: false, disabled: true, reason: "newsroom_brief_disabled" }, { status: 503 });
  }

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") === "publish" ? "publish" : "shadow";
  if (mode === "publish" && process.env.NEWSROOM_PUBLISH_ENABLED !== "true") {
    return Response.json({ ok: false, disabled: true, reason: "newsroom_publish_disabled" }, { status: 503 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Newsroom schema intentionally leads generated Supabase types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;
  const now = new Date();
  const briefDate = now.toISOString().slice(0, 10);

  const { data: existing, error: existingError } = await db
    .from("newsroom_daily_briefs")
    .select("id,status")
    .eq("brief_date", briefDate)
    .eq("mode", mode)
    .in("status", ["GENERATED", "PUBLISHED"])
    .limit(1);
  if (existingError) return Response.json({ error: existingError.message }, { status: 500 });
  if ((existing ?? []).length) {
    return Response.json({ ok: true, no_items: true, reason: "brief_already_exists", briefId: existing[0].id, aiCalls: 0 });
  }

  const { data: candidateData, error: candidateError } = await db
    .from("news_publish_candidates")
    .select("id,cluster_id,editorial_score,recommended_format,status,created_at")
    .in("status", ["PENDING", "HELD"])
    .in("recommended_format", ["SINGLE", "MERGE", "SYNTHESIS"])
    .order("editorial_score", { ascending: false })
    .limit(QUERY_LIMIT);
  if (candidateError) return Response.json({ error: candidateError.message }, { status: 500 });
  const candidates = (candidateData ?? []) as CandidateRow[];
  if (!candidates.length) return Response.json({ ok: true, no_items: true, reason: "no_candidates", aiCalls: 0 });

  const clusterIds = candidates.map((candidate) => candidate.cluster_id);
  const [{ data: clusterData, error: clusterError }, { data: packetData, error: packetError }] = await Promise.all([
    db.from("news_story_clusters").select("id,first_seen_at,canonical_subject,pillar_slug").in("id", clusterIds),
    db.from("news_research_packets").select("cluster_id,packet_json,source_count,primary_source_count").in("cluster_id", clusterIds),
  ]);
  if (clusterError) return Response.json({ error: clusterError.message }, { status: 500 });
  if (packetError) return Response.json({ error: packetError.message }, { status: 500 });

  const clusters = (clusterData ?? []) as ClusterRow[];
  const packets = (packetData ?? []) as PacketRow[];
  const clusterById = new Map(clusters.map((row) => [row.id, row]));
  const packetByCluster = new Map(packets.map((row) => [row.cluster_id, row]));
  const selectionRows: DailyBriefCandidate[] = candidates.map((candidate) => ({
    id: candidate.id,
    clusterId: candidate.cluster_id,
    editorialScore: candidate.editorial_score,
    recommendedFormat: candidate.recommended_format,
    status: candidate.status,
    firstSeenAt: clusterById.get(candidate.cluster_id)?.first_seen_at ?? candidate.created_at,
    hasResearchPacket: packetByCluster.has(candidate.cluster_id),
  }));
  const selected = selectDailyBriefItems(selectionRows);
  if (selected.length < MIN_BRIEF_ITEMS) {
    return Response.json({ ok: true, no_items: true, reason: "insufficient_secondary_developments", selected: selected.length, aiCalls: 0 });
  }

  const selectedItems: DailyBriefPacketItem[] = selected.flatMap((selectedCandidate) => {
    const sourceCandidate = candidates.find((candidate) => candidate.id === selectedCandidate.id);
    const packetRow = packetByCluster.get(selectedCandidate.clusterId);
    if (!sourceCandidate || !packetRow) return [];
    return [{
      candidateId: sourceCandidate.id,
      clusterId: sourceCandidate.cluster_id,
      editorialScore: sourceCandidate.editorial_score,
      recommendedFormat: sourceCandidate.recommended_format,
      packet: packetRow.packet_json,
    }];
  });
  if (selectedItems.length < MIN_BRIEF_ITEMS) {
    return Response.json({ ok: true, no_items: true, reason: "insufficient_packet_backed_developments", selected: selectedItems.length, aiCalls: 0 });
  }

  const { data: reservation, error: reserveError } = await db.rpc("newsroom_reserve_ai_generation", {
    p_site: SITE,
    p_kind: "briefing",
  });
  if (reserveError) return Response.json({ error: reserveError.message }, { status: 500 });
  if (!reservation?.reserved) {
    return Response.json({ ok: true, no_items: true, reason: "briefing_budget_exhausted", budget: reservation, aiCalls: 0 });
  }

  let generated = false;
  try {
    const ai = await runCloudflareJson<TexasDailyBriefDraft>({
      system: dailyBriefSystemPrompt(selectedItems.length),
      user: dailyBriefUserPrompt(selectedItems),
      maxTokens: 12000,
      maxAttempts: 1,
    });
    generated = true;
    const validation = validateDailyBriefDraft(ai.value, selectedItems);
    const status = validation.ok ? "GENERATED" : "REJECTED";

    const { data: briefRows, error: briefError } = await db.from("newsroom_daily_briefs").insert({
      brief_date: briefDate,
      mode,
      status,
      candidate_ids: selectedItems.map((item) => item.candidateId),
      cluster_ids: selectedItems.map((item) => item.clusterId),
      brief_json: ai.value,
      validation_reasons: validation.reasons,
      main_word_count: validation.mainWordCount,
      provider: ai.provider,
      model: ai.model,
      provider_attempts: ai.attempts,
    }).select("id").limit(1);
    if (briefError) throw new Error(briefError.message);
    const briefId = briefRows?.[0]?.id as string | undefined;

    if (!validation.ok || mode === "shadow") {
      await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: "briefing", p_success: true });
      return Response.json({
        ok: true,
        generated: true,
        published: false,
        mode,
        briefId,
        itemCount: selectedItems.length,
        candidateIds: selectedItems.map((item) => item.candidateId),
        clusterIds: selectedItems.map((item) => item.clusterId),
        validation,
        provider: ai.provider,
        model: ai.model,
        attempts: ai.attempts,
        aiCalls: 1,
      });
    }

    const bodyJson = dailyBriefBodyJson(ai.value, selectedItems, briefDate);
    const sourceRows = selectedItems.flatMap((item) => item.packet.sources);
    const primary = sourceRows.find((source) => source.isPrimarySource) ?? sourceRows[0];
    const slug = `${briefDate}-texas-daily-brief`;
    const row = {
      slug,
      internal_url: `/news/${slug}`,
      is_ingested: false,
      category: "Texas News",
      title: ai.value.title.slice(0, 200),
      dek: ai.value.dek.slice(0, 400),
      source_name: primary?.source ?? "Keep TX Red newsroom packet",
      source_url: primary?.url ?? null,
      published_at: now.toISOString(),
      score: Math.max(...selectedItems.map((item) => item.editorialScore)),
      is_breaking: false,
      kind: "news",
      body: bodyText(bodyJson),
      body_json: bodyJson,
    };
    enrichArticleRow(row);

    const { data: articles, error: articleError } = await db
      .from("daily_articles")
      .upsert(row, { onConflict: "slug" })
      .select("id")
      .limit(1);
    if (articleError) throw new Error(articleError.message);
    const articleId = articles?.[0]?.id as string | undefined;

    await db.from("newsroom_daily_briefs").update({
      status: "PUBLISHED",
      published_article_id: articleId ?? null,
    }).eq("id", briefId);
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: "briefing", p_success: true });

    return Response.json({
      ok: true,
      generated: true,
      published: true,
      briefId,
      articleId,
      slug,
      itemCount: selectedItems.length,
      validation,
      provider: ai.provider,
      model: ai.model,
      attempts: ai.attempts,
      aiCalls: 1,
    });
  } catch (error) {
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: "briefing", p_success: generated });
    return Response.json({ error: "Texas Daily Brief generation failed", details: String(error) }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/hooks/generate-daily-brief")({
  server: { handlers: { POST: handler } },
});
