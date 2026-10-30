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

  it("accepts successful automatic workflow_run deploys despite failed later manual duplicates", () => {
    // Production incident: 40935568994 succeeded via workflow_run, but the
    // old event=workflow_dispatch filter saw only failed 40935681682.
    expect(workflow).toContain("runs?branch=main&per_page=100");
    expect(workflow).not.toContain("event=workflow_dispatch&per_page=");
    expect(workflow).toContain('if run.get("head_sha") == expected]');
    expect(workflow).toContain('and run.get("conclusion") == "success"');
    expect(workflow).toContain("chosen = successful or running or (matching[0] if matching else None)");
  });

  it("does not comment out the deployed-runs API assignment with escaped newlines", () => {
    // A literal \\n in a shell comment suppressed the api= assignment and
    // failed production with 'api: unbound variable'. Keep each comment
    // on its own physical line before executing the lookup.
    const lookup = workflow.slice(
      workflow.indexOf("set -euo pipefail"),
      workflow.indexOf("for attempt in $(seq 1 72)"),
    );
    expect(lookup).not.toContain("\\\\n");
    expect(lookup).toMatch(/^\\s*api="https:\\/\\/api\\.github\\.com\\/repos\\/\\$\\{REPOSITORY\\}\\/actions\\/workflows\\/deploy-cloudflare-after-verify\\.yml\\/runs\\?branch=main&per_page=100"/m);
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