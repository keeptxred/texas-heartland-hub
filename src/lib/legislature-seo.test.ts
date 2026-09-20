import { describe, expect, it } from "vitest";
import { legislatureSeo } from "@/lib/legislature-seo";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((item) => item[key] === value)?.content;
}

describe("Texas Legislature SEO", () => {
  it("uses the shared title and canonical normalization", () => {
    const seo = legislatureSeo({
      title: "Texas Legislature",
      description: "Texas Legislature reference hub.",
      path: "/texas-legislature",
      breadcrumb: "Texas Legislature",
    });

    expect(seo.meta.find((item) => "title" in item)?.title).toBe(
      "Texas Legislature | Keep TX Red",
    );
    expect(seo.links).toEqual([
      { rel: "canonical", href: "https://keeptxred.com/texas-legislature" },
    ]);
  });

  it("does not reuse Election Central artwork for legislature pages", () => {
    const seo = legislatureSeo({
      title: "Texas Senate",
      description: "Texas Senate reference page.",
      path: "/texas-legislature/senate",
      breadcrumb: "Texas Senate",
    });

    expect(metaContent(seo.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(seo.meta, "property", "og:image")).not.toContain(
      "election-central-social",
    );
  });

  it("inherits the shared robots and social metadata contract", () => {
    const seo = legislatureSeo({
      title: "Texas House of Representatives",
      description: "Texas House reference page.",
      path: "/texas-legislature/house",
      breadcrumb: "Texas House",
    });

    expect(metaContent(seo.meta, "name", "robots")).toBe(
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
    expect(metaContent(seo.meta, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
  });
});
