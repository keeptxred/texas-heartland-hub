import fs from "node:fs";
import { describe, expect, it } from "vitest";

const profileRoute = fs.readFileSync(new URL("../routes/sources.$slug.tsx", import.meta.url), "utf8");
const sourceSitemap = fs.readFileSync(new URL("../routes/sitemap-sources[.]xml.ts", import.meta.url), "utf8");
const sitemapIndex = fs.readFileSync(new URL("../routes/sitemap[.]xml.ts", import.meta.url), "utf8");
const sourceHub = fs.readFileSync(new URL("../routes/sources.index.tsx", import.meta.url), "utf8");

describe("AdSense source transparency indexability", () => {
  it("keeps the substantive source hub indexable", () => {
    expect(sourceHub).toContain('canonical", href: "https://keeptxred.com/sources"');
    expect(sourceHub).not.toContain('name: "robots", content: "noindex');
  });

  it("keeps individual thin source profiles accessible but noindex", () => {
    expect(profileRoute).toContain('{ name: "robots", content: "noindex,follow" }');
    expect(profileRoute).toContain('to="/sources"');
  });

  it("publishes only the source hub in the source sitemap", () => {
    expect(sourceSitemap).toContain('{ loc: `${BASE_URL}/sources`, lastmod: SOURCE_AUTHORITY_LASTMOD }');
    expect(sourceSitemap).not.toContain("SOURCE_AUTHORITY_PROFILES");
    expect(sourceSitemap).not.toContain("/sources/${profile.slug}");
  });

  it("keeps the one-URL source sitemap advertised without exposing thin profiles", () => {
    expect(sitemapIndex).toContain('"sitemap-sources.xml"');
    expect(sourceSitemap).toContain('{ loc: `${BASE_URL}/sources`, lastmod: SOURCE_AUTHORITY_LASTMOD }');
    expect(sourceSitemap).not.toContain("SOURCE_AUTHORITY_PROFILES.length + 1");
  });
});
