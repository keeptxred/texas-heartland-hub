import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/newsroom-production-observability.yml", "utf8");
const source = workflow.split("python3 <<'PY'\n")[1]?.split("\n          PY")[0];
if (!source) throw new Error("Newsroom telemetry analyzer not found");
const python = source.split("\n").map((line) => line.startsWith("          ") ? line.slice(10) : line).join("\n");
const directories: string[] = [];

afterEach(() => {
  for (const dir of directories.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function analyze(log: string) {
  const dir = mkdtempSync(join(tmpdir(), "ktr-newsroom-observability-"));
  directories.push(dir);
  const logPath = join(dir, "publisher.log");
  const summaryPath = join(dir, "summary.md");
  writeFileSync(logPath, log);
  const result = spawnSync("python3", ["-c", python], {
    cwd: dir,
    env: {
      ...process.env,
      PUBLISHER_LOG_PATH: logPath,
      GITHUB_STEP_SUMMARY: summaryPath,
      SOURCE_RUN_ID: "123",
      SOURCE_RUN_EVENT: "schedule",
      SOURCE_RUN_CONCLUSION: "failure",
      SOURCE_RUN_SHA: "0123456789",
      SOURCE_RUN_CREATED_AT: "2026-10-25T19:00:00Z",
    },
    encoding: "utf8",
    timeout: 8_000,
  });
  expect(result.status, result.stderr).toBe(0);
  return {
    telemetry: JSON.parse(readFileSync(join(dir, "newsroom-production-telemetry.json"), "utf8")),
    summary: readFileSync(summaryPath, "utf8"),
  };
}

describe("newsroom production telemetry distinguishes valid outcomes", () => {
  it("reports reserve publication instead of inventing a newsroom failure", () => {
    const slug = "2026-10-25-verified-texas-open-meetings";
    const { telemetry, summary } = analyze(
      'No quality-gated normal article published; invoking curated reserve safety net.\n' +
      '{"ok":true,"reserve_published":"' + slug + '"}\n' +
      'DAILY_NEWS_PUBLISH_SUCCESS reserve_published=' + slug + '\n',
    );
    expect(telemetry.schemaVersion).toBe(2);
    expect(telemetry.publisher).toBe("safety_net");
    expect(telemetry.published).toBe(true);
    expect(telemetry.reservePublished).toBe(true);
    expect(telemetry.reserveSlug).toBe(slug);
    expect(telemetry.slug).toBe(slug);
    expect(telemetry.failureCodes).toEqual([]);
    expect(summary).toContain("Safety net invoked: **True**; published: **True**");
  });

  it("classifies a model 500 and reserve transport timeout without asserting publication", () => {
    const { telemetry } = analyze(
      'clustered-newsroom HTTP 500\n' +
      '{"error":"Newsroom generation failed","details":"newsroom_image_publication_hold: Cloudflare Workers AI @cf/black-forest-labs/flux-2-klein-9b 500: Internal server error"}\n' +
      'AI rewrite failed — editorial validation rejected the draft: tiered_main_word_count:375/800\n' +
      'No quality-gated normal article published; invoking curated reserve safety net.\n' +
      'PUBLISHING_SAFETY_NET_FAILED (HTTP 000000)\n',
    );
    expect(telemetry.publisher).toBe("none");
    expect(telemetry.published).toBe(false);
    expect(telemetry.reservePublished).toBe(false);
    expect(telemetry.failureCodes).toEqual(["editorial_validation", "image_provider_5xx", "image_verification_hold", "reserve_transport_failure"]);
  });

  it("does not label an attempted reserve as published unless success is explicit", () => {
    const { telemetry } = analyze(
      'No quality-gated normal article published; invoking curated reserve safety net.\n' +
      '{"ok":true,"reserve_published":null}\n' +
      'DAILY_NEWS_NO_PUBLICATION no_quality_gated_article=true reserve_published=false\n',
    );
    expect(telemetry.publisher).toBe("none");
    expect(telemetry.published).toBe(false);
    expect(telemetry.safetyNetInvoked).toBe(true);
    expect(telemetry.reservePublished).toBe(false);
  });
});
