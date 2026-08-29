import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(new URL("../../../../../.github/workflows/sync-texas-legislation.yml", import.meta.url), "utf8");
const proxy = readFileSync(new URL("./legislation-sync-proxy.$.ts", import.meta.url), "utf8");

const WORKER_PROXY = "https://keeptxred-site.freddy-coppola.workers.dev/api/admin/legislation-sync-proxy";

describe("legislation sync Worker proxy contract", () => {
  it("routes GitHub-hosted sync traffic through the deployed Worker origin", () => {
    expect(workflow).toContain(`SUPABASE_URL: ${WORKER_PROXY}`);
    expect(workflow).not.toContain("SUPABASE_URL: https://keeptxred.com/api/admin/legislation-sync-proxy");
    expect(workflow).toContain("${{ github.token }}::${{ github.run_id }}");
  });

  it("authenticates the exact active main workflow run from the packed short-lived credential", () => {
    expect(proxy).toContain('const EXPECTED_REPOSITORY = "keeptxred/texas-heartland-hub"');
    expect(proxy).toContain('const EXPECTED_WORKFLOW = ".github/workflows/sync-texas-legislation.yml"');
    expect(proxy).toContain('composite.lastIndexOf("::")');
    expect(proxy).toContain('run?.head_branch === "main"');
    expect(proxy).toContain('["schedule", "workflow_dispatch"].includes');
    expect(proxy).toContain('["queued", "in_progress"].includes');
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
