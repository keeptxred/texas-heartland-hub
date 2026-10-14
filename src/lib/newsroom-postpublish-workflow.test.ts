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

  it("fails on article finalization defects but defers failed image generation", () => {
    expect(workflow).toContain("CLUSTERED_NEWSROOM_FINALIZE_FAILED");
    expect(workflow).toContain("CLUSTERED_NEWSROOM_IMAGE_DEFERRED");
    expect(workflow).not.toContain("CLUSTERED_NEWSROOM_IMAGE_FAILED");
    const finalizeFailure = workflow.indexOf("CLUSTERED_NEWSROOM_FINALIZE_FAILED");
    const imageDeferred = workflow.indexOf("CLUSTERED_NEWSROOM_IMAGE_DEFERRED");
    expect(workflow.slice(finalizeFailure, finalizeFailure + 300)).toContain("exit 1");
    expect(workflow.slice(imageDeferred, imageDeferred + 300)).not.toContain("exit 1");
    expect(workflow).toContain("FLYOVER_EXACT_FEED_IMAGE_DEFERRED");
    expect(workflow).toContain(".ok == true and (.slug // \"\") != \"\"");
    expect(workflow).not.toContain("(.slug // \"\") != \"\" and .image.ok == true");
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
