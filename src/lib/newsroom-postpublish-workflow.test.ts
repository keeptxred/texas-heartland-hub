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

  it("preserves the published article but fails the production run when finalization or hero generation fails", () => {
    expect(workflow).toContain("CLUSTERED_NEWSROOM_FINALIZE_FAILED");
    expect(workflow).toContain("CLUSTERED_NEWSROOM_IMAGE_FAILED");
    expect(workflow).toContain("article remains published for safe recovery, but this run is not a production pass");
    expect(workflow).not.toContain("CLUSTERED_NEWSROOM_FINALIZE_WARNING");
    expect(workflow).not.toContain("CLUSTERED_NEWSROOM_IMAGE_WARNING");

    const finalizeFailure = workflow.indexOf("CLUSTERED_NEWSROOM_FINALIZE_FAILED");
    const imageFailure = workflow.indexOf("CLUSTERED_NEWSROOM_IMAGE_FAILED");
    expect(workflow.slice(finalizeFailure, finalizeFailure + 300)).toContain("exit 1");
    expect(workflow.slice(imageFailure, imageFailure + 300)).toContain("exit 1");
  });
});
