import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DMV_EVERGREEN_SITEMAP_PATHS } from "@/data/dmv-evergreen-sitemap-paths";

const rootSitemap = readFileSync(new URL("../routes/sitemap[.]xml.ts", import.meta.url), "utf8");
const dmvSitemap = readFileSync(new URL("../routes/sitemap-dmv[.]xml.ts", import.meta.url), "utf8");

function routeSourcePath(path: string): URL {
  if (path === "/dmv") return new URL("../routes/dmv.tsx", import.meta.url);
  const [section, slug] = path.slice(1).split("/");
  return new URL(`../routes/${section}.${slug}.tsx`, import.meta.url);
}

describe("DMV evergreen sitemap ownership", () => {
  it("advertises the dedicated DMV primary sitemap", () => {
    expect(rootSitemap).toContain('"sitemap-dmv.xml"');
    expect(dmvSitemap).toContain("DMV_EVERGREEN_SITEMAP_PATHS");
  });

  it("keeps the complete evergreen DMV and vehicle cluster canonical on KeepTXRed", () => {
    expect(DMV_EVERGREEN_SITEMAP_PATHS).toHaveLength(38);
    expect(new Set(DMV_EVERGREEN_SITEMAP_PATHS).size).toBe(DMV_EVERGREEN_SITEMAP_PATHS.length);
    expect(DMV_EVERGREEN_SITEMAP_PATHS).not.toContain("/find-my-dmv");

    for (const path of DMV_EVERGREEN_SITEMAP_PATHS) {
      const sourcePath = routeSourcePath(path);
      expect(existsSync(sourcePath), `${path} route source must exist`).toBe(true);
      const source = readFileSync(sourcePath, "utf8");
      expect(source, `${path} must keep its canonical route`).toContain(`createFileRoute("${path}")`);
      expect(source, `${path} must not become a redirect while advertised`).not.toContain("throw redirect");
    }
  });
});
