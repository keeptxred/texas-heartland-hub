import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { happeningNowHead } from "./happening-now";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((entry) => entry[key] === value)?.content;
}

describe("Happening Now shared SEO", () => {
  it("uses the shared indexable metadata contract and preserves newsroom JSON-LD", () => {
    const head = happeningNowHead();

    expect(head.meta.find((entry) => entry.title)?.title).toBe(
      "Happening Now — Latest Texas News | Keep TX Red",
    );
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: "https://keeptxred.com/happening-now",
    });
    expect(metaContent(head.meta, "name", "robots")).toBe(
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:card")).toBe("summary_large_image");

    const structuredData = JSON.parse(head.scripts[0].children);
    expect(structuredData["@graph"].some((node: { "@type": string }) => node["@type"] === "CollectionPage")).toBe(true);
    expect(structuredData["@graph"].some((node: { "@type": string }) => node["@type"] === "NewsMediaOrganization")).toBe(true);
  });
});
