import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { texasGovernmentHead } from "./texas-government.index";
import { texasPoliticsHead } from "./texas-politics.index";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((entry) => entry[key] === value)?.content;
}

const INDEX_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
const NOINDEX_ROBOTS =
  "noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

describe("Texas Government and Politics shared SEO", () => {
  it("standardizes the Texas Government hub while preserving structured data", () => {
    const head = texasGovernmentHead();

    expect(head.meta.find((entry) => entry.title)?.title).toBe(
      "Texas Government: Offices, Powers & Elections | Keep TX Red",
    );
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${SITE_URL}/texas-government`,
    });
    expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:card")).toBe("summary_large_image");
    expect(head.scripts).toHaveLength(1);

    const structuredData = JSON.parse(head.scripts[0].children);
    expect(structuredData).toBeTruthy();
  });

  it("keeps the Texas Politics root indexable and self-canonical", () => {
    const head = texasPoliticsHead();

    expect(head.meta.find((entry) => entry.title)?.title).toBe(
      "Texas Politics, Elections & Political History | Keep TX Red",
    );
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${SITE_URL}/texas-politics`,
    });
    expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:card")).toBe("summary_large_image");
  });

  it("keeps filtered Texas Politics views out of the index", () => {
    const head = texasPoliticsHead("elections");

    expect(metaContent(head.meta, "name", "robots")).toBe(NOINDEX_ROBOTS);
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${SITE_URL}/texas-politics`,
    });
  });
});
