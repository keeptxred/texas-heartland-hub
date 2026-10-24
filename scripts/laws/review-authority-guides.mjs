#!/usr/bin/env node
/**
 * Source-only Texas law editorial re-review queue.
 * No network, publishing, legal-text rewriting, or date modification.
 * Fails closed if a law authority file cannot be inventoried.
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

export const REVIEW_AGE_DAYS = 180;
export const REVIEW_ISSUE_NUMBER = 2938;
const LAW_FILE_RE = /^law-topic-[a-z0-9-]+-authority\.ts$/;
const FIELD = (field) => new RegExp(`(?:^|\\n)\\s*${field}:\\s*["']([^"']+)["']`, "m");

export function parseAuthority(text, file) {
  const slug = text.match(FIELD("slug"))?.[1];
  const updated = text.match(FIELD("updated"))?.[1];
  if (!slug || !updated || !/^\d{4}-\d{2}-\d{2}$/.test(updated)) {
    throw new Error(`${file}: authority guide has missing or invalid slug/review date`);
  }
  if (!Number.isFinite(Date.parse(`${updated}T00:00:00Z`)) ||
      new Date(`${updated}T00:00:00Z`).toISOString().slice(0, 10) !== updated) {
    throw new Error(`${file}: invalid review calendar date ${updated}`);
  }
  return { slug, updated, file };
}

export function inventoryAuthorityFiles(directory) {
  const files = readdirSync(directory).filter((name) => LAW_FILE_RE.test(name)).sort();
  // Protect future topics: a removed/renamed registry must never silently look "fully reviewed".
  if (files.length < 18) throw new Error(`Expected at least 18 legal authority modules; got ${files.length}`);
  const records = files.map((file) => parseAuthority(readFileSync(resolve(directory, file), "utf8"), file));
  const slugs = new Set(records.map((r) => r.slug));
  if (slugs.size !== records.length) throw new Error("Duplicate legal authority slug in review inventory");
  return records;
}

export function isRegularSessionReviewMonth(date) {
  // Texas regular legislative sessions begin on the second Tuesday of January in odd years.
  // The monthly review runs on Jan 20, after that session-opening date.
  return date.getUTCFullYear() % 2 === 1 && date.getUTCMonth() === 0 &&
    date.getUTCDate() >= 14;
}

export function reviewQueue(records, now = new Date()) {
  if (Number.isNaN(now.getTime())) throw new Error("Invalid audit time");
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const session = isRegularSessionReviewMonth(now);
  const daysMs = 24 * 60 * 60 * 1000;
  return records.map((record) => {
    const [year, month, day] = record.updated.split("-").map(Number);
    const last = Date.UTC(year, month - 1, day);
    const ageDays = Math.floor((today - last) / daysMs);
    if (ageDays < 0) throw new Error(`Future law review date on ${record.slug}: ${record.updated}`);
    const overdue = ageDays >= REVIEW_AGE_DAYS;
    return { ...record, ageDays, reviewNeeded: overdue || session,
      reason: [overdue ? `last reviewed ${ageDays} days ago` : null,
               session ? "new Texas regular legislative session" : null].filter(Boolean).join("; ") };
  });
}

export function markdownReport(queue, now = new Date()) {
  const monthKey = now.toISOString().slice(0, 7);
  const due = queue.filter((record) => record.reviewNeeded).sort((a, b) => b.ageDays - a.ageDays);
  const heading = `### Texas laws editorial review — ${monthKey} <!-- law-review:${monthKey} -->`;
  const lines = [heading,
    `Authority topics checked: ${queue.length}. Topics requiring human review: ${due.length}.`,
    "No legal text, source citations, published dates, or reviewed dates were changed automatically.",
    "",
  ];
  if (due.length) {
    lines.push("| Law topic | Last reviewed | Why re-review |", "|---|---|---|");
    for (const record of due) {
      lines.push(`| [${record.slug}](https://keeptxred.com/laws/topic/${record.slug}) | ${record.updated} | ${record.reason} |`);
    }
    lines.push("", "Editorial checklist: confirm current Texas statutes, court decisions, agency rules, effective/applicability dates, and any changes in enacted versus proposed legislation. Update the review date only after a human verifies claims and references.");
  } else {
    lines.push("No legal-topic re-review is currently due.");
  }
  return { monthKey, dueCount: due.length, markdown: lines.join("\n") + "\n" };
}

// Keep the CLI pure and dependency-free; the workflow uses a straightforward
// GitHub output file for machine-readable due counts.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dataDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/data");
  const report = markdownReport(reviewQueue(inventoryAuthorityFiles(dataDir)));
  process.stdout.write(report.markdown);
  if (process.env.GITHUB_OUTPUT) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(process.env.GITHUB_OUTPUT, `due_count=${report.dueCount}\nmonth_key=${report.monthKey}\n`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, report.markdown);
  }
}
