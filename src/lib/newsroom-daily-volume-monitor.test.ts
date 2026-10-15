import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const script = "scripts/news/check-daily-quality-volume.mjs";
const workflow = readFileSync(".github/workflows/verify-daily-news-volume.yml", "utf8");

describe("daily substantive newsroom output", () => {
  it("passes its offline publisher/source-quality, text and Central-date self-tests", () => {
    const output = execFileSync(process.execPath, [script, "--self-test"], {
      cwd: process.cwd(), encoding: "utf8", timeout: 15_000,
    });
    expect(output).toContain("self-test passed");
  });

  it("uses a read-only daily Actions alert, never a filler publishing workflow", () => {
    expect(workflow).toContain("cron: '25 7 * * *'");
    expect(workflow).toContain("node scripts/news/check-daily-quality-volume.mjs");
    expect(workflow).toContain("github.event_name == 'schedule'");
    expect(workflow).toContain('workflows: ["Run Daily News Now"]');
    expect(workflow).toContain("github.event_name == 'push'");
    expect(workflow).toContain("steps.fallback_window.outputs.ready == 'true'");
    expect(workflow).toContain("SOURCE_RUN_CREATED_AT");
    expect(workflow).toContain('utc_hour} >= 8');

    expect(workflow).not.toMatch(/generate-newsroom|publish-overdue-gap|workflow_dispatch.+inputs.+publish/s);
  });

  it("fails below three qualifying news stories without spending AI", () => {
    const src = readFileSync(script, "utf8");
    expect(src).toContain("const MIN_DAILY_ARTICLES = 3;");
    expect(src).toContain("if (!pass) process.exitCode = 1");
    expect(src).toContain('article.kind !== "news"');
    expect(src).toContain('"source_integrity_failure"');
    expect(src).toContain('isDiscoveryPointer(url)');
    expect(src).toContain('isGovernmentNewsClippingUrl');
    expect(src).toContain('lrl.state.tx.us');
    expect(src).toContain('lrl.texas.gov');
    expect(src).toContain('publisherFamily');
    expect(src).not.toMatch(/reserve_ai_generation|Workers AI|model:\s*"chatgpt"/);
  });
});
