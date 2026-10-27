import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES } from "@/data/texas-political-history-authority";

const server = readFileSync("src/lib/texas-political-history-route.functions.ts", "utf8");
const template = readFileSync("src/components/political-history-authority-page.tsx", "utf8");

describe("four source-backed Texas political-history SSR routes", () => {
  it("preserves the exact original four articles and official-source metadata", () => {
    expect(TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES).toHaveLength(4);
    expect(new Set(TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES.map((page) => page.slug)).size).toBe(4);
    expect(server).toContain('await import("@/data/texas-political-history-authority")');
    for (const page of TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES) {
      const route = readFileSync(`src/routes/texas-politics.${page.slug}.tsx`, "utf8");
      expect(route).toContain(`createFileRoute("/texas-politics/${page.slug}")`);
      expect(route).toContain(`slug: "${page.slug}"`);
      expect(route).toContain("loader: () => getTexasPoliticalHistoryPage(");
      expect(route).toContain("politicalHistoryAuthorityHead(loaderData)");
      expect(route).toContain("<PoliticalHistoryAuthorityPage page={page} />");
      expect(route).toContain("Route.useLoaderData()");
      expect(route).not.toContain('from "@/data/texas-political-history-authority"');
      expect(page.reviewed).toMatch(/^20\d{2}-\d{2}-\d{2}$/);
      expect(page.sources.length).toBeGreaterThanOrEqual(3);
      expect(page.faqs.length).toBeGreaterThanOrEqual(3);
    }
  });
  it("maintains server-rendered structured Article, FAQ, breadcrumbs, canonical and source citations", () => {
    expect(template).toContain('links: [{ rel: "canonical", href: canonical }]');
    expect(template).toContain('"@type": "Article"');
    expect(template).toContain('"@type": "FAQPage"');
    expect(template).toContain('"@type": "BreadcrumbList"');
    expect(template).toContain("dateModified: page.reviewed");
    expect(template).toContain("citation: page.sources.map");
  });
});
