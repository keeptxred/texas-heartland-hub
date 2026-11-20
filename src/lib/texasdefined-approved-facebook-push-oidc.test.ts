import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("TexasDefined approved Facebook post OIDC boundary", () => {
  const authorized = readFileSync(
    new URL("../routes/api/public/hooks/publish-texasdefined-generated-image.ts", import.meta.url),
    "utf8",
  );
  const verifier = readFileSync(new URL("./github-actions-oidc.ts", import.meta.url), "utf8");

  it("allows push only for the existing dedicated TexasDefined photo publisher", () => {
    expect(authorized).toContain('const REPOSITORY = "keeptxred/TexasDefined"');
    expect(authorized).toContain('const WORKFLOW_PATH = ".github/workflows/auto-facebook-engagement.yml"');
    expect(authorized).toContain('allowedEventNames: ["workflow_dispatch", "push"]');
    expect(authorized).toContain("verifyGitHubActionsOidc");
    expect(verifier).toContain('claims.ref !== "refs/heads/main"');
    expect(verifier).toContain("claims.workflow_ref !== expectedWorkflowRef");
  });

  it("continues to require artifact integrity, correct user text and duplicate checks", () => {
    for (const marker of [
      "provenance.runId !== oidcRunId",
      "expectedShaValue",
      "actualSha",
      "TEXASDEFINED_IMAGE_ATTRIBUTION",
      "fetchRecentFacebookPagePosts",
      "normalizeFacebookHeadline(postText)",
      "body.set(\"source\"",
    ]) {
      expect(authorized).toContain(marker);
    }
  });
});
