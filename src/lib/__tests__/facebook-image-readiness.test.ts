import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assessImageUrl,
  normalizeFacebookUploadImageUrl,
  normalizeImageUrl,
  resolveFacebookImageProbeUrl,
  verifyImageIsReachable,
} from "@/lib/facebook-image-readiness";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("assessImageUrl — deterministic image gate", () => {
  it("blocks Facebook posts when no image is attached", () => {
    const r = assessImageUrl(null);
    expect(r.ready).toBe(false);
    expect(r.reason).toBe("MISSING_IMAGE");
  });

  it("blocks Facebook posts when the URL is not a valid public URL", () => {
    expect(assessImageUrl("data:image/png;base64,AAAA").reason).toBe("INVALID_URL");
    expect(assessImageUrl("http://localhost:3000/foo.png").reason).toBe("INVALID_URL");
    expect(assessImageUrl("http://192.168.1.10/foo.png").reason).toBe("INVALID_URL");
    expect(assessImageUrl("not a url").reason).toBe("INVALID_URL");
  });

  it("normalizes site-relative URLs to the public https URL", () => {
    const url = normalizeImageUrl("/api/public/article-image/foo.png");
    expect(url).toMatch(/^https:\/\/keeptxred\.com\/api\/public\/article-image\/foo\.png$/);
    expect(assessImageUrl("/api/public/article-image/foo.png").ready).toBe(true);
  });

  it("routes same-site readiness probes through workers.dev to avoid Custom Domain self-fetch 522", () => {
    expect(
      resolveFacebookImageProbeUrl(
        "https://keeptxred.com/api/public/article-image/foo.png?version=2",
      ),
    ).toBe(
      "https://keeptxred-site.freddy-coppola.workers.dev/api/public/article-image/foo.png?version=2",
    );
    expect(resolveFacebookImageProbeUrl("https://example.com/photo.jpg")).toBe(
      "https://example.com/photo.jpg",
    );
  });

  it("blocks legacy generated newsroom placeholders even when rasterized as PNG", () => {
    const result = assessImageUrl(
      "/images/news/generated/2026-08-09/texas-childrens-expansion.png",
    );
    expect(result.ready).toBe(false);
    expect(result.reason).toBe("NOT_IMAGE");
    expect(result.message).toContain("legacy generated placeholder");
  });

  it("requests a bounded 1200px thumbnail for Wikimedia uploads", () => {
    const url = normalizeFacebookUploadImageUrl(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bexar%20County%20Courthouse%20%282023%29.jpg",
    );
    expect(url).toBe(
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bexar%20County%20Courthouse%20%282023%29.jpg?width=1200",
    );
  });

  it("leaves non-Wikimedia image URLs unchanged", () => {
    expect(normalizeFacebookUploadImageUrl("https://example.com/photo.jpg?x=1")).toBe(
      "https://example.com/photo.jpg?x=1",
    );
  });
});

describe("verifyImageIsReachable — server-side content-type gate", () => {
  it("blocks when the URL returns non-image content", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response("<html></html>", {
          status: 200,
          headers: { "content-type": "text/html" },
        }),
    ) as unknown as typeof fetch;
    const r = await verifyImageIsReachable("https://example.com/image.png");
    expect(r.ready).toBe(false);
    expect(r.reason).toBe("NOT_IMAGE");
  });

  it("passes when the URL returns real image bytes", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response("", {
          status: 200,
          headers: { "content-type": "image/png" },
        }),
    ) as unknown as typeof fetch;
    const r = await verifyImageIsReachable("https://example.com/image.png");
    expect(r.ready).toBe(true);
    expect(r.reason).toBe("READY");
  });

  it("probes a keeptxred.com image through workers.dev while preserving the public Facebook URL", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response("", {
          status: 200,
          headers: { "content-type": "image/png" },
        }),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const publicUrl = "https://keeptxred.com/api/public/article-image/court.png";
    const r = await verifyImageIsReachable(publicUrl);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://keeptxred-site.freddy-coppola.workers.dev/api/public/article-image/court.png",
      expect.objectContaining({ method: "HEAD" }),
    );
    expect(r.ready).toBe(true);
    expect(r.imageUrl).toBe(publicUrl);
  });

  it("blocks when the URL returns an HTTP error", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response("nope", { status: 404, headers: { "content-type": "text/plain" } }),
    ) as unknown as typeof fetch;
    const r = await verifyImageIsReachable("https://example.com/missing.png");
    expect(r.ready).toBe(false);
    expect(r.reason).toBe("NOT_PUBLIC");
  });
});
