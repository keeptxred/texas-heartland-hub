import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SOURCE_CONCURRENCY, REQUEST_TIMEOUT_MS, classifySourceResult,
  extractAuthoritySources, collectAuthorityLinks, auditSourceLinks,
  formatSourceReport, probeSource,
} from "./check-authority-source-links.mjs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

test("source audit inventories every actual guide without counting navigation links", () => {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/data");
  const inventory = collectAuthorityLinks(root);
  assert.ok(inventory.files.length >= 18);
  assert.ok(inventory.refs.size >= 18);
  assert.ok([...inventory.refs.values()].every((files) => files.length >= 1));
  assert.ok([...inventory.refs.keys()].every((url) => url.startsWith("https://")));
});

test("quoted and unquoted authority source blocks; exclude unrelated navigation URLs", () => {
  const sample = [
    'sources: [',
    ' { url: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.153.htm" },',
    " { 'url': 'https://tcss.legis.texas.gov/resources/FA/htm/FA.102.htm' },",
    ' { "url": "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB02052F.HTM" },',
    ' { url: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.153.htm" },',
    '],',
    'related: [{ "url": "https://wrong.example.com/unrelated" }]',
  ].join("\n");
  const urls = extractAuthoritySources(sample, "test.ts");
  assert.equal(urls.length, 3);
  assert.ok(urls.every((x) => !x.includes("unrelated")));
  assert.throws(() => extractAuthoritySources('sources: [{url:"http://foo.com"}, {url:"https://foo.com"}, {url:"https://bar.com"}]', "bad.ts"), /non-HTTPS/);
  assert.throws(() => extractAuthoritySources("related: []", "missing.ts"), /no sources/);
});

test("only true HTTP 404 and 410 count as broken; blocked/transient are unverified", () => {
  assert.equal(classifySourceResult(200), "healthy");
  assert.equal(classifySourceResult(302), "healthy");
  assert.equal(classifySourceResult(404), "broken");
  assert.equal(classifySourceResult(410), "broken");
  for (const status of [0, 401, 403, 429, 500, 503]) {
    assert.equal(classifySourceResult(status), "inconclusive");
  }
  assert.ok(SOURCE_CONCURRENCY <= 8);
  assert.ok(REQUEST_TIMEOUT_MS <= 7000);
});

test("source probe handles 404 and anti-bot 403 distinctly without network", async () => {
  const fake = async () => ({ status: 404, url: "https://official.example/missing", body: { cancel: async () => {} } });
  const result = await probeSource("https://official.example/missing", fake);
  assert.equal(result.state, "broken");
  assert.equal(result.attempts, 1);
  const blocked = await probeSource("https://official.example/blocked", async () => ({
    status: 403, body: { cancel: async () => {} },
  }));
  assert.equal(blocked.state, "inconclusive");
  const lost = await probeSource("https://official.example/offline", async () => { throw Error("offline"); });
  assert.equal(lost.state, "inconclusive");
  assert.equal(lost.attempts, 2);
});

test("reports reproducibly on distinct official URLs with their affected guides", async () => {
  const refs = new Map([
    ["https://a.texas.gov/one", ["one.ts", "two.ts"]],
    ["https://b.texas.gov/two", ["three.ts"]],
  ]);
  const rows = await auditSourceLinks(refs, async (url) => ({
    status: url.includes("/one") ? 410 : 200,
    url,
    body: { cancel: async () => {} },
  }));
  const report = formatSourceReport(rows, new Date("2026-10-28T18:00:00Z"));
  assert.deepEqual(report.totals, { checked: 2, healthy: 1, broken: 1, inconclusive: 0 });
  assert.match(report.markdown, /2026-10/);
  assert.match(report.markdown, /one.ts, two.ts/);
  assert.match(report.markdown, /not legal-claim verification/);
});
