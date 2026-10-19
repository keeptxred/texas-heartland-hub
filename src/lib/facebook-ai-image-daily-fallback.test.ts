import fs from "node:fs";
import { describe, expect, it } from "vitest";

const smart = fs.readFileSync("src/routes/api/public/hooks/auto-facebook-post-smart.ts", "utf8");
const articles = fs.readFileSync("src/routes/api/public/hooks/auto-facebook-post.ts", "utf8");
const workflow = fs.readFileSync(".github/workflows/auto-facebook-posts.yml", "utf8");
const generated = fs.readFileSync("src/routes/api/public/hooks/publish-ktr-generated-attention-image.ts", "utf8");

describe("KeepTXRed scheduled Facebook images", () => {
  it("prefers approved articles or evergreen guides and only falls back after an editorial shortage", () => {
    expect(smart).toContain("const articleResponse = await forwardArticlePost(token)");
    expect(smart).toContain("if (result?.no_items !== true) return articleResponse");
    expect(smart).toContain("prepareKtrFacebookAttentionPost({");
    expect(smart).toContain("slot: decision.postsToday");
  });

  it("does not select image-less articles for automatic Facebook publishing", () => {
    expect(articles).toContain("Boolean(row.featured_image_url?.trim())");
    expect(articles).not.toContain("isEligibleTextFirstFacebookArticle(row)");
  });

  it("requires AI image generation, storage, integrity checks and upload before Facebook publishing", () => {
    expect(workflow).toContain("image_generation_required == true");
    expect(workflow).toContain("api.openai.com/v1/images/generations");
    expect(workflow).toContain("actions/upload-artifact@v4");
    expect(workflow).toContain("sha256sum /tmp/ktrfb/generated-image.png");
    expect(workflow).toContain("no fallback will be attempted");
    expect(generated).toContain("Generated Facebook image is required");
    expect(generated).toContain("Facebook post text does not match the registered KTR attention post");
  });
});
