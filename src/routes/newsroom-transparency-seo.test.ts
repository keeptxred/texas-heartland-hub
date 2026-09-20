import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { authorsIndexHead } from "@/routes/authors.index";
import { sourcesIndexHead } from "@/routes/sources.index";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((item) => item[key] === value)?.content;
}

const INDEX_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

const hubs = [
  {
    name: "Editorial Bylines",
    head: authorsIndexHead,
    path: "/authors",
    title: "Editorial Bylines & Desks | Keep TX Red",
  },
  {
    name: "Sources",
    head: sourcesIndexHead,
    path: "/sources",
    title: "Sources & Primary Records | Keep TX Red",
  },
] as const;

describe("newsroom transparency hub SEO", () => {
  for (const hub of hubs) {
    it(`${hub.name} uses the complete shared metadata contract`, () => {
      const head = hub.head();

      expect(head.meta.find((item) => "title" in item)?.title).toBe(hub.title);
      expect(head.links).toEqual([
        { rel: "canonical", href: `${SITE_URL}${hub.path}` },
      ]);
      expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
      expect(metaContent(head.meta, "property", "og:url")).toBe(
        `${SITE_URL}${hub.path}`,
      );
      expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
      expect(metaContent(head.meta, "name", "twitter:card")).toBe(
        "summary_large_image",
      );
      expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
    });
  }
});
