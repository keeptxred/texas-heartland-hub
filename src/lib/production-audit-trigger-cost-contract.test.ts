import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = (name: string) =>
  readFileSync(new URL(`../../.github/workflows/${name}`, import.meta.url), "utf8");

describe("production crawl cost contract", () => {
  it("never hooks the complete sitemap audit to deployment or main pushes", () => {
    const text = workflow("audit-sitemap-page-indexability.yml");
    const triggers = text.split("permissions:")[0];
    expect(triggers).toContain("workflow_dispatch:");
    expect(triggers).toContain('37 12 * * 1');
    expect(triggers).not.toContain("workflow_run:");
    expect(triggers).not.toContain("  push:");
    expect(text).toContain("node scripts/ci/audit-sitemap-page-indexability.mjs");
    const runner = readFileSync(new URL("../../scripts/ci/audit-sitemap-page-indexability.mjs", import.meta.url), "utf8");
    expect(runner).toContain("const MAX_REQUESTS = 15_000;");
    expect(runner).toContain("request-budget-exhausted");
  });

  it("does not hide a full sitemap crawl inside hourly hero readiness", () => {
    const text = workflow("article-hero-readiness-audit.yml");
    expect(text).toContain("cron: '23 * * * *'");
    expect(text).toContain("article-hero-readiness-audit");
    expect(text).not.toContain("  sitemap-indexability:");
    expect(text).not.toContain("audit-sitemap-page-indexability.mjs");
    expect(text).not.toContain("  workflow_run:");
  });

  it("limits production link discovery to weekly/manual runs", () => {
    const text = workflow("broken-link-audit.yml");
    const triggers = text.split("permissions:")[0];
    expect(triggers).toContain("pull_request:");
    expect(triggers).not.toContain("  push:");
    expect(triggers).not.toContain("  workflow_run:");
    expect(text).toContain("- 'src/routes/**'");
    expect(text).toContain("- 'src/server.ts'");
    expect(text).toContain("- 'src/server/**'");
    expect(text).toContain("node scripts/seo/audit-broken-links.mjs --live");
    expect(text).toContain("node scripts/seo/audit-broken-links.mjs\n");
    expect(text).toContain("github.event_name");
    const runner = readFileSync(new URL("../../scripts/seo/audit-broken-links.mjs", import.meta.url), "utf8");
    expect(runner).toContain("const MAX_LIVE_REQUESTS = 15_000;");
    expect(runner).toContain("request-budget-exhausted");
  });

  it("never manually dispatches full live link audits or redundant hero queues after auto-merge", () => {
    const autoMerge = workflow("auto-merge-prs.yml");
    expect(autoMerge).not.toContain("gh workflow run broken-link-audit.yml");
    expect(autoMerge).not.toContain("gh workflow run article-hero-readiness-audit.yml");
    expect(autoMerge).toContain("gh workflow run shared-vitest.yml");
  });

  it("keeps political-figure full browser acceptance manual, not every push", () => {
    const triggers = workflow("verify-political-figures-production.yml").split("permissions:")[0];
    expect(triggers).toContain("workflow_dispatch:");
    expect(triggers).not.toContain("  push:");
  });
});
