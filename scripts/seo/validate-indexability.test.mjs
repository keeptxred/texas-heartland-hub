import { execFile } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const exec = promisify(execFile);
const script = fileURLToPath(new URL("./validate-indexability.mjs", import.meta.url));
const origin = "https://keeptxred.com";
const required = ["/contact-legislators", "/find-representative", "/laws", "/bills", "/texas-legislature"];

async function run(base, strict = true) {
  try {
    const { stdout, stderr } = await exec("node", ["--experimental-strip-types", script, "--base", base], {
      env: { ...process.env, SEO_REQUIRE_LIVE: strict ? "1" : "0", SEO_FULL_SCAN: "1" },
      timeout: 20_000,
    });
    return { code: 0, output: stdout + stderr };
  } catch (error) {
    return { code: error.code, output: String(error.stdout || "") + String(error.stderr || "") };
  }
}

async function withFixture(broken, check) {
  const server = createServer((req, res) => {
    const path = req.url;
    if (path === "/sitemap.xml") {
      return res.end("<sitemapindex><sitemap><loc>" + origin + "/sitemap-pages.xml</loc></sitemap></sitemapindex>");
    }
    if (path === "/sitemap-pages.xml") {
      const paths = broken ? [...required, "/shop/$productId"] : required;
      return res.end("<urlset>" + paths.map((p) => "<url><loc>" + origin + p + "</loc></url>").join("") + "</urlset>");
    }
    if (path === "/robots.txt") {
      return res.end("User-agent: *\nDisallow: /admin\nSitemap: " + origin + "/sitemap.xml\n");
    }
    const canonical = broken && path === "/bills" ? "" : "<link href='" + origin + path + "' rel='canonical'>";
    const meta = broken && path === "/texas-legislature" ? "<meta content='noindex,follow' name='googlebot'>" : "";
    if (broken && path === "/find-representative") res.setHeader("X-Robots-Tag", "noindex, follow");
    const heading = broken && path === "/laws" ? "Page not found" : "Texas reference";
    const link = broken && path === "/contact-legislators" ? '<a href="/news/$slug">Invalid</a>' : "";
    res.end("<html><head>" + canonical + meta + "</head><body><h1>" + heading + "</h1>" + link + "</body></html>");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    await check("http://127.0.0.1:" + server.address().port);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}

describe("production indexability guard", () => {
  it("passes valid canonical pages, including reversed single-quoted attributes", async () => {
    await withFixture(false, async (base) => {
      const result = await run(base);
      expect(result.code, result.output).toBe(0);
      expect(result.output).toContain("PASS");
    });
  }, 30_000);

  it("reports header/meta noindex, missing canonical, soft 404 and literal route leaks", async () => {
    await withFixture(true, async (base) => {
      const result = await run(base);
      expect(result.code, result.output).toBe(1);
      expect(result.output).toContain("Unresolved route parameter in sitemap: /shop/$productId");
      expect(result.output).toContain("/find-representative is noindex");
      expect(result.output).toContain("/texas-legislature is noindex");
      expect(result.output).toContain("/bills is missing its canonical tag");
      expect(result.output).toContain("/laws returns HTTP 200 with a not-found heading");
      expect(result.output).toContain("links to unresolved route template /news/$slug");
    });
  }, 30_000);

  it("fails required unreachable checks but preserves optional local checks", async () => {
    const requiredResult = await run("http://127.0.0.1:1");
    expect(requiredResult.code).toBe(1);
    expect(requiredResult.output).toContain("required live checks FAILED");
    const optionalResult = await run("http://127.0.0.1:1", false);
    expect(optionalResult.code).toBe(0);
    expect(optionalResult.output).toContain("local live checks skipped");
  }, 30_000);
});
