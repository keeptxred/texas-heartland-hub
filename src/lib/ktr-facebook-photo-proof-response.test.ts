import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("KTR Facebook post success reports the actual verified photo", () => {
  const route = readFileSync("src/routes/api/public/hooks/auto-facebook-post.ts", "utf8");
  const workflow = readFileSync(".github/workflows/auto-facebook-posts.yml", "utf8");
  const photoPublisher = readFileSync("src/services/quickPublish.functions.ts", "utf8");

  it("only declares success after the photo publisher returns ok, and includes its exact image asset", () => {
    expect(route).toContain("if (result.ok) {");
    expect(route).toContain("asset_url: row.featured_image_url");
    expect(route).toContain("image_url: row.featured_image_url");
    expect(route).toContain("post_url: result.post_url");
    expect(route).toContain("Boolean(row.featured_image_url?.trim())");
  });

  it("retains the image-first Graph API and does not switch automated posts to text first", () => {
    expect(photoPublisher).toContain('endpoint = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/photos`');
    expect(photoPublisher).toContain('body.set("source", new Blob([imageBytes');
    expect(photoPublisher).toContain("if (!textFirstEligible && staticCheck && !staticCheck.ready)");
    expect(route).not.toContain("allow_text_first: true");
  });

  it("prints an image URL and still rejects Facebook delivery failures", () => {
    expect(workflow).toContain("image_url=$(jq -r '.image_url // \"\"' /tmp/ktrfb/decision.json)");
    expect(workflow).toContain("AUTO_FACEBOOK_POST_SUCCESS");
    expect(workflow).toContain("AUTO_FACEBOOK_POST_FAILED");
  });
});
