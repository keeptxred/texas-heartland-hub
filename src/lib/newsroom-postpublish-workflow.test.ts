import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(resolve(process.cwd(), ".github/workflows/run-daily-news-now.yml"), "utf8");

describe("clustered newsroom post-publish workflow", () => {
  it("finalizes the exact published slug before reporting success", () => {
    expect(workflow).toContain("finalize_payload=$(jq -nc --arg slug \"$slug\" '{slug:$slug}')");
    expect(workflow).toContain("/api/public/hooks/finalize-newsroom-article");
    expect(workflow.indexOf("finalize-newsroom-article")).toBeLessThan(
      workflow.indexOf("DAILY_NEWS_PUBLISH_SUCCESS clustered_slug"),
    );
  });

  it("separates safe website-only publication from verified-image social readiness", () => {
    expect(workflow).toContain("CLUSTERED_NEWSROOM_FINALIZE_FAILED");
    expect(workflow).toContain("CLUSTERED_NEWSROOM_IMAGE_STATE_INVALID");
    expect(workflow).toContain("DAILY_NEWS_WEB_ONLY_SUCCESS");
    expect(workflow).toContain(".webOnly == true and .imageReady == false");
    expect(workflow).toContain("social_image_ready=false");
    const invalid = workflow.indexOf("CLUSTERED_NEWSROOM_IMAGE_STATE_INVALID");
    expect(workflow.slice(invalid, invalid + 220)).toContain("exit 1");
    expect(workflow).toContain("FLYOVER_EXACT_FEED_IMAGE_FAILED");
    const flyoverFailure = workflow.indexOf("FLYOVER_EXACT_FEED_IMAGE_FAILED");
    expect(workflow.slice(flyoverFailure, flyoverFailure + 270)).toContain("exit 1");
  });
  it("tries the quality-gated clustered newsroom before the costly overdue writer", () => {
    const clustered = workflow.indexOf("generate-newsroom?mode=publish");
    const overdue = workflow.indexOf("/api/public/hooks/publish-overdue-gap");
    const reserve = workflow.indexOf("/api/public/hooks/publishing-safety-net");
    const clusteredSuccess = workflow.indexOf("DAILY_NEWS_PUBLISH_SUCCESS clustered_slug=");
    expect(clustered).toBeGreaterThan(0);
    expect(clustered).toBeLessThan(overdue);
    expect(clusteredSuccess).toBeLessThan(overdue);
    expect(overdue).toBeLessThan(reserve);
    expect(workflow.slice(clusteredSuccess, overdue)).toContain("exit 0");
    expect(workflow.slice(overdue, reserve)).toContain("DAILY_NEWS_PUBLISH_SUCCESS overdue_published=");
    expect(workflow.slice(overdue, reserve)).toContain("OVERDUE_GAP_PUBLISHER_FAILED");
  });

  it("never short-circuits guarded reserve because overdue fetch failed or timed out", () => {
    const overdueStart = workflow.indexOf('overdue_failed=0');
    const reserveStart = workflow.indexOf("/api/public/hooks/publishing-safety-net");
    const boundary = workflow.slice(overdueStart, reserveStart);
    expect(overdueStart).toBeGreaterThan(0);
    expect(reserveStart).toBeGreaterThan(overdueStart);
    expect(boundary).toContain('OVERDUE_GAP_PUBLISHER_FAILED HTTP=');
    expect(boundary).toContain('overdue_failed=1');
    expect(boundary).toContain('OVERDUE_GAP_FAILED_RESERVE_ATTEMPT');
    expect(boundary).toContain('DAILY_NEWS_PUBLISH_SUCCESS overdue_published=');
    // Exit with an actually published, guarded overdue article only.
    expect(boundary).toMatch(/if \[\[ "\$overdue_published" -gt 0 \]\]; then\s+echo "[^"]*DAILY_NEWS_PUBLISH_SUCCESS overdue_published=[^"]*"\s+exit 0/);
    expect(boundary).not.toContain('exit 1');
    const rescue = workflow.slice(reserveStart);
    expect(rescue).toContain("PUBLISHING_SAFETY_NET_FAILED");
    expect(rescue).toContain("DAILY_NEWS_NORMAL_PUBLISHING_STALLED");
  });

  it("reports a no-op honestly and fails if a publication gap is overdue", () => {
    const reserveBranch = workflow.slice(workflow.indexOf("reserve_published=$(jq -r"));
    expect(reserveBranch).toContain("DAILY_NEWS_NO_PUBLICATION");
    expect(reserveBranch).toContain("if jq -e '.publication_gap == true' /tmp/safety-net.json");
    expect(reserveBranch).toContain("DAILY_NEWS_PUBLISH_GAP");
    expect(reserveBranch).toContain("exit 1");
    expect(reserveBranch).not.toContain("DAILY_NEWS_PUBLISH_SUCCESS no_quality_gated_article=true");
  });

});
