import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES } from "@/data/texas-civil-war-reconstruction-authority";
import { TEXAS_POLITICAL_ERAS_AUTHORITY_PAGES } from "@/data/texas-political-eras-authority";

const groups = [
  { key: "civil-war", pages: TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES },
  { key: "eras", pages: TEXAS_POLITICAL_ERAS_AUTHORITY_PAGES },
] as const;
const fn = readFileSync(new URL("./politics-history-route.functions.ts", import.meta.url), "utf8");

describe("civil war and political eras server-rendering safety", () => {
  it("preserves all 13 source-backed canonical routes and FAQ content", () => {
    const pages = groups.flatMap((group) => [...group.pages]);
    expect(TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES).toHaveLength(7);
    expect(TEXAS_POLITICAL_ERAS_AUTHORITY_PAGES).toHaveLength(6);
    expect(new Set(pages.map((page) => page.slug)).size).toBe(13);
    for (const group of groups) {
      for (const page of group.pages) {
        const file = new URL(`../routes/texas-politics.${page.slug}.tsx`, import.meta.url);
        expect(existsSync(file), page.slug).toBe(true);
        const source = readFileSync(file, "utf8");
        expect(source, page.slug).toContain(`createFileRoute("/texas-politics/${page.slug}")`);
        expect(source, page.slug).toContain(`group: "${group.key}", slug: "${page.slug}"`);
        expect(source, page.slug).toContain("loader: () => getPoliticsHistoricalAuthorityPage(");
        expect(source, page.slug).toContain("politicalHistoryAuthorityHead(loaderData)");
        expect(source, page.slug).toContain("Route.useLoaderData()");
        expect(source, page.slug).toContain("<PoliticalHistoryAuthorityPage page={page} />");
        expect(source, page.slug).not.toMatch(/import .* from ["']@\/data\/texas-(civil-war-reconstruction|political-eras)-authority/);
        expect(page.reviewed, page.slug).toMatch(/^20\d{2}-\d{2}-\d{2}$/);
        expect(page.sources.length, page.slug).toBeGreaterThanOrEqual(3);
        expect(page.faqs.length, page.slug).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("does not let full history datasets escape the server function boundary", () => {
    expect(fn).toContain('await import("@/data/texas-civil-war-reconstruction-authority")');
    expect(fn).toContain('await import("@/data/texas-political-eras-authority")');
    expect(fn).toContain("Unknown Texas Civil War authority guide");
    expect(fn).toContain("Unknown Texas political-era authority guide");
  });
});
