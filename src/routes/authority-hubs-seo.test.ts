import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { texasLawEnforcementHead } from "./texas-law-enforcement";
import { texasAgencyDirectoryHead } from "./texas-government.agencies";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((entry) => entry[key] === value)?.content;
}

const INDEX_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

function expectSharedHub(
  head: { meta: Array<Record<string, string>>; links: Array<Record<string, string>> },
  title: string,
  path: string,
) {
  expect(head.meta.find((entry) => entry.title)?.title).toBe(title);
  expect(head.links).toContainEqual({ rel: "canonical", href: `${SITE_URL}${path}` });
  expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
  expect(metaContent(head.meta, "property", "og:url")).toBe(`${SITE_URL}${path}`);
  expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
  expect(metaContent(head.meta, "name", "twitter:card")).toBe("summary_large_image");
  expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
}

describe("authority hub shared SEO", () => {
  it("standardizes Texas Law Enforcement metadata", () => {
    expectSharedHub(
      texasLawEnforcementHead(),
      "Texas Law Enforcement, DPS & Public Safety | Keep TX Red",
      "/texas-law-enforcement",
    );
  });

  it("standardizes the Texas agency directory while preserving CollectionPage JSON-LD", () => {
    const head = texasAgencyDirectoryHead();

    expectSharedHub(
      head,
      "Texas State Agency Directory & Profiles | Keep TX Red",
      "/texas-government/agencies",
    );

    const structuredData = JSON.parse(head.scripts[0].children);
    expect(structuredData["@type"]).toBe("CollectionPage");
    expect(structuredData.url).toBe(`${SITE_URL}/texas-government/agencies`);
    expect(structuredData.mainEntity["@type"]).toBe("ItemList");
  });
});
