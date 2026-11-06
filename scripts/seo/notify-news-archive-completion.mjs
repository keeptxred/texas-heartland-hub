/**
 * KTR Phase 2A: notify once, only after the complete 388-URL archive is
 * editorially finalized AND supported by post-signoff production evidence.
 * This is a read-only gate until all checks succeed; no broad live crawling.
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { loadLedger } from "./certify-news-archive-batch.mjs";

export const ISSUE = 3421;
export const EXPECTED_URLS = 388;
export const SIGNOFF = "docs/recovery/ktr-news-phase2a-completion-signoff.json";
export const MARKER = "<!-- ktr-news-phase2a-verified-completion-v1 -->";
const REPO = "keeptxred/texas-heartland-hub";
const WORKFLOW = "ktr-news-archive-certification.yml";
const FINAL_STATE = "FINAL_EDITORIAL_CERTIFIED";
const FINISHED = new Set(["A", "C", "D", "E"]);

export function editorialGate(rows, signoff) {
  const blockers = [];
  if (rows.length !== EXPECTED_URLS) blockers.push("Ledger inventory is not exactly 388 unique URLs");
  const remaining = rows.filter(row => row.decision_state !== FINAL_STATE);
  if (remaining.length) blockers.push(remaining.length + " URLs lack final editorial certification");
  const pendingB = rows.filter(row => !FINISHED.has(row.disposition));
  if (pendingB.length) blockers.push(pendingB.length + " URLs still have pending/invalid A-E dispositions (including B)");
  for (const row of rows) {
    if (!row.reason || row.reason.trim().length < 25) {
      blockers.push("No substantive disposition reason: " + row.url);
    }
    if (row.disposition === "A" && row.expected_indexability !== "potential-indexable") {
      blockers.push("Indexable policy disagreement: " + row.url);
    }
    if (row.disposition === "C" && !["noindex", "noindex-or-redirect"].includes(row.expected_indexability)) {
      blockers.push("Suppressed policy disagreement: " + row.url);
    }
    if (row.disposition === "D" && (
      row.expected_indexability !== "redirect" ||
      !/^https:\/\/(?:keeptxred|texasdefined)\.com\/\S+$/.test(row.redirect_to || "") ||
      row.redirect_to === row.url
    )) {
      blockers.push("Unproven exact redirect target: " + row.url);
    }
    if (row.disposition === "E" && row.expected_indexability !== "none") {
      blockers.push("Retirement policy disagreement: " + row.url);
    }
  }
  if (!signoff || signoff.approved !== true || signoff.all_required_fixes_verified !== true) {
    blockers.push("Explicit editorial and repair sign-off is not approved");
  } else {
    if (!/^[a-zA-Z0-9_.-]{2,100}$/.test(signoff.approver || "")) blockers.push("Missing identified approver");
    if (!Number.isFinite(Date.parse(signoff.verification_not_before || ""))) blockers.push("Missing valid post-release verification start");
    if (!/^https:\/\/github\.com\/keeptxred\/texas-heartland-hub\/issues\/3421#issuecomment-\d+$/.test(signoff.final_editorial_evidence || "")) {
      blockers.push("Missing issue-linked editorial evidence and unresolved-findings sign-off");
    }
    if (!Array.isArray(signoff.unresolved_findings) || signoff.unresolved_findings.length !== 0) blockers.push("Unresolved editorial/technical findings remain");
    if (!/^https:\/\/github\.com\/keeptxred\/texas-heartland-hub\/actions\/runs\/[1-9]\d*$/.test(signoff.production_run_url || "")) blockers.push("Missing exact production deployment run");
    if (!/^[a-f0-9]{40}$/.test(signoff.production_sha || "")) blockers.push("Missing exact production commit SHA");
  }
  return { ready: blockers.length === 0, blockers, finalized: rows.length - remaining.length, total: rows.length };
}

export function assessReportCoverage(rows, reports, notBefore) {
  const current = new Map(rows.map(row => [row.url, row]));
  const valid = new Map();
  const threshold = Date.parse(notBefore);
  for (const report of reports) {
    if (!Number.isFinite(Date.parse(report?.recordedAt)) || Date.parse(report.recordedAt) < threshold ||
        report.totalUrls !== EXPECTED_URLS ||
        !Array.isArray(report.sitemapErrors) || report.sitemapErrors.length ||
        !Array.isArray(report.results) || !report.results.length || report.results.length > 40) continue;
    if (!report.results.every(result => {
      const row = current.get(result.url);
      if (!row || result.passedHttpPolicy !== true || result.disposition !== row.disposition ||
          result.policy !== row.expected_indexability || (result.errors || []).length) return false;
      if (row.disposition === "D") {
        try {
          return [301, 308].includes(result.status) &&
            new URL(result.location || "", row.url).href === row.redirect_to;
        } catch { return false; }
      }
      if (row.disposition === "A") return result.status === 200 && result.canonical === row.url;
      if (row.disposition === "E") return result.status === 404 || result.status === 410;
      if (row.disposition === "C") return !result.inSitemap &&
        (result.status === 200 || (row.expected_indexability === "noindex-or-redirect" && [301, 308].includes(result.status)));
      return false;
    })) continue;
    for (const result of report.results) valid.set(result.url, report.recordedAt);
  }
  return { verified: valid.size, total: rows.length, complete: valid.size === EXPECTED_URLS };
}

async function api(token, path, method = "GET", body) {
  const response = await fetch("https://api.github.com" + path, {
    method,
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new Error("GitHub API " + method + " " + path + " HTTP " + response.status + ": " + (await response.text()).slice(0, 300));
  return response.status === 204 ? null : response.json();
}

async function fetchZipReport(token, artifactId) {
  const response = await fetch("https://api.github.com/repos/" + REPO + "/actions/artifacts/" + artifactId + "/zip", {
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
  });
  if (!response.ok) throw new Error("Artifact " + artifactId + " HTTP " + response.status);
  const dir = mkdtempSync(join(tmpdir(), "ktr-archive-"));
  try {
    const path = join(dir, "evidence.zip");
    writeFileSync(path, Buffer.from(await response.arrayBuffer()));
    const list = spawnSync("unzip", ["-Z", "-1", path], { encoding: "utf8", maxBuffer: 500000 });
    if (list.status !== 0) throw new Error("Unable to inspect artifact " + artifactId);
    const matches = list.stdout.trim().split(/\r?\n/).filter(name => name === "result.json" || name.endsWith("/result.json"));
    if (matches.length !== 1) throw new Error("Unexpected archive evidence payload in artifact " + artifactId);
    const unpack = spawnSync("unzip", ["-p", path, matches[0]], { encoding: "utf8", maxBuffer: 5000000 });
    if (unpack.status !== 0) throw new Error("Unable to decode cohort " + artifactId);
    return JSON.parse(unpack.stdout);
  } finally { rmSync(dir, { force: true, recursive: true }); }
}

async function collectReports(token, rows, notBefore) {
  const runList = await api(token, "/repos/" + REPO + "/actions/workflows/" + WORKFLOW + "/runs?status=success&branch=main&per_page=100");
  const reports = [];
  for (const run of runList.workflow_runs || []) {
    if (Date.parse(run.created_at) < Date.parse(notBefore)) continue;
    if (run.conclusion !== "success" || run.status !== "completed") continue;
    const data = await api(token, "/repos/" + REPO + "/actions/runs/" + run.id + "/artifacts?per_page=100");
    const artifacts = (data.artifacts || []).filter(a => !a.expired && a.name === "ktr-news-archive-phase2a-" + run.id);
    for (const artifact of artifacts) reports.push(await fetchZipReport(token, artifact.id));
    const coverage = assessReportCoverage(rows, reports, notBefore);
    if (coverage.complete) return coverage;
  }
  return assessReportCoverage(rows, reports, notBefore);
}

async function validateProduction(token, signoff) {
  const runId = signoff.production_run_url.match(/\/runs\/(\d+)$/)[1];
  const run = await api(token, "/repos/" + REPO + "/actions/runs/" + runId);
  if (run.status !== "completed" || run.conclusion !== "success" || run.head_sha !== signoff.production_sha) {
    return false;
  }
  const jobs = await api(token, "/repos/" + REPO + "/actions/runs/" + runId + "/jobs?per_page=100");
  const successful = (jobs.jobs || []).filter(j => j.conclusion === "success" && j.status === "completed");
  return successful.some(j => /\bdeploy\b/i.test(j.name)) &&
    successful.some(j => /post.deploy newsroom smoke/i.test(j.name));
}

async function validateEditorialEvidence(token, signoff) {
  const id = signoff.final_editorial_evidence.match(/#issuecomment-(\d+)$/)?.[1];
  if (!id) return false;
  const comment = await api(token, "/repos/" + REPO + "/issues/comments/" + id);
  return comment.issue_url === "https://api.github.com/repos/" + REPO + "/issues/" + ISSUE &&
    comment.user?.login === signoff.approver &&
    (comment.body || "").includes("KTR_PHASE2A_EDITORIAL_SIGNOFF_388") &&
    (comment.body || "").includes("no unresolved findings");
}

async function commentsContainMarker(token) {
  for (let page = 1; page <= 30; page++) {
    const result = await api(token, "/repos/" + REPO + "/issues/" + ISSUE + "/comments?per_page=100&page=" + page);
    if (result.some(comment => (comment.body || "").includes(MARKER))) return true;
    if (result.length < 100) return false;
  }
  throw new Error("Issue comment scan reached pagination safety cap");
}

export async function main({ token = process.env.GITHUB_TOKEN } = {}) {
  const rows = loadLedger(readFileSync("docs/recovery/ktr-news-phase2a-disposition-ledger.csv", "utf8"));
  const signoff = JSON.parse(readFileSync(SIGNOFF, "utf8"));
  const gate = editorialGate(rows, signoff);
  console.log("Phase 2A archive final dispositions: " + gate.finalized + "/" + gate.total);
  if (!gate.ready) {
    console.log("Completion notification withheld: " + gate.blockers.slice(0, 8).join("; "));
    return { notified: false, gate };
  }
  if (!token) throw new Error("GITHUB_TOKEN is required for the verified completion gate");
  if (!await validateEditorialEvidence(token, signoff)) {
    console.log("Completion withheld: identified maintainer did not post the required final editorial certification on issue #3421");
    return { notified: false, editorialEvidence: false };
  }
  const verified = await collectReports(token, rows, signoff.verification_not_before);
  console.log("Post-release production URL evidence: " + verified.verified + "/" + verified.total);
  if (!verified.complete) return { notified: false, verified };
  if (!await validateProduction(token, signoff)) {
    console.log("Completion withheld: exact deployment and non-skipped smoke not verified");
    return { notified: false, verified };
  }
  const issue = await api(token, "/repos/" + REPO + "/issues/" + ISSUE);
  if (await commentsContainMarker(token)) {
    console.log("Completion notification already posted; no duplicate.");
    return { notified: false, duplicate: true };
  }
  if (issue.state === "open") {
    await api(token, "/repos/" + REPO + "/issues/" + ISSUE, "PATCH", { state: "closed", state_reason: "completed" });
  } else if (issue.state_reason === "not_planned") {
    throw new Error("Cannot announce completion of an issue closed as not planned");
  }
  const body = [
    MARKER,
    "@keeptxred **KeepTXRed Phase 2A news archive review is complete and verified.**",
    "",
    "- Final editorial dispositions: **388/388**; no provisional or B/pending entries.",
    "- Post-release read-only HTTP/robots/canonical/sitemap cohort evidence: **388/388** matching the final ledger.",
    "- Verified fixes and source/relevance sign-off: " + signoff.final_editorial_evidence,
    "- Successful non-skipped exact-commit production deployment and newsroom smoke: " + signoff.production_run_url,
    "- Original historical content and publication dates were preserved. No claim of Google indexing/rank recovery is made.",
    "",
    "Issue #" + ISSUE + " was closed as completed. GitHub notification delivery depends on the account's notification settings.",
  ].join("\n");
  await api(token, "/repos/" + REPO + "/issues/" + ISSUE + "/comments", "POST", { body });
  console.log("Completion notice posted to issue #" + ISSUE);
  return { notified: true, verified };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error); process.exitCode = 1; });
}
