import { describe, expect, it } from "vitest";
import { buildSeo } from "@/lib/seo";

const liveArticlePath =
  "/news/live-2026-07-01-san-antonio-luxury-lodging-expands-with-the-monarch-opening-w4mj12";

function robotsContent(noindex?: boolean) {
  const seo = buildSeo({
    title: "Recovered live article",
    description: "A restored database-backed news article.",
    path: liveArticlePath,
    type: "article",
    ...(noindex === undefined ? {} : { noindex }),
  });

  return seo.meta.find((item) => item.name === "robots")?.content;
}

describe("SEO indexability overrides", () => {
  it("honors an explicit indexable decision for a restored database-backed live article", () => {
    expect(robotsContent(false)).toBe(
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
  });

  it("keeps the retired-static fallback when a route does not provide an indexability decision", () => {
    expect(robotsContent()).toBe(
      "noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
  });

  it("honors an explicit noindex decision", () => {
    expect(robotsContent(true)).toBe(
      "noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
  });
});
