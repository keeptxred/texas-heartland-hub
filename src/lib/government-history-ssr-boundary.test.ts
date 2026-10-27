import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GOVERNMENT_HISTORY_AUTHORITY_PAGES } from "@/data/texas-government-history-authority";
import { TEXAS_LOCAL_GOVERNMENT_AUTHORITY_PAGES } from "@/data/texas-local-government-authority";
import { TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES } from "@/data/texas-municipal-government-authority";

const stateSlugs = [
  "texas-government-history", "texas-legislature-history", "governor-history",
  "lieutenant-governor-history", "speaker-of-the-house-history",
];
const groups = [
  { group: "state", pages: GOVERNMENT_HISTORY_AUTHORITY_PAGES.filter((page) => stateSlugs.includes(page.slug)) },
  { group: "local", pages: TEXAS_LOCAL_GOVERNMENT_AUTHORITY_PAGES },
  { group: "municipal", pages: TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES },
] as const;
const hub = readFileSync(new URL("../routes/texas-government.index.tsx", import.meta.url), "utf8");
const server = readFileSync(new URL("./government-history-route.functions.ts", import.meta.url), "utf8");

describe("government historical-authority SSR payload boundary", () => {
  it("keeps 21 distinct source-backed guide routes and exact canonical path ownership", () => {
    const pages = groups.flatMap((g) => g.pages);
    expect(pages.length).toBe(21);
    expect(new Set(pages.map((page) => page.slug)).size).toBe(21);
    for (const { group, pages: items } of groups) {
      for (const page of items) {
        const routeFile = new URL(`../routes/texas-government.${page.slug}.tsx`, import.meta.url);
        expect(existsSync(routeFile), page.slug).toBe(true);
        const source = readFileSync(routeFile, "utf8");
        expect(source, page.slug).toContain(`createFileRoute("/texas-government/${page.slug}")`);
        expect(source, page.slug).toContain(`group: "${group}", slug: "${page.slug}"`);
        expect(source, page.slug).toContain("loader: () => getGovernmentHistoryPage(");
        expect(source, page.slug).toContain("governmentHistoryAuthorityHead(loaderData)");
        expect(source, page.slug).toContain("Route.useLoaderData()");
        expect(source, page.slug).toContain("<GovernmentHistoryAuthorityPage page={page} />");
        expect(source, page.slug).not.toMatch(/import .* from ["']@\/data\/texas-(government-history|local-government|municipal-government)-authority/);
        expect(page.sources.length, page.slug).toBeGreaterThanOrEqual(3);
        expect(page.reviewed, page.slug).toMatch(/^20\d{2}-\d{2}-\d{2}$/);
      }
    }
  });

  it("preserves crawlable government hub cards with only light SSR summaries", () => {
    expect(hub).toContain("loader: () => getGovernmentHistoryDirectory()");
    expect(hub).toContain("const { state, local, municipal } = Route.useLoaderData()");
    for (const group of ["state", "local", "municipal"]) {
      expect(hub).toContain(`{${group}.map((page) => (`);
    }
    expect(hub).toContain('href={`/texas-government/${page.slug}`}');
    expect(hub).not.toMatch(/import .* from ["']@\/data\/texas-(government-history|local-government|municipal-government)-authority/);
    expect(server).toContain("pages.map(({ slug, title, description }) => ({ slug, title, description }))");
    expect(server).toContain('await import("@/data/texas-local-government-authority")');
    expect(server).toContain('await import("@/data/texas-municipal-government-authority")');
    expect(server).toContain('await import("@/data/texas-government-history-authority")');
  });
});
