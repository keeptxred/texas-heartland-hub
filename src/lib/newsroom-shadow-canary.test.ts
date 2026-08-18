import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(new URL("../../.github/workflows/newsroom-shadow-canary.yml", import.meta.url), "utf8");
const productionWorkflow = fs.readFileSync(new URL("../../.github/workflows/run-daily-news-now.yml", import.meta.url), "utf8");
const wrangler = fs.readFileSync(new URL("../../wrangler.jsonc", import.meta.url), "utf8");
const generator = fs.readFileSync(new URL("../routes/api/public/hooks/generate-newsroom.ts", import.meta.url), "utf8");
const cloudflare = fs.readFileSync(new URL("./cloudflare-json-ai.server.ts", import.meta.url), "utf8");
const adapter = fs.readFileSync(new URL("./newsroom-rewrite-adapter.ts", import.meta.url), "utf8");

describe("newsroom Phase 13 AI canary and production promotion", () => {
  it("enables newsroom AI and guarded publication mode", () => {
    expect(wrangler).toContain('"NEWSROOM_AI_ENABLED": "true"');
    expect(wrangler).toContain('"NEWSROOM_PUBLISH_ENABLED": "true"');
    expect(generator).toContain('process.env.NEWSROOM_PUBLISH_ENABLED !== "true"');
    expect(generator).toContain("verifyGitHubActionsOidc");
    expect(generator).toContain('PRODUCTION_WORKFLOW_PATH = ".github/workflows/run-daily-news-now.yml"');
  });

  it("keeps shadow as the canary default and limits an explicit publish canary to one article", () => {
    expect(workflow).toContain("generate-newsroom?mode=$RUN_MODE");
    expect(workflow).toContain("/run-phase13-shadow-canary-1");
    expect(workflow).toContain("/run-phase13-publish-canary-1");
    expect(workflow).toContain("'publish' || 'shadow'");
    expect(workflow).toContain('options:\n          - "1"\n          - "3"');
    expect(workflow).toContain('1|3)');
    expect(workflow).toContain('if [[ "$RUN_MODE" == "publish" && "$CANARY_COUNT" != "1" ]]');
    expect(workflow).toContain('if mode == "shadow" and data.get("published") is True');
    expect(workflow).toContain('if mode == "publish" and data.get("published") is not True');
    expect(generator).toContain("maxAttempts: 1");
  });

  it("refreshes the full deterministic newsroom pipeline before either canary mode without AI", () => {
    const generatorCall = workflow.indexOf("generate-newsroom?mode=$RUN_MODE");
    const deterministicLoop = workflow.indexOf("for endpoint in normalize-newsroom-feed cluster-newsroom-stories score-newsroom-stories decide-newsroom-packages; do");
    const packetBuild = workflow.indexOf("/api/public/hooks/build-newsroom-research-packets");
    expect(generatorCall).toBeGreaterThan(-1);
    expect(workflow).toContain("/api/public/hooks/enrich-newsroom-rss-evidence");
    expect(deterministicLoop).toBeGreaterThan(-1);
    expect(packetBuild).toBeGreaterThan(deterministicLoop);
    expect(packetBuild).toBeLessThan(generatorCall);
    expect(workflow.indexOf("/api/public/hooks/enrich-newsroom-rss-evidence")).toBeLessThan(deterministicLoop);
    expect(workflow).toContain('"$PRODUCTION_URL/api/public/hooks/$endpoint"');
    expect(workflow).toContain('int(data.get("aiCalls") or 0) != 0');
  });

  it("uses only quality-gated production paths before the curated reserve safety net", () => {
    const overdue = productionWorkflow.indexOf("publish-overdue-gap");
    const clustered = productionWorkflow.indexOf("generate-newsroom?mode=publish");
    const legacy = productionWorkflow.indexOf("/api/public/hooks/generate-news'");
    const safetyNet = productionWorkflow.indexOf("publishing-safety-net");
    expect(overdue).toBeGreaterThan(-1);
    expect(clustered).toBeGreaterThan(overdue);
    expect(legacy).toBe(-1);
    expect(safetyNet).toBeGreaterThan(clustered);
    expect(productionWorkflow).toContain("score-newsroom-stories");
    expect(productionWorkflow).toContain("decide-newsroom-packages");
    expect(productionWorkflow).toContain('(.aiCalls // 0) == 0');
    expect(productionWorkflow).toContain('Authorization: Bearer ${oidc_token}');
    expect(productionWorkflow).toContain("No lower-quality writer will be attempted.");
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

  it("validates prose before publication source URLs are assembled", () => {
    expect(adapter).toContain("editorialMinimumFor(categoryForPillar(packet.pillar))");
    expect(adapter).toContain('if (mainWordCount < requiredMainWords) reasons.push("below_news_word_floor")');
    expect(adapter).not.toContain('meetsArticleMainWordCount("news", bodyJson)');
  });

  it("retries only pre-AI 401 auth propagation and never retries a paid transport failure", () => {
    expect(workflow).toContain("for auth_attempt in $(seq 1 12)");
    expect(workflow).toContain("-w '%{http_code}'");
    expect(workflow).toContain('if [[ "$status" == "401" ]]');
    expect(workflow).toContain("retrying auth only");
    expect(workflow).toContain('if [[ ! "$status" =~ ^2[0-9][0-9]$ ]]');
    expect(workflow).toContain("Newsroom canary request $i failed with HTTP $status");
    expect(workflow).not.toContain("for attempt in $(seq 1 8)");
    expect(generator).toContain("maxAttempts: 1");
    expect(generator).toContain("aiCalls += 1");
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
