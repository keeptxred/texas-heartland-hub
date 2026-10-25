import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("newsroom reserve still requires a story-matched image", () => {
  it("allows one bounded image-verification request without a retry loop", () => {
    const workflow = fs.readFileSync(new URL("../../.github/workflows/run-daily-news-now.yml", import.meta.url), "utf8");
    const reserve = fs.readFileSync(new URL("../routes/api/public/hooks/publishing-safety-net.ts", import.meta.url), "utf8");

    expect(workflow).toContain("--max-time 240");
    expect(workflow).not.toContain("--max-time 95 -H 'accept: application/json'");
    expect(workflow.match(/\/api\/public\/hooks\/publishing-safety-net/g)).toHaveLength(1);
    expect(workflow).toContain("PUBLISHING_SAFETY_NET_FAILED");
    expect(reserve).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
    expect(reserve).toContain("reserve_newsroom_image_publication_hold:");
    expect(reserve).toContain('image_generation_status: "ready"');
  });
});
