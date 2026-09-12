import { describe, expect, it } from "vitest";
import heroImg from "@/assets/about-hero.png.asset.json";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { aboutHead } from "@/routes/about";
import { contactHead } from "@/routes/contact";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((item) => item[key] === value)?.content;
}

const INDEX_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

describe("About and Contact shared SEO", () => {
  it("keeps About on the shared indexability and social metadata contract", () => {
    const head = aboutHead();

    expect(head.meta.find((item) => "title" in item)?.title).toBe(
      "About: Texas News & Editorial Standards | Keep TX Red",
    );
    expect(head.links).toEqual([
      { rel: "canonical", href: `${SITE_URL}/about` },
    ]);
    expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
    expect(metaContent(head.meta, "property", "og:image")).toBe(
      `${SITE_URL}${heroImg.url}`,
    );
    expect(metaContent(head.meta, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
    expect(metaContent(head.meta, "name", "twitter:image")).toBe(
      `${SITE_URL}${heroImg.url}`,
    );
  });

  it("keeps Contact branded once with complete default share metadata", () => {
    const head = contactHead();

    expect(head.meta.find((item) => "title" in item)?.title).toBe(
      "Contact: Newsroom & Order Support | Keep TX Red",
    );
    expect(head.links).toEqual([
      { rel: "canonical", href: `${SITE_URL}/contact` },
    ]);
    expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
    expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
  });
});
