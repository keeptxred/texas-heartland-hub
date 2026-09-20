import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  new URL("./quickPublish.functions.ts", import.meta.url),
  "utf8",
);

describe("Facebook generated article-image delivery", () => {
  it("recognizes generated article-image URLs on KeepTXRed hosts", () => {
    expect(source).toContain('const GENERATED_IMAGE_PATH_PREFIX = "/api/public/article-image/"');
    expect(source).toContain('"keeptxred.com"');
    expect(source).toContain('"www.keeptxred.com"');
    expect(source).toContain('"keeptxred-site.freddy-coppola.workers.dev"');
    expect(source).toContain("generatedArticleImageFilename");
  });

  it("does not run the diagnostic HTTP probe for generated same-site images", () => {
    expect(source).toContain("if (resolvedAssetUrl && !generatedFilename)");
  });

  it("validates generated images by reading the private article-images bucket directly", () => {
    expect(source).toContain('.from("article-images")');
    expect(source).toContain(".download(generatedFilename)");
    expect(source).toContain('source: "article-images-storage"');
  });

  it("reuses storage bytes for Meta upload instead of downloading the same Worker URL", () => {
    expect(source).toContain("if (generatedImageBytes && generatedImageContentTypeValue)");
    expect(source).toContain("imageBytes = generatedImageBytes");
    expect(source).toContain("imageContentType = generatedImageContentTypeValue");
    expect(source).toContain("else {\n        const uploadImageUrl = normalizeFacebookUploadImageUrl(resolvedAssetUrl!)");
  });

  it("keeps the image-size hard gate", () => {
    expect(source).toContain("MAX_FACEBOOK_IMAGE_BYTES");
    expect(source).toContain("generatedImageBytes.byteLength > MAX_FACEBOOK_IMAGE_BYTES");
    expect(source).toContain("imageBytes.byteLength > MAX_FACEBOOK_IMAGE_BYTES");
  });
});
