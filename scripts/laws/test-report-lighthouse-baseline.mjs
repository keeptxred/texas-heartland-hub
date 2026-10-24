import assert from "node:assert/strict";
import { test } from "node:test";
import { summarizeLighthouse, renderReport } from "./report-lighthouse-baseline.mjs";

const sample = {
  finalDisplayedUrl: "https://keeptxred.com/laws",
  categories: {
    performance: { score: 0.85 },
    accessibility: { score: 0.92 },
    "best-practices": { score: 0.96 },
    seo: { score: 0.95 },
  },
  audits: {
    "largest-contentful-paint": { displayValue: "2.2 s" },
    "cumulative-layout-shift": { displayValue: "0.012" },
    "total-blocking-time": { displayValue: "30 ms" },
  },
};
test("reports accurate measured category scores and LCP/CLS/TBT", () => {
  const x = summarizeLighthouse(sample);
  assert.deepEqual(x.scores, [85, 92, 96, 95]);
  assert.equal(x.lcp, "2.2 s");
  assert.equal(x.cls, "0.012");
  assert.equal(x.tbt, "30 ms");
});
test("avoids claiming synthetic Lighthouse numbers are field Core Web Vitals", () => {
  const markdown = renderReport([summarizeLighthouse(sample)]);
  assert.match(markdown, /Lab data only/);
  assert.match(markdown, /real-user Core Web Vitals/);
  assert.match(markdown, /https:\/\/keeptxred.com\/laws/);
});
test("fails closed on incomplete or missing audit data", () => {
  assert.throws(() => summarizeLighthouse({ ...sample, categories: { performance: { score: 0.9 } } }), /missing scored categories/);
  assert.throws(() => renderReport([]), /No Lighthouse audits produced/);
});
