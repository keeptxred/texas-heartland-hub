import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./newsroom-admin.functions.ts", import.meta.url), "utf8");

describe("Phase 11 optional admin extensions", () => {
  it("does not make optional audit or cron extensions fatal", () => {
    expect(source).toContain("const auditAvailable = !actionsResult.error");
    expect(source).toContain("const cronTelemetryAvailable = !cronResult.error");
    expect(source).toContain("auditRecorded: !audit.error");
    expect(source).not.toContain("if (audit.error) throw new Error(audit.error.message)");
  });

  it("falls back to persisted zero-AI pipeline activity", () => {
    expect(source).toContain('db.from("news_feed_normalization").select("normalized_at")');
    expect(source).toContain('status: "unknown"');
    expect(source).toContain('schedule: "direct cron telemetry unavailable"');
    expect(source).toContain("inferredCronHealth");
  });

  it("still has no generation or publication path", () => {
    expect(source).not.toContain("runCloudflareJson");
    expect(source).not.toContain("newsroom_reserve_ai_generation");
    expect(source).not.toContain('.from("daily_articles")');
  });
});
