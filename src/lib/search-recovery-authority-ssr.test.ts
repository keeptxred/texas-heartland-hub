import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SEARCH_RECOVERY_AUTHORITY_GUIDES } from "@/data/search-recovery-authority";

const read = (path: string) => readFileSync(path, "utf8");
const detail = read("src/routes/texas-government.reference.$slug.tsx");
const hub = read("src/routes/texas-government.index.tsx");
const server = read("src/lib/search-recovery-authority.functions.ts");
const template = read("src/components/search-recovery-authority-page.tsx");

describe("server-only Texas government reference authority payload", () => {
  it("retains all eight distinct source-authority guides without eager route imports", () => {
    const guides = Object.values(SEARCH_RECOVERY_AUTHORITY_GUIDES);
    expect(guides).toHaveLength(8);
    expect(new Set(guides.map((guide) => guide.slug)).size).toBe(8);
    expect(server).toContain('await import("@/data/search-recovery-authority")');
    expect(server).toContain("getSearchRecoveryAuthorityDirectory");
    expect(server).toContain("getSearchRecoveryAuthorityGuide");
    expect(server).toContain("slug: guide.slug");
    expect(server).toContain("title: guide.title");
    expect(server).toContain("dek: guide.dek");
    expect(hub).not.toContain('import { SEARCH_RECOVERY_AUTHORITY_GUIDES }');
    expect(detail).not.toContain('import { SEARCH_RECOVERY_AUTHORITY_GUIDES }');
  });
  it("keeps SSR, genuine notFound, schema/canonical head and internal discovery", () => {
    expect(hub).toContain("getGovernmentHistoryDirectory()");
    expect(hub).toContain("getSearchRecoveryAuthorityDirectory()");
    expect(hub).toContain("return { ...history, references }");
    expect(hub).toContain("references.map((guide)");
    expect(hub).toContain('href={`/texas-government/reference/${guide.slug}`}');
    expect(detail).toContain("getSearchRecoveryAuthorityGuide({ data: { slug: params.slug } })");
    expect(detail).toContain("if (!guide) throw notFound()");
    expect(detail).toContain("searchRecoveryAuthorityHead(loaderData)");
    expect(detail).toContain("<SearchRecoveryAuthorityPage guide={Route.useLoaderData()} />");
    expect(template).toContain('type: "application/ld+json"');
    expect(template).toContain('"@type": "FAQPage"');
    expect(template).toContain("isBasedOn: guide.sources.map((source) => source.url)");
    expect(template).toContain("links: seo.links");
  });
});
