import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { texasBusinessHead } from "@/routes/texas-business";
import { texasVeteransHead } from "@/routes/texas-veterans";
import { texasAgricultureHead } from "@/routes/texas-agriculture";
import { texasBorderSecurityHead } from "@/routes/texas-border-security";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((item) => item[key] === value)?.content;
}

const INDEX_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
const NOINDEX_ROBOTS =
  "noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

function expectSharedHub(
  head: ReturnType<typeof texasVeteransHead>,
  title: string,
  path: string,
) {
  expect(head.meta.find((item) => "title" in item)?.title).toBe(title);
  expect(head.links).toContainEqual({ rel: "canonical", href: `${SITE_URL}${path}` });
  expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
  expect(metaContent(head.meta, "property", "og:url")).toBe(`${SITE_URL}${path}`);
  expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
  expect(metaContent(head.meta, "name", "twitter:card")).toBe("summary_large_image");
  expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
}

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

    expect(metaContent(head.meta, "name", "robots")).toBe(NOINDEX_ROBOTS);
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${SITE_URL}/texas-business`,
    });
  });

  it("standardizes the Texas Veterans authority hub", () => {
    expectSharedHub(
      texasVeteransHead(),
      "Texas Veterans & Military Benefits & Policy | Keep TX Red",
      "/texas-veterans",
    );
  });

  it("standardizes the Texas Agriculture authority hub", () => {
    expectSharedHub(
      texasAgricultureHead(),
      "Texas Agriculture, Farms & Rural Policy | Keep TX Red",
      "/texas-agriculture",
    );
  });

  it("standardizes the Texas Border Security authority hub", () => {
    expectSharedHub(
      texasBorderSecurityHead(),
      "Texas Border Security & Immigration Policy | Keep TX Red",
      "/texas-border-security",
    );
  });
});
