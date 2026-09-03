import { describe, expect, it } from "vitest";
import { buildSeo } from "./seo";

const HERO = "/images/news/texas-policing-agencies-compared-seven-role-0c284fef115e.webp";

describe("policing comparison social image metadata", () => {
  it("emits the exact seven-role WebP in Open Graph and Twitter metadata", () => {
    const seo = buildSeo({
      title: "Texas Law Enforcement: Who does what?",
      description: "Texas law-enforcement roles compared.",
      path: "/news/texas-policing-agencies-compared",
      image: HERO,
      imageWidth: 1280,
      imageHeight: 672,
      type: "article",
    });
    const by = (key: string, value: string) => seo.meta.find((m) => m[key] === value)?.content;
    expect(by("property", "og:image")).toBe(`https://keeptxred.com${HERO}`);
    expect(by("property", "og:image:type")).toBe("image/webp");
    expect(by("property", "og:image:width")).toBe("1280");
    expect(by("property", "og:image:height")).toBe("672");
    expect(by("name", "twitter:image")).toBe(`https://keeptxred.com${HERO}`);
  });
});
