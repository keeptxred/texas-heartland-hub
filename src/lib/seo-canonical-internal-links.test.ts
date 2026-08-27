import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sourceFiles = [
  "src/components/site-header.tsx",
  "src/components/site-footer.tsx",
  "src/components/sports-coverage-placeholder.tsx",
  "src/components/city-page.tsx",
  "src/routes/texas-sports.index.tsx",
  "src/routes/texas-government.tsx",
  "src/routes/texas-government.$entitySlug.tsx",
  "src/routes/texas-politics.figures.tsx",
  "src/routes/texas-politics.figures_.$figureSlug.tsx",
  "src/lib/elections/internalLinks.ts",
  "src/data/search-console-priority-urls.json",
  "public/llms.txt",
];

const legacyWwwHost = "www." + "keeptxred.com/";
const redirectAliases = [
  'to="/texas-news"',
  'href="/texas-news"',
  'texasNews: "/texas-news"',
  'to="/elections"',
  'href="/elections"',
  'livingInTexas: "/living-in-texas"',
  "http://keeptxred.com/",
  `http://${legacyWwwHost}`,
  `https://${legacyWwwHost}`,
  "https://keeptxred.com/texas-news/",
  "/texas-business?topic=relocations",
  "/texas-business?topic=energy",
  "/texas-news?topic=education",
  "/news/homestead-exemption-explained",
  "/news/texas-property-tax-guide",
];

const canonicalRouteChecks = [
  ["src/routes/shop.index.tsx", "https://keeptxred.com/shop"],
  ["src/routes/texas-sports.index.tsx", "https://keeptxred.com/texas-sports"],
  ["src/routes/texas-economy.tsx", "https://keeptxred.com/texas-economy"],
] as const;

describe("canonical internal links", () => {
  it("does not route high-traffic internal links through known redirect aliases", () => {
    for (const file of sourceFiles) {
      const source = readFileSync(file, "utf8");
      for (const alias of redirectAliases) {
        expect(source, `${file} must not contain redirecting internal link ${alias}`).not.toContain(alias);
      }
    }
  });

  it("keeps key Search Console pages self-canonical", () => {
    for (const [file, canonical] of canonicalRouteChecks) {
      const source = readFileSync(file, "utf8");
      const canonicalPath = new URL(canonical).pathname;
      const literalCanonical = `rel: "canonical", href: "${canonical}"`;
      const siteUrlCanonical = `rel: "canonical", href: \`\${SITE_URL}${canonicalPath}\``;
      expect(
        source.includes(literalCanonical) || source.includes(siteUrlCanonical),
        `${file} must declare ${canonical} as canonical`,
      ).toBe(true);
    }
  });

  it("keeps the Texas politics parent as a canonical-free layout", () => {
    const layout = readFileSync("src/routes/texas-politics.tsx", "utf8");
    const index = readFileSync("src/routes/texas-politics.index.tsx", "utf8");

    expect(layout).toContain("<Outlet />");
    expect(layout).not.toContain('rel: "canonical"');
    expect(index).toContain('rel: "canonical", href: canonical');
    expect(index).toContain('createFileRoute("/texas-politics/")');
  });
});
