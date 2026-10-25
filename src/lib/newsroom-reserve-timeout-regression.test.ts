import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("newsroom reserve still requires a story-matched image", () => {
  it("allows one bounded image-verification request without a retry loop", () => {
    const workflow = fs.readFileSync(new URL("../../.github/workflows/run-daily-news-now.yml", import.meta.url), "utf8");
    const reserve = fs.readFileSync(new URL("../routes/api/public/hooks/publishing-safety-net.ts", import.meta.url), "utf8");

    expect(workflow).toContain("--max-time 480");
    expect(workflow).not.toContain("--max-time 95 -H 'accept: application/json'");
    expect(workflow.match(/\/api\/public\/hooks\/publishing-safety-net/g)).toHaveLength(1);
    expect(workflow).toContain("PUBLISHING_SAFETY_NET_FAILED");
    expect(workflow).toContain('workflows: ["Deploy verified KeepTXRed to Cloudflare"]');
    expect(workflow).toContain('github.event.workflow_run.conclusion == \'success\'');
    expect(workflow).toContain("github.event.workflow_run.head_branch == 'main'");
    expect(workflow).toContain('cancel-in-progress: false');
    expect(workflow).toContain('cron: "15 */4 * * *"');
    expect(reserve).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
    expect(reserve).toContain("reserve_newsroom_image_publication_hold:");
    expect(reserve).toContain('image_generation_status: "ready"');
  });
});
