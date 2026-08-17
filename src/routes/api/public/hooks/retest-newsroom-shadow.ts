import { createFileRoute } from "@tanstack/react-router";
import { runCloudflareJson } from "@/lib/cloudflare-json-ai.server";
import {
  categoryForPillar,
  NEWSROOM_DRAFT_JSON_SCHEMA,
  newsroomRewriteSystemPrompt,
  newsroomRewriteUserPrompt,
  normalizeNewsroomDraft,
  validateNewsroomDraft,
  type NewsroomDraft,
} from "@/lib/newsroom-rewrite-adapter";
import {
  compactResearchPacket,
  researchPacketEvidenceChars,
  type ResearchPacket,
} from "@/lib/newsroom-research-packet";

const SITE = "keeptxred";
const STANDARD_MIN_SOURCE_EVIDENCE_CHARS = 5_000;
const LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS = 9_000;

type CandidateRow = {
  id: string;
  cluster_id: string;
  editorial_score: number;
  recommended_format: string;
  status: string;
};
type ClusterRow = { id: string; pillar_slug: string | null };
type PacketRow = { cluster_id: string; packet_json: ResearchPacket; source_count: number; primary_source_count: number };

function authorized(request: Request): boolean {
  const expected = process.env.NEWSROOM_HOOK_TOKEN;
  return Boolean(expected && request.headers.get("x-newsroom-hook-token") === expected);
}

function evidenceFloorForPillar(pillar: string | null): number {
  const category = categoryForPillar(pillar).toLowerCase();
  return category === "sports" || category === "education" || category === "non-political"
    ? LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS
    : STANDARD_MIN_SOURCE_EVIDENCE_CHARS;
}

