#!/usr/bin/env node
/** Compare official statute fingerprints from the existing monthly source-link
 * pass with the last authenticated GitHub Actions bot snapshot in issue #2938.
 * Never rewrite statutes, guide text, links, approvals or reviewed dates. */
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SNAPSHOT_MARKER = "law-statute-snapshot:v1";

export function lastBotSnapshot(comments) {
  const re = /<!-- law-statute-snapshot:v1\n([^\n]*?)\n-->/g;
  let last = null;
  for (const m of comments.matchAll(re)) {
    try {
      const data = JSON.parse(m[1]);
      if (data && typeof data === "object" && !Array.isArray(data) &&
        Object.entries(data).every(([url, hash]) =>
          /^https:\/\/(tcss\.legis\.texas\.gov|statutes\.capitol\.texas\.gov)\//.test(url) &&
          /^[a-f0-9]{64}$/.test(hash))) last = data;
    } catch { /* untrusted malformed comment cannot reset the baseline */ }
  }
  return last;
}

export function compareStatuteFingerprints(rows, previous) {
  const observed = Object.fromEntries(rows
    .filter(r => r.statuteFingerprint && r.state === "healthy")
    .map(r => [r.url, r.statuteFingerprint]).sort(([a], [b]) => a.localeCompare(b)));
  const links = new Map(rows.map(r => [r.url, r.guides ?? []]));
  const count = Object.keys(observed).length;
  const prior = previous ?? {};
  const changed = Object.keys(observed).filter(url =>
    Object.hasOwn(prior, url) && prior[url] !== observed[url]);
  const added = Object.keys(observed).filter(url => !Object.hasOwn(prior, url));
  // Keep last-known hashes for unreachable URLs. Never call them unchanged
  // merely because the response failed or lacked an observable HTML body.
  const snapshot = Object.fromEntries(Object.entries({ ...prior, ...observed })
    .sort(([a], [b]) => a.localeCompare(b)));
  const baselineOnly = previous === null;
  const publish = count > 0 && (baselineOnly || changed.length > 0 || added.length > 0);
  const date = new Date().toISOString().slice(0, 10);
  const report = [
    "<!-- " + SNAPSHOT_MARKER,
    JSON.stringify(snapshot),
    "-->",
    "### Texas laws official statute-text revision watch — " + date,
    "Observed " + count + " readable official HTML statute chapters in the EXISTING source audit; " +
      (Object.keys(prior).length > 0 ? Object.keys(prior).length + " previously recorded." : "no previous bot baseline."),
    "A changed chapter fingerprint signals text needing human legal review, NOT proof of a specific enacted amendment. No guide content, review date or publication state changed.",
  ];
  if (baselineOnly) report.push("**First successful scan:** establish fingerprint baseline; do not report these chapters as changed laws.");
  if (changed.length) {
    report.push("", "#### Potential official statute text changes — investigate");
    changed.forEach(url => report.push("- " + url + " (guides: " + links.get(url).join(", ") + ")"));
  }
  if (added.length && !baselineOnly) {
    report.push("", "Newly readable/sourced chapters (not automatically legal changes): " + added.length);
    added.slice(0, 30).forEach(url => report.push("- " + url));
  }
  if (count === 0) report.push("No readable official chapter this run; previous baseline preserved and no change falsely reported.");
  return { observed: count, changed, added, publish, snapshot, markdown: report.join("\n") + "\n" };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [commentsPath, currentPath] = process.argv.slice(2);
  if (!commentsPath || !currentPath) throw Error("Expected bot comments and existing source audit JSON paths");
  const prior = lastBotSnapshot(readFileSync(commentsPath, "utf8"));
  const current = JSON.parse(readFileSync(currentPath, "utf8"));
  const report = compareStatuteFingerprints(current.results ?? [], prior);
  writeFileSync("/tmp/texas-law-statute-monitor.md", report.markdown);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT,
    "publish_snapshot=" + (report.publish ? "true" : "false") + "\n");
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    "Official Texas statute chapters fingerprinted: " + report.observed +
    "; potential text changes: " + report.changed.length +
    "; newly readable/sourced: " + report.added.length + "\n");
  process.stdout.write("Statute fingerprint monitor: " + JSON.stringify({
    observed: report.observed, changed: report.changed.length,
    added: report.added.length, publish: report.publish,
  }) + "\n");
}
