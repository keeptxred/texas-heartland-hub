import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(new URL("../../.github/workflows/newsroom-shadow-canary.yml", import.meta.url), "utf8");
const wrangler = fs.readFileSync(new URL("../../wrangler.jsonc", import.meta.url), "utf8");
const generator = fs.readFileSync(new URL("../routes/api/public/hooks/generate-newsroom.ts", import.meta.url), "utf8");

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
