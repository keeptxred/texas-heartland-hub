import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { citationGuideHead } from "@/routes/citation-guide";
import { glossaryHead } from "@/routes/glossary";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((item) => item[key] === value)?.content;
}

const INDEX_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

describe("reference page shared SEO", () => {
  it("publishes complete Citation Guide metadata", () => {
    const head = citationGuideHead();

    expect(head.meta.find((item) => "title" in item)?.title).toBe(
      "Texas Reference Citation Guide | Keep TX Red",
    );
    expect(head.links).toEqual([
      { rel: "canonical", href: `${SITE_URL}/citation-guide` },
    ]);
    expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
    expect(metaContent(head.meta, "property", "og:url")).toBe(
      `${SITE_URL}/citation-guide`,
    );
    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
  });

  it("uses an absolute canonical social URL for the Political Glossary", () => {
    const head = glossaryHead();

    expect(head.meta.find((item) => "title" in item)?.title).toBe(
      "Texas Political Glossary | Keep TX Red",
    );
    expect(head.links).toEqual([
      { rel: "canonical", href: `${SITE_URL}/glossary` },
    ]);
    expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
    expect(metaContent(head.meta, "property", "og:url")).toBe(
      `${SITE_URL}/glossary`,
    );
    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
  });
});
