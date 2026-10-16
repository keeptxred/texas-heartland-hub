import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const legacy = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");
const ensure = readFileSync(".github/workflows/ensure-cloudflare-production-current.yml", "utf8");
const canonical = readFileSync(".github/workflows/deploy-cloudflare-production.yml", "utf8");

describe("verified Cloudflare deployment reconciliation", () => {
  it("publishes the existing ensure-current status only after all legacy production gates", () => {
    expect(legacy).toContain("  statuses: write");
    expect(legacy).toContain("name: Record verified production-current status for deployment reconciliation");
    expect(legacy).toContain("if: steps.revision.outputs.deploy == 'true' && success()");
    expect(legacy).toContain('current_main="$(gh api "repos/$REPOSITORY/commits/main" --jq \'.sha\')"');
    expect(legacy).toContain('if [[ "$current_main" != "$VERIFIED_SHA" ]]');
    expect(legacy).toContain("-f context='keeptxred-production-current'");
    const health = legacy.indexOf("- name: Verify deployed Worker health and production edge route");
    const refs = legacy.indexOf("- name: Verify authority reference endpoints");
    const status = legacy.indexOf("- name: Record verified production-current status");
    expect(health).toBeGreaterThan(0);
    expect(refs).toBeGreaterThan(health);
    expect(status).toBeGreaterThan(refs);
  });

  it("preserves live production verification before the ensure-current workflow trusts that status", () => {
    expect(ensure).toContain("production_state");
    expect(ensure).toContain("if [[ \"$production_state\" == 'success' ]]");
    expect(ensure).toContain("expected_canonical='https://keeptxred.com/texas-government/fifteenth-court-of-appeals'");
    expect(ensure).toContain("production_current=true");
    expect(ensure).toContain("deploy=false");
  });

  it("does not race an active exact-main verified deploy with a duplicate custom-domain deploy", () => {
    expect(ensure).toContain('actions/workflows/deploy-cloudflare-after-verify.yml/runs?branch=main&per_page=100');
    expect(ensure).toContain("select(.status != \"completed\")");
    expect(ensure).toContain('expected="$main_sha"');
    expect(ensure).toContain('if [[ -n "$active_verified_run" ]]');
    const guard = ensure.indexOf('verified_deploy_runs="$(gh api');
    const fallback = ensure.indexOf('echo "Verified main $main_sha is not recorded as current in production; deployment is required."');
    expect(guard).toBeGreaterThan(0);
    expect(fallback).toBeGreaterThan(guard);
  });

  it("keeps strict deployment gates and serializes both production entrypoints", () => {
    expect(legacy).toContain("group: keeptxred-cloudflare-production");
    expect(canonical).toContain("group: keeptxred-cloudflare-production");
    expect(legacy).toContain("- name: Verify deployed Worker health and production edge route");
    expect(canonical).toContain("- name: Verify preview database and AI health");
    expect(canonical).toContain("- name: Verify promoted Worker health and production edge route");
  });
});
