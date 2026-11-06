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
