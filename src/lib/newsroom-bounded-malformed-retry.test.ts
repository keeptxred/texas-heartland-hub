import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync(
  new URL("../routes/api/public/hooks/generate-newsroom.ts", import.meta.url),
  "utf8",
);

describe("bounded newsroom malformed-JSON recovery", () => {
  it("caps initial schema parsing retries and honors existing editorial source gates", () => {
    expect(generator).toContain("maxAttempts: 2,");
    expect(generator).toContain("requestTimeoutMs: 45_000,");
    expect(generator).toContain("ai.attempts === 1 && !validation.ok");
    expect(generator).toContain("let aiCalls = recoverSavedDraft ? 0 : ai.attempts;");
    expect(generator).toContain("let providerAttempts = ai.attempts;");
    expect(generator).toContain("researchPacketEvidenceChars");
    expect(generator).toContain("newsroomHasPublisherDiversity(sources)");
    const repair = generator.slice(generator.indexOf("const repaired = await runCloudflareJson<NewsroomDraft>"));
    expect(repair).toContain("maxAttempts: 1,");
    expect(repair).toContain("validateNewsroomDraft(draft, packet)");
    expect(generator).toContain('status: "REJECTED"');
  });
});
