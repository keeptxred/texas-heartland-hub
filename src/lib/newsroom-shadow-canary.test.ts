import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(new URL("../../.github/workflows/newsroom-shadow-canary.yml", import.meta.url), "utf8");
const wrangler = fs.readFileSync(new URL("../../wrangler.jsonc", import.meta.url), "utf8");
const generator = fs.readFileSync(new URL("../routes/api/public/hooks/generate-newsroom.ts", import.meta.url), "utf8");
const cloudflare = fs.readFileSync(new URL("./cloudflare-json-ai.server.ts", import.meta.url), "utf8");
const adapter = fs.readFileSync(new URL("./newsroom-rewrite-adapter.ts", import.meta.url), "utf8");

describe("newsroom Phase 13 AI shadow canary", () => {
  it("enables AI only with publication explicitly disabled", () => {
    expect(wrangler).toContain('"NEWSROOM_AI_ENABLED": "true"');
    expect(wrangler).toContain('"NEWSROOM_PUBLISH_ENABLED": "false"');
    expect(generator).toContain('process.env.NEWSROOM_PUBLISH_ENABLED !== "true"');
  });

  it("uses only shadow mode and limits the canary to at most three calls", () => {
    expect(workflow).toContain("generate-newsroom?mode=shadow");
    expect(workflow).not.toContain("generate-newsroom?mode=publish");
    expect(workflow).toContain('options:\n          - "1"\n          - "3"');
    expect(workflow).toContain('1|3)');
    expect(workflow).toContain("/run-phase13-shadow-canary-1");
    expect(workflow).toContain("github.event.comment.body == '/run-phase13-shadow-canary-1' && '1'");
    expect(generator).toContain("maxAttempts: 1");
  });

  it("refreshes research packets immediately before the canary without AI", () => {
    expect(workflow).toContain("Refresh zero-AI research packets");
    expect(workflow).toContain("/api/public/hooks/build-newsroom-research-packets");
    expect(workflow).toContain('int(data.get("aiCalls") or 0) != 0');
    expect(workflow.indexOf("Refresh zero-AI research packets")).toBeLessThan(workflow.indexOf("Generate isolated AI shadow drafts"));
  });

  it("requires the exact newsroom shape through Cloudflare JSON schema mode", () => {
    expect(generator).toContain("jsonSchema: NEWSROOM_DRAFT_JSON_SCHEMA");
    expect(cloudflare).toContain('{ type: "json_schema", json_schema: input.jsonSchema }');
    expect(adapter).toContain('required: ["brief", "title", "dek", "summary", "relevance", "sections", "keyTakeaways", "faq"]');
    expect(adapter).toContain('required: ["heading", "paragraphs"]');
    expect(adapter).toContain('required: ["q", "a"]');
    expect(adapter).toContain("minItems: 6");
    expect(adapter).toContain("maxItems: 6");
    expect(adapter).toContain("minItems: 3");
    expect(adapter).toContain("maxItems: 3");
    expect(adapter).toContain('minLength: 380');
  });

  it("skips sparse deduplicated research packets before reserving an AI generation", () => {
    expect(generator).toContain("STANDARD_MIN_SOURCE_EVIDENCE_CHARS = 5_000");
    expect(generator).toContain("LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS = 9_000");
    expect(generator).toContain("researchPacketEvidenceChars(packetRow.packet_json) >= evidenceFloorForPillar(cluster.pillar_slug)");
    expect(generator).toContain("compactResearchPacket(packetRow.packet_json)");
    expect(generator).toContain('"insufficient_source_evidence"');
    expect(generator.indexOf("researchPacketEvidenceChars(packetRow.packet_json)")).toBeLessThan(generator.indexOf('db.rpc("newsroom_reserve_ai_generation"'));
  });

  it("retries only pre-AI 401 auth propagation and never retries a paid generation failure", () => {
    expect(workflow).toContain("for auth_attempt in $(seq 1 12)");
    expect(workflow).toContain("-w '%{http_code}'");
    expect(workflow).toContain('if [[ "$status" == "401" ]]');
    expect(workflow).toContain("retrying auth only");
    expect(workflow).toContain('if [[ ! "$status" =~ ^2[0-9][0-9]$ ]]');
    expect(workflow).toContain("Shadow generation request $i failed with HTTP $status");
    expect(workflow).not.toContain("for attempt in $(seq 1 8)");
    expect(generator).toContain("maxAttempts: 1");
    expect(cloudflare).toContain("requestTimeoutMs");
    expect(cloudflare).toContain("controller.abort()");
  });

  it("installs a temporary random hook token and removes it after the canary", () => {
    expect(workflow).toContain("openssl rand -hex 32");
    expect(workflow).toContain("NEWSROOM_HOOK_TOKEN");
    expect(workflow).toContain("-X PUT");
    expect(workflow).toContain("-X DELETE");
    expect(workflow).toContain("trap cleanup EXIT");
  });

  it("keeps failed shadow validation out of editorial rejection state", () => {
    expect(generator).toContain('const shadowFailure = requestedMode === "shadow"');
    expect(generator).toContain('status: "HELD"');
    expect(generator).toContain('status: "REJECTED"');
    expect(generator).toContain('"no_unshadowed_candidates"');
  });
});
