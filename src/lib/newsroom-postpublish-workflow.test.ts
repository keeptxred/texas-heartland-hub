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

  it("keeps a successful article published if finalization or image generation fails", () => {
    expect(workflow).toContain("CLUSTERED_NEWSROOM_FINALIZE_WARNING");
    expect(workflow).toContain("CLUSTERED_NEWSROOM_IMAGE_WARNING");
    expect(workflow).toContain("article remains published");
  });
});
