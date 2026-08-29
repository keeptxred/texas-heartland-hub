import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routeDirectory = new URL("./", import.meta.url);
const exploreRouteFiles = readdirSync(routeDirectory)
  .filter(
    (file) =>
      (file === "explore.tsx" || (file.startsWith("explore.") && file.endsWith(".tsx"))) &&
      !file.includes(".test."),
  )
  .sort();

describe("KeepTXRed Explore site boundary", () => {
  it("keeps every public Explore route retired to TexasDefined", () => {
    expect(exploreRouteFiles.length).toBeGreaterThan(10);

    for (const file of exploreRouteFiles) {
      const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
      expect(source, `${file} must remain an Explore route`).toContain('createFileRoute("/explore');
      expect(source, `${file} must redirect to TexasDefined`).toContain("https://texasdefined.com");
      expect(source, `${file} must use a permanent redirect`).toContain("statusCode: 301");
      expect(source, `${file} must preserve query parameters`).toContain("location.searchStr");
      expect(source, `${file} must not own KTR SEO`).not.toContain("buildSeo");
      expect(source, `${file} must not render KTR Explore content`).not.toContain("component:");
      expect(source, `${file} must not claim a KTR Explore canonical`).not.toContain(
        "https://keeptxred.com/explore",
      );
    }
  });
});
