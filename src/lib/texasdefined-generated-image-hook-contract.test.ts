import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const routePath = path.join(
  process.cwd(),
  "src/routes/api/public/hooks/publish-texasdefined-generated-image.ts",
);
const source = fs.readFileSync(routePath, "utf8");

describe("TexasDefined generated-image Facebook receiver contract", () => {
  it("keeps the hook restricted to the TexasDefined workflow identity", () => {
    for (const marker of [
      'const OIDC_AUDIENCE = "keeptxred-facebook"',
      'const REPOSITORY = "keeptxred/TexasDefined"',
      'const WORKFLOW_PATH = ".github/workflows/auto-facebook-engagement.yml"',
      "const claims = await verifyGitHubActionsOidc({",
      'typeof claims.run_id !== "string"',
      "oidcRunId = claims.run_id",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("requires the exact attributed PNG and SHA before Facebook", () => {
    for (const marker of [
      'imageValue.type !== "image/png"',
      '!imageValue.name.toLowerCase().endsWith(".png")',
      'error: "Generated Facebook asset must be the attributed PNG"',
      "actualSha.toLowerCase() !== expectedShaValue.toLowerCase()",
      'error: "Generated Facebook image changed after storage"',
      'body.set("source", new Blob([bytes], { type: "image/png" }), imageValue.name)',
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("requires a real source post ID instead of falling back to unknown", () => {
    expect(source).toContain("SOURCE_POST_ID_PATTERN");
    expect(source).toContain('error: "Valid TexasDefined source post ID is required"');
    expect(source).not.toContain(': "unknown"');
  });

  it("requires matching TexasDefined GitHub run and artifact provenance", () => {
    for (const marker of [
      'const TEXASDEFINED_GITHUB_PATH = "/keeptxred/TexasDefined"',
      "/actions/runs/(\\\\d+)$",
      "/actions/runs/(\\\\d+)/artifacts/(\\\\d+)$",
      "runMatch[1] !== artifactMatch[1]",
      'error: "Matching TexasDefined GitHub artifact and workflow run URLs are required"',
      "provenance.runId !== oidcRunId",
      'error: "TexasDefined GitHub run provenance does not match the signed OIDC run ID"',
      "github_run_id: provenance.runId",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("keeps fallback publishing disabled", () => {
    expect(source).toContain("text_only_fallback: false");
    expect(source).toContain("generic_fallback: false");
  });
});
