import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const workflow = readFileSync(
  fileURLToPath(new URL("../../.github/workflows/run-daily-news-now.yml", import.meta.url)),
  "utf8",
);

describe("newsroom fallback reports actual transport failures", () => {
  it("preserves zero-AI stage failure across later fallback steps", () => {
    expect(workflow).toContain("newsroom_transport_failed=0");
    expect(workflow).toContain("clustered_ready=0\n              newsroom_transport_failed=1");
  });

  it("does not misclassify valid no-item editorial holds as transport failure", () => {
    expect(workflow).toContain("Clustered newsroom had no production-eligible packet");
    expect(workflow).toContain("newsroom_transport_failed=1");
    expect(workflow).toContain("Clustered newsroom publish attempt was unavailable");
  });

  it("fails after fallback when a real HTTP/timeout error remains", () => {
    expect(workflow).toContain('if [[ "$newsroom_transport_failed" -eq 1 || "$overdue_failed" -eq 1 ]]; then');
    expect(workflow).toContain("DAILY_NEWS_TECHNICAL_FAILURE");
    expect(workflow.indexOf("DAILY_NEWS_TECHNICAL_FAILURE")).toBeGreaterThan(workflow.indexOf("PUBLISHING_SAFETY_NET_FAILED"));
    expect(workflow).toContain("DAILY_NEWS_NO_PUBLICATION");
  });
});
