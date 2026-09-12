import { describe, expect, it } from "vitest";
import heroFlag from "@/assets/hero-flag.jpg";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { newsHead } from "./news.index";
import { getInvolvedHead } from "./get-involved";
import { keepTexasRedHead } from "./keep-texas-red";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((entry) => entry[key] === value)?.content;
}

const INDEX_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

describe("News and civic shared SEO", () => {
  it("standardizes the News hub", () => {
    const head = newsHead();

    expect(head.meta.find((entry) => entry.title)?.title).toBe(
      "Texas Political News | Keep TX Red",
    );
    expect(head.links).toContainEqual({ rel: "canonical", href: `${SITE_URL}/news` });
    expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
    expect(metaContent(head.meta, "property", "og:url")).toBe(`${SITE_URL}/news`);
    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:card")).toBe("summary_large_image");
    expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
  });

  it("standardizes Get Involved", () => {
    const head = getInvolvedHead();

    expect(head.meta.find((entry) => entry.title)?.title).toBe(
      "Get Involved: Texas Voting & Civic Action | Keep TX Red",
    );
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${SITE_URL}/get-involved`,
    });
    expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
    expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
  });

  it("keeps the Keep Texas Red pillar as an article with its real hero image and JSON-LD", () => {
    const head = keepTexasRedHead();
    const expectedImage = heroFlag.startsWith("http") ? heroFlag : `${SITE_URL}${heroFlag.startsWith("/") ? "" : "/"}${heroFlag}`;

    expect(head.meta.find((entry) => entry.title)?.title).toBe(
      "Keep Texas Red: Elections, Policy & Government | Keep TX Red",
    );
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${SITE_URL}/keep-texas-red`,
    });
    expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
    expect(metaContent(head.meta, "property", "og:type")).toBe("article");
    expect(metaContent(head.meta, "property", "og:image")).toBe(expectedImage);
    expect(metaContent(head.meta, "name", "twitter:image")).toBe(expectedImage);
    expect(metaContent(head.meta, "property", "article:published_time")).toBe("2026-06-27");
    expect(metaContent(head.meta, "property", "article:modified_time")).toBe("2026-08-04");

    expect(head.scripts).toHaveLength(2);
    expect(JSON.parse(head.scripts[0].children)["@type"]).toBe("Article");
    expect(JSON.parse(head.scripts[1].children)["@type"]).toBe("BreadcrumbList");
  });
});
