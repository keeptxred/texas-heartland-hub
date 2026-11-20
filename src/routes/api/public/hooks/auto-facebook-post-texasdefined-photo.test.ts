import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  createTexasDefinedFacebookPhotoPayload,
  loadTexasDefinedFacebookPhoto,
  MAX_TEXASDEFINED_FACEBOOK_PHOTO_BYTES,
} from "@/lib/texasdefined-facebook-photo-upload";

function imageBytes(kind: "jpeg" | "png" | "gif", size = 1024): Uint8Array {
  const bytes = new Uint8Array(size);
  if (kind === "jpeg") bytes.set([0xff, 0xd8, 0xff, 0xe0], 0);
  if (kind === "png") bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  if (kind === "gif") bytes.set([0x47, 0x49, 0x46, 0x38, 0x39, 0x61], 0);
  return bytes;
}

function imageResponse(
  bytes: Uint8Array,
  type: string,
  options: { status?: number; contentLength?: string } = {},
): Response {
  return new Response(bytes.buffer as ArrayBuffer, {
    status: options.status ?? 200,
    headers: {
      "content-type": type,
      "content-length": options.contentLength ?? String(bytes.byteLength),
    },
  });
}

describe("TexasDefined Facebook Graph photo uploads", () => {
  it.each([
    ["jpeg", "image/jpeg", "jpg"],
    ["png", "image/png", "png"],
    ["gif", "image/gif", "gif"],
  ] as const)("downloads and verifies %s for a multipart photo", async (kind, type, ext) => {
    const mockedFetch = vi.fn(async () => imageResponse(imageBytes(kind), type));
    const photo = await loadTexasDefinedFacebookPhoto("https://texasdefined.com/media/remote?url=example", mockedFetch);
    expect(photo).not.toBeNull();
    expect(photo?.mimeType).toBe(type);
    expect(photo?.size).toBe(1024);
    expect(photo?.filename).toBe(`texasdefined-facebook-article.${ext}`);
    expect(mockedFetch).toHaveBeenCalledOnce();

    const form = createTexasDefinedFacebookPhotoPayload(photo!, "TexasDefined guide\n\nhttps://texasdefined.com/article/guide", "test-only-token");
    expect(form.get("caption")).toContain("https://texasdefined.com/article/guide");
    expect(form.get("access_token")).toBe("test-only-token");
    expect(form.get("source")).toBeInstanceOf(Blob);
    expect((form.get("source") as File).type).toBe(type);
  });

  it("rejects unsupported WebP, even when a page provides it as an OG image", async () => {
    const image = imageBytes("jpeg");
    expect(await loadTexasDefinedFacebookPhoto("https://texasdefined.com/test.webp", async () => imageResponse(image, "image/webp"))).toBeNull();
  });

  it("rejects a mismatched MIME type and non-image HTML", async () => {
    expect(await loadTexasDefinedFacebookPhoto("https://texasdefined.com/photo", async () => imageResponse(imageBytes("jpeg"), "image/png"))).toBeNull();
    expect(await loadTexasDefinedFacebookPhoto("https://texasdefined.com/photo", async () => new Response("<html>not an image</html>", { headers: { "content-type": "text/html" } }))).toBeNull();
  });

  it("rejects HTTP failures, invalid schemes, and truncated image stubs", async () => {
    expect(await loadTexasDefinedFacebookPhoto("http://texasdefined.com/photo", async () => imageResponse(imageBytes("jpeg"), "image/jpeg"))).toBeNull();
    expect(await loadTexasDefinedFacebookPhoto("https://texasdefined.com/photo", async () => imageResponse(imageBytes("jpeg"), "image/jpeg", { status: 404 }))).toBeNull();
    expect(await loadTexasDefinedFacebookPhoto("https://texasdefined.com/photo", async () => imageResponse(imageBytes("jpeg", 16), "image/jpeg"))).toBeNull();
  });

  it("rejects an oversized Content-Length before buffering", async () => {
    const mockedFetch = vi.fn(async () => imageResponse(imageBytes("jpeg"), "image/jpeg", {
      contentLength: String(MAX_TEXASDEFINED_FACEBOOK_PHOTO_BYTES + 1),
    }));
    expect(await loadTexasDefinedFacebookPhoto("https://texasdefined.com/photo", mockedFetch)).toBeNull();
    expect(mockedFetch).toHaveBeenCalledOnce();
  });

  it("limits actual streamed bytes even if the server lies about Content-Length", async () => {
    const chunk = imageBytes("jpeg", 5 * 1024 * 1024);
    const response = new Response(new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(chunk);
        controller.enqueue(chunk);
        controller.close();
      },
    }), { headers: { "content-type": "image/jpeg", "content-length": "128" } });
    expect(await loadTexasDefinedFacebookPhoto("https://texasdefined.com/photo", async () => response)).toBeNull();
  });

  it("does not send Meta a JSON URL upload and preserves the article safety guards", () => {
    const route = readFileSync(new URL("./auto-facebook-post-texasdefined.ts", import.meta.url), "utf8");
    expect(route).toContain("createTexasDefinedFacebookPhotoPayload(photo, caption");
    expect(route).toContain("body: graphBody");
    expect(route).toContain("imagesChecked");
    expect(route).toContain("fetchRecentFacebookPagePosts");
    expect(route).toContain("facebookPostMatchesArticle");
    expect(route).toContain("hardPostingGuard");
    expect(route).toContain("verifyGitHubActionsOidc");
    expect(route).toContain("graph_error_subcode");
    expect(route).not.toContain("url: selectedMetadata.imageUrl,");
  });
  it("uses the same validated multipart source for non-article Facebook image posts", () => {
    const engagement = readFileSync(new URL("./auto-facebook-post-texasdefined-with-image.ts", import.meta.url), "utf8");
    expect(engagement).toContain("loadTexasDefinedFacebookPhoto(image.imageUrl)");
    expect(engagement).toContain("createTexasDefinedFacebookPhotoPayload(photo, message");
    expect(engagement).toContain("body: graphBody");
    expect(engagement).toContain("image_guard: true");
    expect(engagement).toContain("graph_error_subcode");
    expect(engagement).toContain("verifyGitHubActionsOidc");
    expect(engagement).not.toContain("body: JSON.stringify({");
  });

});
