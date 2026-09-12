import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { editorialStandardsHead } from "@/routes/editorial-standards";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((item) => item[key] === value)?.content;
}

describe("Editorial Standards SEO", () => {
  it("uses the shared title, canonical, and indexability contract", () => {
    const head = editorialStandardsHead();

    expect(head.meta.find((item) => "title" in item)?.title).toBe(
      "Editorial Standards | Keep TX Red",
    );
    expect(head.links).toEqual([
      { rel: "canonical", href: "https://keeptxred.com/editorial-standards" },
    ]);
    expect(metaContent(head.meta, "name", "robots")).toBe(
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
  });

  it("publishes complete share metadata for the trust page", () => {
    const head = editorialStandardsHead();

    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
    expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
  });
});
