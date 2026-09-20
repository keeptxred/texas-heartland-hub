import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

describe("GSC sitemap indexability regressions", () => {
  it("suppresses parent canonicals while nested civic, data, editorial and agency pages are active", () => {
    const source = read("src/lib/leaf-only-parent-heads.ts");

    expect(source).toContain('import { Route as civicToolsRoute } from "@/routes/civic-tools";');
    expect(source).toContain('import { Route as dataRoute } from "@/routes/data";');
    expect(source).toContain('import { Route as texasCaseRoute } from "@/routes/texas-case";');
    expect(source).toContain('import { Route as texasGovernmentAgenciesRoute } from "@/routes/texas-government.agencies";');
    expect(source).toMatch(/LEAF_ONLY_PARENT_HEAD_ROUTES[\s\S]*civicToolsRoute,/);
    expect(source).toMatch(/LEAF_ONLY_PARENT_HEAD_ROUTES[\s\S]*dataRoute,/);
    expect(source).toMatch(/LEAF_ONLY_PARENT_HEAD_ROUTES[\s\S]*texasCaseRoute,/);
    expect(source).toMatch(/LEAF_ONLY_PARENT_HEAD_ROUTES[\s\S]*texasGovernmentAgenciesRoute,/);
    expect(source).toContain("if (!leafMatch || leafMatch.id !== context.match.id) return {};");
  });

  it("installs the leaf-only parent head protection before router creation", () => {
    const source = read("src/router.tsx");
    expect(source).toContain("applyLeafOnlyParentHeadFixes();");
    expect(source.indexOf("applyLeafOnlyParentHeadFixes();")).toBeLessThan(source.indexOf("createRouter({"));
  });
});
