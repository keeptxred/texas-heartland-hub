import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { topicsHead } from "@/routes/topics";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((item) => item[key] === value)?.content;
}

describe("Topics hub SEO", () => {
  it("uses the shared title, canonical, and robots contract", () => {
    const head = topicsHead();

    expect(head.meta.find((item) => "title" in item)?.title).toBe(
      "Texas Coverage Topics & Content Pillars | Keep TX Red",
    );
    expect(head.links).toEqual([
      { rel: "canonical", href: "https://keeptxred.com/topics" },
    ]);
    expect(metaContent(head.meta, "name", "robots")).toBe(
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
  });

  it("publishes complete social preview metadata", () => {
    const head = topicsHead();

    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
    expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
  });
});
