import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_CLOUDFLARE_JSON_MODEL,
  DEFAULT_CLOUDFLARE_SCHEMA_MODEL,
  runCloudflareJson,
} from "./cloudflare-json-ai.server";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("Cloudflare structured newsroom model compatibility", () => {
  it("uses the catalog-verified schema model, preserving the requested schema and one bounded call", async () => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "test-account");
    vi.stubEnv("CLOUDFLARE_API_TOKEN", "test-token");
    // A configured older 8B default must NOT be used for json_schema: production
    // returned 403 because that model does not support JSON Schema.
    vi.stubEnv("AI_REWRITE_MODEL_CF", DEFAULT_CLOUDFLARE_JSON_MODEL);
    vi.stubEnv("AI_REWRITE_SCHEMA_MODEL_CF", "");

    const requests: Array<{ url: string; options: RequestInit }> = [];
    vi.stubGlobal("fetch", async (url: string, options: RequestInit) => {
      requests.push({ url, options });
      // Cloudflare's compatible 70B provider returns a parsed response object.
      return new Response(JSON.stringify({ success: true, result: { response: { ok: true } } }), { status: 200 });
    });

    const schema = { type: "object", properties: { ok: { type: "boolean" } }, required: ["ok"] };
    const result = await runCloudflareJson<{ ok: boolean }>({
      system: "Return only sourced JSON",
      user: "verified data",
      jsonSchema: schema,
      maxTokens: 12000,
      maxAttempts: 1,
    });

    expect(DEFAULT_CLOUDFLARE_SCHEMA_MODEL).toBe("@cf/meta/llama-3.3-70b-instruct-fp8-fast");
    expect(result.model).toBe(DEFAULT_CLOUDFLARE_SCHEMA_MODEL);
    expect(result.value).toEqual({ ok: true });
    expect(result.attempts).toBe(1);
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toContain("/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast");
    const payload = JSON.parse(String(requests[0].options.body));
    expect(payload.response_format).toEqual({ type: "json_schema", json_schema: schema });
    expect(payload.max_tokens).toBe(12000);
  });

  it("recovers one malformed schema response with a bounded lower-temperature second call", async () => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "test-account");
    vi.stubEnv("CLOUDFLARE_API_TOKEN", "test-token");
    vi.stubEnv("AI_REWRITE_SCHEMA_MODEL_CF", "");
    const requests: Array<{ url: string; options: RequestInit }> = [];
    vi.stubGlobal("fetch", async (url: string, options: RequestInit) => {
      requests.push({ url, options });
      return new Response(JSON.stringify({
        success: true,
        result: {
          response: requests.length === 1
            ? '{"title":"incomplete"'
            : { title: "Original reporting passed source validation" },
        },
      }), { status: 200 });
    });
    const result = await runCloudflareJson<{ title: string }>({
      system: "Produce source-grounded verified newsroom JSON",
      user: "Real publisher packet",
      jsonSchema: { type: "object", properties: { title: { type: "string" } }, required: ["title"] },
      maxTokens: 12000,
      maxAttempts: 2,
      requestTimeoutMs: 45_000,
    });
    expect(result.attempts).toBe(2);
    expect(result.value.title).toBe("Original reporting passed source validation");
    expect(requests).toHaveLength(2);
    const initial = JSON.parse(String(requests[0].options.body));
    const retried = JSON.parse(String(requests[1].options.body));
    expect(initial.temperature).toBe(0.2);
    expect(retried.temperature).toBe(0.1);
    expect(retried.messages[0].content).toContain("previous response was malformed or truncated");
    expect(retried.response_format.type).toBe("json_schema");
  });

  it("parses the modern chat-completions envelope from Gemma 4 with thinking disabled", async () => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "test-account");
    vi.stubEnv("CLOUDFLARE_API_TOKEN", "test-token");
    const requests: Array<{ url: string; options: RequestInit }> = [];
    vi.stubGlobal("fetch", async (url: string, options: RequestInit) => {
      requests.push({ url, options });
      return new Response(JSON.stringify({
        success: true,
        result: {
          choices: [{
            index: 0,
            message: { role: "assistant", content: '{"title":"Verified news"}' },
            finish_reason: "stop",
          }],
        },
      }), { status: 200 });
    });
    const schema = { type: "object", properties: { title: { type: "string" } }, required: ["title"] };
    const result = await runCloudflareJson<{ title: string }>({
      system: "Return one verified JSON object",
      user: "source-backed story",
      modelOverride: "@cf/google/gemma-4-26b-a4b-it",
      disableThinking: true,
      jsonSchema: schema,
      maxTokens: 6500,
      maxAttempts: 1,
      requestTimeoutMs: 55_000,
    });
    expect(result.model).toBe("@cf/google/gemma-4-26b-a4b-it");
    expect(result.value.title).toBe("Verified news");
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toContain("/ai/run/@cf/google/gemma-4-26b-a4b-it");
    const payload = JSON.parse(String(requests[0].options.body));
    expect(payload.chat_template_kwargs).toEqual({ enable_thinking: false });
    expect(payload.response_format).toEqual({ type: "json_schema", json_schema: schema });
    expect(payload.max_tokens).toBe(6500);
  });

  it("rejects output-length-exhausted chat content, even if it looks like valid JSON", async () => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "test-account");
    vi.stubEnv("CLOUDFLARE_API_TOKEN", "test-token");
    vi.stubGlobal("fetch", async () => new Response(JSON.stringify({
      success: true,
      result: { choices: [{
        message: { content: '{"title":"Incomplete"}' },
        finish_reason: "length",
      }] },
    }), { status: 200 }));
    await expect(runCloudflareJson<{ title: string }>({
      system: "Verified JSON", user: "source-backed report",
      modelOverride: "@cf/google/gemma-4-26b-a4b-it",
      jsonSchema: { type: "object", properties: { title: { type: "string" } } },
      maxAttempts: 1,
    })).rejects.toThrow("truncated the JSON completion");
  });

  it("keeps lower-cost JSON-object requests on the existing 8B model", async () => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "test-account");
    vi.stubEnv("CLOUDFLARE_API_TOKEN", "test-token");
    vi.stubEnv("AI_REWRITE_MODEL_CF", "");
    vi.stubEnv("AI_REWRITE_SCHEMA_MODEL_CF", "");
    const requests: Array<{ url: string; options: RequestInit }> = [];
    vi.stubGlobal("fetch", async (url: string, options: RequestInit) => {
      requests.push({ url, options });
      return new Response(JSON.stringify({ success: true, result: { response: '{"ok":true}' } }), { status: 200 });
    });

    const result = await runCloudflareJson<{ ok: boolean }>({
      system: "Return JSON", user: "verified data", maxAttempts: 1,
    });
    expect(result.model).toBe(DEFAULT_CLOUDFLARE_JSON_MODEL);
    expect(result.value.ok).toBe(true);
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toContain("/ai/run/@cf/meta/llama-3.1-8b-instruct-fp8");
    expect(JSON.parse(String(requests[0].options.body)).response_format).toEqual({ type: "json_object" });
  });
});
