import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(".github/workflows/auto-facebook-posts.yml", "utf8");
const attentionPublisher = fs.readFileSync("src/lib/facebook-attention-publisher.server.ts", "utf8");
const generatedPublisher = fs.readFileSync(
  "src/routes/api/public/hooks/publish-ktr-generated-attention-image.ts",
  "utf8",
);

describe("KTR generated Facebook attention image contract", () => {
  it("generates from the exact post text with the repository OpenAI key", () => {
    expect(workflow).toContain("OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}");
    expect(workflow).toContain("prompt = 'Generate an image for this Facebook post.\\n\\n' + post_text");
    expect(workflow).toContain("'model': 'gpt-image-2'");
    expect(workflow).toContain("/api/public/hooks/publish-ktr-generated-attention-image");
  });

  it("fails closed instead of using the old generic Keep TX Red image", () => {
    expect(workflow).not.toContain("og/default.jpg");
    expect(attentionPublisher).not.toContain("og/default.jpg");
    expect(attentionPublisher).toContain("image_generation_required: true");
    expect(attentionPublisher).toContain("generic_fallback: false");
    expect(generatedPublisher).toContain("generic_fallback: false");
    expect(workflow).toContain("no fallback will be attempted");
  });

  it("requires stored-image provenance and checksum verification before Facebook publish", () => {
    expect(workflow).toContain("actions/upload-artifact@v4");
    expect(workflow).toContain("sha256sum /tmp/ktrfb/generated-image.png");
    expect(generatedPublisher).toContain("Generated Facebook image changed after storage");
    expect(generatedPublisher).toContain("KTR GitHub run provenance does not match the signed OIDC run ID");
    expect(generatedPublisher).toContain("Facebook post text does not match the registered KTR attention post");
  });
});
