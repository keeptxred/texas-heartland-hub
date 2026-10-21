import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(new URL("../../../../.github/workflows/sync-texas-legislation.yml", import.meta.url), "utf8");
const proxy = readFileSync(new URL("./legislation-sync-proxy.$.ts", import.meta.url), "utf8");

const CANONICAL_PROXY = "https://keeptxred.com/api/admin/legislation-sync-proxy";

describe("legislation sync Worker proxy contract", () => {
  it("routes GitHub-hosted sync traffic directly through the canonical Worker origin", () => {
    expect(workflow).toContain(`SUPABASE_URL: ${CANONICAL_PROXY}`);
    expect(workflow).not.toContain("SUPABASE_URL: https://keeptxred-site.freddy-coppola.workers.dev/api/admin/legislation-sync-proxy");
    expect(workflow).toContain("workers.dev permanently redirects to keeptxred.com");
    expect(workflow).toContain("strips Authorization on a cross-origin redirect");
    expect(workflow).toContain("SUPABASE_SERVICE_ROLE_KEY: ${{ github.token }}");
    expect(workflow).not.toContain("${{ github.token }}::${{ github.run_id }}");
  });

  it("authenticates the exact active main workflow run from the packed short-lived credential", () => {
    expect(proxy).toContain('const EXPECTED_REPOSITORY = "keeptxred/texas-heartland-hub"');
    expect(proxy).toContain('const EXPECTED_WORKFLOW = ".github/workflows/sync-texas-legislation.yml"');
    expect(proxy).toContain('request.headers.get("x-github-run-id")');
    expect(proxy).toContain('request.headers.get("x-github-repository")');
    expect(proxy).toContain('bearer.lastIndexOf("::")');
    expect(proxy).toContain('run?.head_branch === "main"');
    expect(proxy).toContain('["schedule", "workflow_dispatch"].includes');
    expect(proxy).toContain('["queued", "in_progress"].includes');
    const syncScript = readFileSync(new URL("../../../../scripts/legislature/sync-texas-legislation.mjs", import.meta.url), "utf8");
    const subjectSyncScript = readFileSync(new URL("../../../../scripts/legislature/sync-bill-subjects.mjs", import.meta.url), "utf8");
    const relationshipSyncScript = readFileSync(new URL("../../../../scripts/legislature/link-bill-relationships.mjs", import.meta.url), "utf8");
    for (const script of [syncScript, subjectSyncScript, relationshipSyncScript]) {
      expect(script).toContain("'X-GitHub-Run-Id': process.env.GITHUB_RUN_ID");
      expect(script).toContain("'X-GitHub-Repository': process.env.GITHUB_REPOSITORY");
    }
  });

  it("keeps database access restricted to legislative tables and explicit RPCs", () => {
    expect(proxy).toContain('const ALLOWED_RPCS = new Set([');
    expect(proxy).toContain('"upsert_bidirectional_authority_relationship"');
    expect(proxy).toContain('"refresh_bill_relationships"');
    expect(proxy).toContain('"refresh_bill_committee_activity_edges"');
    expect(proxy).toContain('"prune_unapproved_bill_article_authority_edges"');
    expect(proxy).toContain('/^(?:bills|bill_[a-z0-9_]+|legislative_[a-z0-9_]+)$/i');
    expect(proxy).not.toContain("service_role");
  });
});
