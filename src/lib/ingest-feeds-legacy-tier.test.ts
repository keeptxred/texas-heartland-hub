import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./ingest-feeds-legacy.ts", import.meta.url), "utf8");

describe("feed-item publisher evidence-driven rewrite contract", () => {
  it("uses the shared evidence-driven editorial minimum", () => {
    expect(source).toContain("editorialMinimumFor");
    expect(source).toContain("const target = editorialMinimumFor(");
    expect(source).toContain("Rewrite below tiered minimum (${words}/${target} words). Try again.");
  });

  it("keeps the shared two-call editorial repair ceiling", () => {
    expect(source).toContain("runEditorialRewrite<Rewrite>");
    expect(source).toContain("maxAttempts: 1");
    expect(source).not.toContain('attempt: "length-completion"');
  });

  it("uses the direct Cloudflare provider and keeps rewrite-budget accounting", () => {
    expect(source).toContain("runCloudflareJson");
    expect(source).toContain("claim_ai_rewrite_slot");
    expect(source).toContain("DAILY_AI_REWRITE_LIMIT");
    expect(source).toContain("CLOUDFLARE_ACCOUNT_ID");
    expect(source).toContain("CLOUDFLARE_API_TOKEN");
  });

  it("keeps source preflight and political authority validation", () => {
    expect(source).toContain("assessRewritePreflight");
    expect(source).toContain("assertRewriteableOrThrow");
    expect(source).toContain("validatePoliticalAuthority");
  });
});
