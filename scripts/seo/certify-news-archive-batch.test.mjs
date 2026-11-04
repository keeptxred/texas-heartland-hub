import { describe, expect, it } from "vitest";
import { csvRow, loadLedger, selectBatch, assess } from "./certify-news-archive-batch.mjs";

const base = {
  url: "https://keeptxred.com/news/example",
  disposition: "C",
  expected_indexability: "noindex",
  decision_state: "PROVISIONAL_TRIAGE",
  redirect_to: "",
};
const html = (robots = "noindex,follow", canonical = base.url, schema = false) =>
  '<html><head><meta name="robots" content="' + robots +
  '"><link rel="canonical" href="' + canonical + '">' +
  (schema ? '<script type="application/ld+json">{"@type":"NewsArticle"}</script>' : "") +
  "</head><body>Public archive</body></html>";

describe("KTR Phase 2A archive verification", () => {
  it("parses quoted CSV with comma punctuation, enforces canonical dedupe and batches at 25 max default", () => {
    expect(csvRow('"one","with ""quoted"" value","third"')).toEqual(["one", 'with "quoted" value', "third"]);
    const keys = "url,disposition,expected_indexability,decision_state";
    const row = (n) => '"https://keeptxred.com/news/story-' + n + '","C","noindex","PROVISIONAL_TRIAGE"';
    const ledger = loadLedger(keys + "\n" + Array.from({ length: 51 }, (_, i) => row(i)).join("\n") + "\n");
    expect(ledger).toHaveLength(51);
    expect(selectBatch(ledger, 0).rows).toHaveLength(25);
    expect(selectBatch(ledger, 1).rows).toHaveLength(25);
    expect(selectBatch(ledger, 2).rows).toHaveLength(1);
    expect(() => selectBatch(ledger, 3)).toThrow();
    expect(() => selectBatch(ledger, 0, 400)).toThrow();
    expect(() => loadLedger(keys + "\n" + row(0) + "\n" + row(0))).toThrow(/Duplicate/);
    expect(() => loadLedger(keys + '\n"https://evil.example/news/abc","C","noindex","PROVISIONAL_TRIAGE"')).toThrow(/Non-canonical/);
  });

  it("certifies public nonindex article only when robots, schema and sitemap all agree", () => {
    const ok = assess(base, { status: 200, html: html() }, ["<urlset></urlset>"]);
    expect(ok.passedHttpPolicy).toBe(true);
    expect(ok.hasNewsArticleSchema).toBe(false);
    const missing = assess(base, { status: 200, html: html("index,follow") }, []);
    expect(missing.errors).toContain("missing-noindex");
    const schema = assess(base, { status: 200, html: html("noindex", base.url, true) }, []);
    expect(schema.errors).toContain("noindex-NewsArticle-schema");
    const sitemap = assess(base, { status: 200, html: html() }, ['<urlset><loc>' + base.url + "</loc></urlset>"]);
    expect(sitemap.errors).toContain("suppressed-URL-advertised-in-sitemap");
  });

  it("protects indexable authority pages and exact self canonicals", () => {
    const indexable = { ...base, disposition: "A", expected_indexability: "potential-indexable" };
    expect(assess(indexable, { status: 200, html: html("index,follow") }).passedHttpPolicy).toBe(true);
    expect(assess(indexable, { status: 200, html: html() }).errors).toContain("unexpected-noindex");
    expect(assess(indexable, { status: 200, html: html("index,follow", "https://keeptxred.com/news/elsewhere") }).errors).toContain("canonical-mismatch");
  });

  it("requires true permanent redirects and 404/410 for retired URLs", () => {
    const moved = {
      ...base, disposition: "D", expected_indexability: "redirect",
      redirect_to: "https://keeptxred.com/news/survivor",
    };
    expect(assess(moved, { status: 301, location: "/news/survivor" }).passedHttpPolicy).toBe(true);
    expect(assess(moved, { status: 302, location: "/news/survivor" }).errors).toContain("missing-permanent-redirect-302");
    expect(assess(moved, { status: 301, location: "/news/other" }).errors).toContain("redirect-target-mismatch");
    const retired = { ...base, disposition: "E", expected_indexability: "none" };
    expect(assess(retired, { status: 404 }).passedHttpPolicy).toBe(true);
    expect(assess(retired, { status: 200 }).errors).toContain("retired-URL-still-serves-200");
  });

  it("flags unreviewed indexable candidates and never mistakes HTTP pass for editorial certification", () => {
    const pending = { ...base, disposition: "B", expected_indexability: "pending" };
    expect(assess(pending, { status: 200, html: html("index,follow") }).errors).toContain("unreviewed-candidate-indexable");
    const reviewed = assess({ ...base, decision_state: "PROVISIONAL_TRIAGE" }, { status: 200, html: html() });
    expect(reviewed.passedHttpPolicy).toBe(true);
    expect(reviewed.cautions).toContain("editorial-disposition-still-provisional");
  });
});