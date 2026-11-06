import { describe, expect, it } from "vitest";
import { editorialGate, assessReportCoverage, shouldReopenIssue, EXPECTED_URLS, MARKER } from "./notify-news-archive-completion.mjs";

const urls = Array.from({ length: EXPECTED_URLS }, (_, i) => "https://keeptxred.com/news/archive-" + i);
const rows = (final = true) => urls.map((url, i) => ({
  url,
  disposition: i % 4 === 0 ? "A" : i % 4 === 1 ? "C" : i % 4 === 2 ? "D" : "E",
  decision_state: final ? "FINAL_EDITORIAL_CERTIFIED" : "PROVISIONAL_TRIAGE",
  reason: "Reviewed original source/retirement and provenance; supported by editorial evidence.",
  expected_indexability: i % 4 === 0 ? "potential-indexable" : i % 4 === 1 ? "noindex" : i % 4 === 2 ? "redirect" : "none",
  redirect_to: i % 4 === 2 ? "https://texasdefined.com/article/archive-" + i : "",
}));
const signoff = () => ({
  approved: true,
  approver: "keeptxred",
  all_required_fixes_verified: true,
  unresolved_findings: [],
  final_editorial_evidence: "https://github.com/keeptxred/texas-heartland-hub/issues/3421#issuecomment-123456",
  production_run_url: "https://github.com/keeptxred/texas-heartland-hub/actions/runs/123456",
  production_sha: "1".repeat(40),
  verification_not_before: "2026-11-06T00:00:00Z",
});
const evidence = (row) => ({
  url: row.url,
  disposition: row.disposition,
  policy: row.expected_indexability,
  passedHttpPolicy: true,
  errors: [],
  status: row.disposition === "A" || row.disposition === "C" ? 200 : row.disposition === "D" ? 301 : 404,
  canonical: row.disposition === "A" ? row.url : "",
  inSitemap: row.disposition === "A",
  location: row.disposition === "D" ? row.redirect_to : "",
});
const reports = (allRows) => Array.from({ length: 16 }, (_, i) => ({
  recordedAt: "2026-11-08T12:00:00Z",
  totalUrls: EXPECTED_URLS,
  sitemapErrors: [],
  results: allRows.slice(i * 25, (i + 1) * 25).map(evidence),
}));

describe("KTR archive once-only completion gate", () => {
  it("never equates provisional archive classifications or HTTP alone with editorial completion", () => {
    const gate = editorialGate(rows(false), signoff());
    expect(gate.ready).toBe(false);
    expect(gate.finalized).toBe(0);
    expect(gate.blockers.some(value => value.includes("388 URLs"))).toBe(true);
  });

  it("requires a fully signed zero-blocker release after all 388 final editorial decisions", () => {
    expect(editorialGate(rows(), signoff()).ready).toBe(true);
    expect(editorialGate(rows(), { ...signoff(), approved: false }).ready).toBe(false);
    expect(editorialGate(rows(), { ...signoff(), unresolved_findings: ["Needs repair"] }).ready).toBe(false);
    expect(editorialGate(rows().slice(1), signoff()).ready).toBe(false);
    const pending = rows(); pending[1].disposition = "B";
    expect(editorialGate(pending, signoff()).ready).toBe(false);
    const missingTarget = rows(); missingTarget[2].redirect_to = "";
    expect(editorialGate(missingTarget, signoff()).ready).toBe(false);
  });

  it("counts all 388 actual post-release policy-matching reports with no broad crawl", () => {
    const ledger = rows();
    const observations = reports(ledger);
    expect(observations.map(item => item.results.length)).toEqual([...Array(15).fill(25), 13]);
    expect(assessReportCoverage(ledger, observations, signoff().verification_not_before)).toEqual({
      verified: 388, total: 388, complete: true,
    });
    expect(assessReportCoverage(ledger, observations.slice(1), signoff().verification_not_before).complete).toBe(false);
  });

  it("rejects stale or mismatching runs, false 301 destinations, and sitemap errors", () => {
    const ledger = rows();
    const reports0 = reports(ledger);
    reports0[0].recordedAt = "2026-11-05T23:00:00Z";
    expect(assessReportCoverage(ledger, reports0, signoff().verification_not_before).complete).toBe(false);
    const reports1 = reports(ledger);
    reports1[0].results[2].location = "https://texasdefined.com/article/wrong";
    expect(assessReportCoverage(ledger, reports1, signoff().verification_not_before).complete).toBe(false);
    const reports2 = reports(ledger);
    reports2[0].sitemapErrors = ["sitemap XML missing"];
    expect(assessReportCoverage(ledger, reports2, signoff().verification_not_before).complete).toBe(false);
  });

  it("reopens only premature completed closure of master issue, never intentional abandonment", () => {
    expect(shouldReopenIssue({ number: 3421, state: "closed", state_reason: "completed" }, "issues")).toBe(true);
    expect(shouldReopenIssue({ number: 3421, state: "closed", state_reason: "not_planned" }, "issues")).toBe(false);
    expect(shouldReopenIssue({ number: 3421, state: "open", state_reason: "reopened" }, "issues")).toBe(false);
    expect(shouldReopenIssue({ number: 3422, state: "closed", state_reason: "completed" }, "issues")).toBe(false);
    expect(shouldReopenIssue({ number: 3421, state: "closed", state_reason: "completed" }, "schedule")).toBe(false);
  });

  it("defines a stable marker for idempotent GitHub issue mention notification", () => {
    expect(MARKER).toMatch(/ktr-news-phase2a-verified-completion-v1/);
  });
});
