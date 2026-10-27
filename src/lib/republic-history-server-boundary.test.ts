import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES } from "@/data/texas-republic-government-authority";

const read = (path: string) => readFileSync(path, "utf8");

describe("Republic history server-only authority route boundary", () => {
  it("keeps all nine current records, their article structured metadata and SSR page renderers", () => {
    expect(TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES).toHaveLength(9);
    for (const page of TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES) {
      const path = `src/routes/texas-politics.${page.slug}.tsx`;
      const route = read(path);
      expect(route, path).toContain(`createFileRoute("/texas-politics/${page.slug}")`);
      expect(route, path).toContain(`getRepublicHistoryPage({ data: { slug: "${page.slug}" } })`);
      expect(route, path).toContain("politicalHistoryAuthorityHead(loaderData)");
      expect(route, path).toContain("<PoliticalHistoryAuthorityPage page={page} />");
      expect(route, path).toContain("Route.useLoaderData()");
      expect(route, path).not.toContain('from "@/data/texas-republic-government-authority"');
      expect(page.sources.length, page.slug).toBeGreaterThanOrEqual(5);
    }
  });

  it("SSR-renders hub discovery cards from the same reviewed authority cohort", () => {
    const hub = read("src/routes/texas-politics.index.tsx");
    const server = read("src/lib/republic-history-route.functions.ts");
    expect(hub).toContain("loader: () => getRepublicHistoryDirectory()");
    expect(hub).toContain("const republicHistoryPages = Route.useLoaderData()");
    expect(hub).toContain("republicHistoryPages.map((page)");
    expect(hub).toContain('href={`/texas-politics/${page.slug}`}');
    expect(hub).not.toContain('from "@/data/texas-republic-government-authority"');
    expect(server).toContain('createServerFn({ method: "GET" })');
    expect(server).toContain('import("@/data/texas-republic-government-authority")');
    expect(server).toContain("TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES.find");
    expect(server).toContain("TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES.map");
    for (const field of ["slug: page.slug", "title: page.title", "description: page.description"]) {
      expect(server).toContain(field);
    }
  });
});
