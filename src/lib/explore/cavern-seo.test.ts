import { describe, expect, it } from "vitest";
import { exploreDestinations } from "@/data/explore/all-destinations";
import { buildSeo } from "@/lib/seo";
import { buildCavernSeo, getCavernSeoOverride } from "@/lib/explore/cavern-seo";

const cavern = exploreDestinations.find((destination) => destination.entityType === "cavern");
const nonCavern = exploreDestinations.find((destination) => destination.entityType !== "cavern");

describe("cavern SEO metadata", () => {
  it("builds cave-tour search metadata for cavern destinations", () => {
    expect(cavern).toBeDefined();
    const metadata = buildCavernSeo(cavern!);

    expect(metadata?.title).toContain(cavern!.name);
    expect(metadata?.title).toContain("Tours");
    expect(metadata?.title).toContain("Tickets");
    expect(metadata?.description).toContain("Plan a visit");
    expect(metadata?.description).toContain("nearby attractions");
    expect(metadata?.keywords).toContain("Texas cavern tours");
    expect(metadata?.keywords).toContain(`${cavern!.name} tickets`);
  });

  it("resolves metadata only for individual cavern paths", () => {
    expect(cavern).toBeDefined();
    expect(getCavernSeoOverride(`/explore/${cavern!.slug}`)).not.toBeNull();
    expect(getCavernSeoOverride("/explore/caverns")).toBeNull();
    expect(getCavernSeoOverride("/explore/search")).toBeNull();
    expect(getCavernSeoOverride("/news/texas")).toBeNull();
  });

  it("does not specialize non-cavern destinations", () => {
    expect(nonCavern).toBeDefined();
    expect(buildCavernSeo(nonCavern!)).toBeNull();
    expect(getCavernSeoOverride(`/explore/${nonCavern!.slug}`)).toBeNull();
  });

  it("applies cavern wording to title, Open Graph, and Twitter without changing the canonical", () => {
    expect(cavern).toBeDefined();
    const path = `/explore/${cavern!.slug}`;
    const seo = buildSeo({
      title: `${cavern!.name} Visitor Guide | Explore Texas`,
      description: cavern!.summary || "Generic destination description",
      path,
      type: "article",
    });

    const title = seo.meta.find((item) => "title" in item)?.title;
    const ogTitle = seo.meta.find((item) => item.property === "og:title")?.content;
    const twitterTitle = seo.meta.find((item) => item.name === "twitter:title")?.content;

    expect(title).toContain("Tours");
    expect(ogTitle).toBe(title);
    expect(twitterTitle).toBe(title);
    expect(seo.links).toEqual([
      { rel: "canonical", href: `https://keeptxred.com${path}` },
    ]);
  });
});
