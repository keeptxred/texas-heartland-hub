import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildResearchPacket, type ResearchPacket } from "./newsroom-research-packet";
import {
  evaluateResearchRescue,
  isRecoverableResearchFailure,
  type RecoverableResearchCandidate,
} from "./newsroom-research-rescue";

const NOW = Date.parse("2026-11-09T23:50:00Z");
function packet(sentences = 110, primary = true): ResearchPacket {
  return buildResearchPacket({
    clusterId: "verified-cluster",
    subject: "SB 49 introduced",
    pillar: "texas-politics",
    recommendedFormat: "SINGLE",
    editorialScore: 95,
    sources: [{
      feedItemId: 10,
      source: "Texas Legislature Online",
      title: "Senate Bill 49 introduced in the 90th Legislature",
      url: "https://capitol.texas.gov/tlodocs/90R/billtext/html/SB00049I.htm",
      publishedAt: "2026-11-09T12:00:00Z",
      description: "",
      isPrimarySource: primary,
      sourceReputationScore: 95,
      extractedBody: Array.from({ length: sentences }, (_, i) =>
        `Research evidence item ${i + 1} is a distinct sourced legislative provision with a factual explanation and a verified location in the complete original bill text.`
      ).join(" "),
    }],
  });
}
function candidate(overrides: Partial<RecoverableResearchCandidate> = {}): RecoverableResearchCandidate {
  return {
    status: "HELD",
    rejection_reason: "publication_failed: Cloudflare Workers AI request timed out after 55000ms",
    created_at: "2026-11-09T21:50:00Z",
    updated_at: "2026-11-09T22:20:00Z",
    score_breakdown: {},
    ...overrides,
  };
}
describe("zero-AI failed-story research rescue", () => {
  it("recovers a recent, source-rich transient AI timeout once", () => {
    const d = evaluateResearchRescue({ candidate: candidate(), packet: packet(), previousPacket: packet(), nowMs: NOW });
    expect(d.retry).toBe(true);
    expect(d.reason).toBe("transient_provider");
    expect(d.evidenceChars).toBeGreaterThan(5000);
  });

  it("recovers a fresh schema incompatibility but never editorially rejected stories", () => {
    const c = candidate({ rejection_reason: "publication_failed: Cloudflare Workers AI 403: AiError: Ai: This model doesn't support JSON Schema." });
    expect(evaluateResearchRescue({ candidate: c, packet: packet(), previousPacket: packet(), nowMs: NOW }).retry).toBe(true);
    for (const bad of ["superseded_empty_reconciled_newsroom_cluster", "image_verification_failed",
      "outdated police alert", "fabricated quote", "recovery_draft_failed_revalidation:repeated"]) {
      expect(isRecoverableResearchFailure(candidate({ rejection_reason: bad }))).toBe(false);
    }
  });

  it("retries a source-dependent draft only after new, substantive, validated source research", () => {
    const c = candidate({ status: "REJECTED", rejection_reason: "tiered_main_word_count:341/800,below_news_word_floor" });
    expect(evaluateResearchRescue({
      candidate: c, packet: packet(125), previousPacket: packet(25), nowMs: NOW,
    }).reason).toBe("new_source_evidence");
    expect(evaluateResearchRescue({
      candidate: c, packet: packet(60), previousPacket: packet(60), nowMs: NOW,
    }).retry).toBe(false);
    expect(evaluateResearchRescue({
      candidate: c, packet: packet(125), previousPacket: null, nowMs: NOW,
    }).retry).toBe(false);
  });

  it("never reopens old events, early retries, repeats, empty bodies or non-primary single-source leads", () => {
    const bad: Partial<RecoverableResearchCandidate>[] = [
      { created_at: "2026-11-04T12:00:00Z" },
      { updated_at: "2026-11-09T23:40:00Z" },
      { score_breakdown: { research_rescue: { attempts: 1 } } },
      { status: "PUBLISHED" },
    ];
    for (const overrides of bad) {
      expect(evaluateResearchRescue({
        candidate: candidate(overrides), packet: packet(), previousPacket: packet(), nowMs: NOW,
      }).retry).toBe(false);
    }
    expect(evaluateResearchRescue({
      candidate: candidate(), packet: packet(10), previousPacket: packet(10), nowMs: NOW,
    }).retry).toBe(false);
    expect(evaluateResearchRescue({
      candidate: candidate(), packet: packet(110, false), previousPacket: packet(110, false), nowMs: NOW,
    }).retry).toBe(false);
  });
});


describe("protected research rescue execution", () => {
  it("requires signed GitHub OIDC before requeue and leaves unsigned research reads non-publishing", () => {
    const builder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");
    const workflow = readFileSync(".github/workflows/run-daily-news-now.yml", "utf8");
    expect(builder).toContain("verifyGitHubActionsOidc({");
    expect(builder).toContain(String.raw`auth.match(/^Bearer\s+(.+)$/i)`);
    expect(builder).not.toContain(String.raw`auth.match(/^Bearer\\s+(.+)$/i)`);

    expect(builder).toContain('workflowPath: ".github/workflows/run-daily-news-now.yml"');
    expect(builder).toContain("researchRequeueAuthorized ? recoverable : []");
    expect(builder).toContain("researchRescueAuthorized: researchRequeueAuthorized");
    expect(builder).toContain('status: "PENDING"');
    expect(workflow).toContain("refresh_newsroom_oidc");
    expect(workflow).toContain('extra_headers=(-H "Authorization: Bearer ${oidc_token}")');
    expect(workflow).toContain("run_zero_ai_stage packets build-newsroom-research-packets 180");
  });
});
