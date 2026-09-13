import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(
  ".github/workflows/verify-texasdefined-image-receiver-production.yml",
  "utf8",
);
const deployWorkflow = readFileSync(
  ".github/workflows/deploy-cloudflare-after-verify.yml",
  "utf8",
);

describe("TexasDefined generated-image receiver production smoke", () => {
  it("runs after both production deployment workflows and repository verification", () => {
    expect(workflow).toContain('"Repository test and build health"');
    expect(workflow).toContain('"Deploy verified KeepTXRed to Cloudflare"');
    expect(workflow).toContain('"Deploy KeepTXRed to Cloudflare Workers"');
  });

  it("waits for the verified deployment only when triggered by repository health", () => {
    expect(workflow).toContain(
      "github.event.workflow_run.name == 'Repository test and build health'",
    );
    expect(workflow).toContain("deploy-cloudflare-after-verify.yml");
  });

  it("keeps the live receiver fail-closed security contract", () => {
    expect(workflow).toContain("publish-texasdefined-generated-image");
    expect(workflow).toContain('if [[ "$status" != "401" ]]');
    expect(workflow).toContain("Missing GitHub Actions OIDC token");
    expect(workflow).toContain("data.get('ok') is not False");
    expect(workflow).toContain("data.get('posted') is not False");
  });

  it("makes receiver rejection part of the verified production deployment chain", () => {
    expect(deployWorkflow).toContain(
      "Verify TexasDefined generated-image receiver rejects unauthenticated publishing",
    );
    expect(deployWorkflow).toContain("publish-texasdefined-generated-image");
    expect(deployWorkflow).toContain('if [[ "$status" != "401" ]]');
    expect(deployWorkflow).toContain("Missing GitHub Actions OIDC token");
    expect(deployWorkflow).toContain("data.get('ok') is not False");
    expect(deployWorkflow).toContain("data.get('posted') is not False");
  });
});