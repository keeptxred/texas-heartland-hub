import { afterEach, describe, expect, it, mock } from "bun:test";
import {
  assessImageUrl,
  normalizeImageUrl,
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
    expect(url).toMatch(/^https:\/\/www\.keeptxred\.com\/api\/public\/article-image\/foo\.png$/);
    expect(assessImageUrl("/api/public/article-image/foo.png").ready).toBe(true);
  });
});

describe("verifyImageIsReachable — server-side content-type gate", () => {
  it("blocks when the URL returns non-image content", async () => {
    globalThis.fetch = mock(async () =>
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
    globalThis.fetch = mock(async () =>
      new Response("", {
        status: 200,
        headers: { "content-type": "image/png" },
      }),
    ) as unknown as typeof fetch;
    const r = await verifyImageIsReachable("https://example.com/image.png");
    expect(r.ready).toBe(true);
    expect(r.reason).toBe("READY");
  });

  it("blocks when the URL returns an HTTP error", async () => {
    globalThis.fetch = mock(async () =>
      new Response("nope", { status: 404, headers: { "content-type": "text/plain" } }),
    ) as unknown as typeof fetch;
    const r = await verifyImageIsReachable("https://example.com/missing.png");
    expect(r.ready).toBe(false);
    expect(r.reason).toBe("NOT_PUBLIC");
  });
});