import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { texasBusinessHead } from "@/routes/texas-business";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((item) => item[key] === value)?.content;
}

const INDEX_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

describe("statewide hub shared SEO", () => {
  it("keeps the Texas Business hub indexable with complete shared metadata", () => {
    const head = texasBusinessHead();

    expect(head.meta.find((item) => "title" in item)?.title).toBe(
      "Texas Business: Economy, Jobs & Growth | Keep TX Red",
    );
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${SITE_URL}/texas-business`,
    });
    expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
    expect(metaContent(head.meta, "property", "og:url")).toBe(
      `${SITE_URL}/texas-business`,
    );
    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
    expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
  });

  it("keeps filtered Texas Business topic views out of the index", () => {
    const head = texasBusinessHead("energy");

    expect(metaContent(head.meta, "name", "robots")).toBe("noindex,follow");
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${SITE_URL}/texas-business`,
    });
  });
});
