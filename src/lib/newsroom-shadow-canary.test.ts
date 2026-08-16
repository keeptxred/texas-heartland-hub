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
    expect(generator).toContain("maxAttempts: 1");
  });

  it("requires the exact newsroom shape through Cloudflare JSON schema mode", () => {
    expect(generator).toContain("jsonSchema: NEWSROOM_DRAFT_JSON_SCHEMA");
    expect(cloudflare).toContain('{ type: "json_schema", json_schema: input.jsonSchema }');
    expect(adapter).toContain('required: ["brief", "title", "dek", "summary", "relevance", "sections", "keyTakeaways", "faq"]');
    expect(adapter).toContain('required: ["heading", "paragraphs"]');
    expect(adapter).toContain('required: ["q", "a"]');
  });

  it("never retries a failed generation endpoint request as another paid call", () => {
    expect(workflow).toContain("curl --max-time 110 --fail-with-body");
    expect(workflow).not.toContain("for attempt in $(seq 1 8)");
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
    expect(generator).toContain('reason: requestedMode === "shadow" ? "no_unshadowed_candidates"');
  });
});
