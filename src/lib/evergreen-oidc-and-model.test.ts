import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { DEFAULT_CLOUDFLARE_JSON_MODEL, runCloudflareJson } from "./cloudflare-json-ai.server";

const hook = readFileSync(new URL("../routes/api/public/hooks/generate-evergreen.ts", import.meta.url), "utf8");
const workflow = readFileSync(new URL("../../.github/workflows/generate-evergreen.yml", import.meta.url), "utf8");

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("verified Cloudflare AI model and private evergreen writer", () => {
  it("defaults to an existing 8B model verified through Cloudflare model search/schema, not withdrawn fast alias", () => {
    expect(DEFAULT_CLOUDFLARE_JSON_MODEL).toBe("@cf/meta/llama-3.1-8b-instruct-fp8");
    expect(DEFAULT_CLOUDFLARE_JSON_MODEL).not.toBe("@cf/meta/llama-3.1-8b-instruct-fast");
  });

  it("builds a bounded JSON-mode request for the verified model without disclosing a secret", async () => {
    vi.stubEnv("AI_REWRITE_MODEL_CF", "");
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "test-account");
    vi.stubEnv("CLOUDFLARE_API_TOKEN", "test-secret-do-not-log");
    const requests: Array<{url: string; options: RequestInit}> = [];
    vi.stubGlobal("fetch", async (url: string, options: RequestInit) => {
      requests.push({ url, options });
      return new Response(JSON.stringify({
        success: true,
        result: { response: JSON.stringify({ title: "Texas government processes" }) },
      }), { status: 200, headers: { "content-type": "application/json" } });
    });
    const result = await runCloudflareJson<{title:string}>({
      system: "Produce verified article JSON", user: "Texas governmental authority",
      maxAttempts: 1, maxTokens: 6000,
    });
    expect(result.model).toBe(DEFAULT_CLOUDFLARE_JSON_MODEL);
    expect(result.value.title).toBe("Texas government processes");
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toContain("/ai/run/@cf/meta/llama-3.1-8b-instruct-fp8");
    expect(JSON.parse(String(requests[0].options.body)).response_format.type).toBe("json_object");
    expect(JSON.parse(String(requests[0].options.body)).max_tokens).toBe(6000);
  });

  it("requires GitHub OIDC before reading the service-role key or invoking paid AI", () => {
    const gate = hook.indexOf("await verifyGitHubActionsOidc({");
    const credentials = hook.indexOf("const supabaseUrl =");
    expect(gate).toBeGreaterThan(0);
    expect(credentials).toBeGreaterThan(gate);
    expect(hook).toContain('audience: "keeptxred-evergreen"');
    expect(hook).toContain('workflowPath: ".github/workflows/generate-evergreen.yml"');
    expect(hook).toContain('allowedEventNames: ["schedule", "workflow_dispatch"]');
    expect(hook).toContain('status: 401, headers: { "Cache-Control": "no-store" }');
    expect(hook).toContain('status: 403, headers: { "Cache-Control": "no-store" }');
    expect(hook).toContain("maxTokens: 6000");
    expect(hook).toContain("if (mainWordCount < EVERGREEN_MIN_MAIN_WORDS)");
  });

  it("runs twice daily via GitHub Actions and verifies a successfully published slug", () => {
    expect(workflow).toContain("30 8 * * *");
    expect(workflow).toContain("0 18 * * *");
    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("audience=keeptxred-evergreen");
    expect(workflow).toContain("Authorization: Bearer");
    expect(workflow).toContain(".ok == true");
    expect(workflow).toContain("cancel-in-progress: false");
    expect(workflow).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });
});
