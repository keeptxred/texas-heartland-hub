import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { issuesHead } from "@/routes/issues/index";
import { policyToolsHead } from "@/routes/tools/index";
import { texasEnergyHead } from "@/routes/texas-energy";
import { texasEconomyHead } from "@/routes/texas-economy";
import { houstonHead } from "@/routes/houston";

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
    name: "Issues",
    head: issuesHead,
    path: "/issues",
    title: "Texas Issues & Policy Guides | Keep TX Red",
  },
  {
    name: "Policy Tools",
    head: policyToolsHead,
    path: "/tools",
    title: "Texas Policy Tools & Calculators | Keep TX Red",
  },
  {
    name: "Texas Energy",
    head: texasEnergyHead,
    path: "/texas-energy",
    title: "Texas Energy: ERCOT, Oil & Permian Basin | Keep TX Red",
  },
  {
    name: "Texas Economy",
    head: texasEconomyHead,
    path: "/texas-economy",
    title: "Texas Economy: Jobs, Taxes & Business Policy | Keep TX Red",
  },
  {
    name: "Houston",
    head: houstonHead,
    path: "/houston",
    title: "Houston News, Politics & Business | Keep TX Red",
  },
] as const;

describe("core discovery hub shared SEO", () => {
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
