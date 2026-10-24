import { describe, expect, it } from "vitest";
import { summarizeLighthouse, renderReport } from "../../scripts/laws/report-lighthouse-baseline.mjs";

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
describe("read-only law authority Lighthouse baseline", () => {
  it("extracts measured scores and lab metrics, not speculative field values", () => {
    const row = summarizeLighthouse(sample);
    expect(row.scores).toEqual([85, 92, 96, 95]);
    expect(row.lcp).toBe("2.2 s");
    expect(row.cls).toBe("0.012");
    expect(row.tbt).toBe("30 ms");
  });
  it("makes a careful distinction between synthetic tests and field CWV", () => {
    const report = renderReport([summarizeLighthouse(sample)]);
    expect(report).toContain("Lab data only");
    expect(report).toContain("real-user Core Web Vitals");
    expect(report).toContain("https://keeptxred.com/laws");
  });
  it("rejects incomplete audits instead of reporting success", () => {
    expect(() => summarizeLighthouse({ ...sample, categories: { performance: { score: 0.9 } } })).toThrow("missing scored categories");
    expect(() => renderReport([])).toThrow("No Lighthouse audits produced");
  });
});