async function handler({ request }: { request: Request }) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.NEWSROOM_AI_ENABLED !== "true") {
    return Response.json({ ok: false, disabled: true, reason: "newsroom_ai_disabled" }, { status: 503 });
  }
  if (process.env.NEWSROOM_PUBLISH_ENABLED === "true") {
    return Response.json({ ok: false, disabled: true, reason: "shadow_retest_requires_publish_disabled" }, { status: 503 });
  }

  const requestUrl = new URL(request.url);
  const excludedCandidateIds = new Set(requestUrl.searchParams.getAll("exclude").filter(Boolean));

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Newsroom tables intentionally lead generated Supabase types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;

  const { data: rejectedData, error: rejectedError } = await db
    .from("newsroom_generation_drafts")
    .select("candidate_id,cluster_id,created_at")
    .eq("mode", "shadow")
    .eq("status", "REJECTED")
    .order("created_at", { ascending: false })
    .limit(100);
  if (rejectedError) return Response.json({ error: rejectedError.message }, { status: 500 });

  const rejectedCandidateIds = [...new Set((rejectedData ?? []).map((row: { candidate_id: string }) => row.candidate_id))];
  if (!rejectedCandidateIds.length) {
    return Response.json({ ok: true, no_items: true, reason: "no_rejected_shadow_candidates", aiCalls: 0 });
  }

  const [candidateResult, generatedResult] = await Promise.all([
    db.from("news_publish_candidates")
      .select("id,cluster_id,editorial_score,recommended_format,status")
      .in("id", rejectedCandidateIds)
      .in("status", ["PENDING", "HELD"])
      .in("recommended_format", ["SINGLE", "MERGE", "SYNTHESIS"]),
    db.from("newsroom_generation_drafts")
      .select("candidate_id")
      .eq("mode", "shadow")
      .eq("status", "GENERATED")
      .in("candidate_id", rejectedCandidateIds),
  ]);
  if (candidateResult.error) return Response.json({ error: candidateResult.error.message }, { status: 500 });
  if (generatedResult.error) return Response.json({ error: generatedResult.error.message }, { status: 500 });

  const alreadyValid = new Set<string>((generatedResult.data ?? []).map((row: { candidate_id: string }) => row.candidate_id));
  const candidates = ((candidateResult.data ?? []) as CandidateRow[])
    .filter((row) => !alreadyValid.has(row.id) && !excludedCandidateIds.has(row.id))
    .sort((a, b) => b.editorial_score - a.editorial_score);
  if (!candidates.length) {
    return Response.json({ ok: true, no_items: true, reason: "no_retest_candidates", aiCalls: 0 });
  }

  const clusterIds = [...new Set(candidates.map((row) => row.cluster_id))];
  const [clusterResult, packetResult] = await Promise.all([
    db.from("news_story_clusters").select("id,pillar_slug").in("id", clusterIds),
    db.from("news_research_packets").select("cluster_id,packet_json,source_count,primary_source_count").in("cluster_id", clusterIds),
  ]);
  if (clusterResult.error) return Response.json({ error: clusterResult.error.message }, { status: 500 });
  if (packetResult.error) return Response.json({ error: packetResult.error.message }, { status: 500 });

  const clusterById = new Map<string, ClusterRow>(((clusterResult.data ?? []) as ClusterRow[]).map((row) => [row.id, row]));
  const packetByCluster = new Map<string, PacketRow>(((packetResult.data ?? []) as PacketRow[]).map((row) => [row.cluster_id, row]));
  const candidate = candidates.find((row) => {
    const cluster = clusterById.get(row.cluster_id);
    const packet = packetByCluster.get(row.cluster_id);
    if (!cluster || !packet || packet.source_count <= 0) return false;
    return researchPacketEvidenceChars(packet.packet_json) >= evidenceFloorForPillar(cluster.pillar_slug);
  });
  if (!candidate) {
    return Response.json({ ok: true, no_items: true, reason: "insufficient_source_evidence", aiCalls: 0 });
  }

  const cluster = clusterById.get(candidate.cluster_id)!;
  const packetRow = packetByCluster.get(candidate.cluster_id)!;
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

  await db.from("news_publish_candidates").update({ status: "SELECTED", selected_at: new Date().toISOString() }).eq("id", candidate.id);

  let generated = false;
  try {
    const ai = await runCloudflareJson<NewsroomDraft>({
      system: newsroomRewriteSystemPrompt(packet),
      user: newsroomRewriteUserPrompt(packet),
      maxTokens: 12000,
      maxAttempts: 1,
      jsonSchema: NEWSROOM_DRAFT_JSON_SCHEMA,
    });
    generated = true;
    const draft = normalizeNewsroomDraft(ai.value) as NewsroomDraft;
    const validation = validateNewsroomDraft(draft, packet);

    const { data: draftRows, error: draftError } = await db.from("newsroom_generation_drafts").insert({
      candidate_id: candidate.id,
      cluster_id: candidate.cluster_id,
      mode: "shadow",
      status: validation.ok ? "GENERATED" : "REJECTED",
      draft_json: draft,
      validation_reasons: validation.reasons,
      main_word_count: validation.mainWordCount,
      provider: ai.provider,
      model: ai.model,
      provider_attempts: ai.attempts,
    }).select("id").limit(1);
    if (draftError) throw new Error(draftError.message);

    await db.from("news_publish_candidates").update({ status: "HELD" }).eq("id", candidate.id);
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: true });

    return Response.json({
      ok: true,
      generated: true,
      published: false,
      mode: "shadow",
      retest: true,
      candidateId: candidate.id,
      clusterId: candidate.cluster_id,
      draftId: draftRows?.[0]?.id,
      editorialScore: candidate.editorial_score,
      recommendedFormat: candidate.recommended_format,
      sourceCount: packetRow.source_count,
      primarySourceCount: packetRow.primary_source_count,
      evidenceChars,
      evidenceFloor,
      validation,
      provider: ai.provider,
      model: ai.model,
      attempts: ai.attempts,
      aiCalls: 1,
    });
  } catch (error) {
    await db.from("news_publish_candidates").update({ status: "HELD" }).eq("id", candidate.id);
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: generated });
    return Response.json({
      error: error instanceof Error ? error.message : String(error),
      candidateId: candidate.id,
      clusterId: candidate.cluster_id,
      aiCalls: generated ? 1 : 0,
    }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/hooks/retest-newsroom-shadow")({
  server: {
    handlers: {
      POST: handler,
    },
  },
});
