#!/usr/bin/env node
/**
 * Source-only Texas law editorial re-review queue.
 * No network, publishing, legal-text rewriting, or date modification.
 * Fails closed if a law authority file cannot be inventoried.
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

// Keep the operational cadence consistent with docs/content/laws-evergreen-inventory.md.
export const REVIEW_AGE_DAYS = 90;
export const REVIEW_ISSUE_NUMBER = 2938;
const LAW_FILE_RE = /^law-topic-[a-z0-9-]+-authority\.ts$/;
const FIELD = (field) => new RegExp(`(?:^|\\n)\\s*${field}:\\s*["']([^"']+)["']`, "m");

export function parseAuthority(text, file) {
  // Both TS object literals (slug:) and JSON-style generated modules ("slug":) are valid.
  const normalized = text.replace(/["\x27](slug|updated)["\x27]\s*:/g, "$1:");
  const slug = normalized.match(FIELD("slug"))?.[1];
  const updated = normalized.match(FIELD("updated"))?.[1];
  if (!slug || !updated || !/^\d{4}-\d{2}-\d{2}$/.test(updated)) {
    throw new Error(`${file}: authority guide has missing or invalid slug/review date`);
  }
  if (!Number.isFinite(Date.parse(`${updated}T00:00:00Z`)) ||
      new Date(`${updated}T00:00:00Z`).toISOString().slice(0, 10) !== updated) {
    throw new Error(`${file}: invalid review calendar date ${updated}`);
  }
  // Discover election-specific calendar dates from public guide text rather
  // than a hardcoded election-year list. Historical examples may remain valid,
  // but after election day they must receive an editorial freshness review.
  const calendarEvents = [...text.matchAll(/for the ([A-Z][a-z]+ \d{1,2}, \d{4}) election\b/gi)]
    .map((match) => {
      const ms = Date.parse(match[1] + " 00:00:00 GMT");
      if (!Number.isFinite(ms)) throw new Error(file + ": invalid election calendar reference");
      return new Date(ms).toISOString().slice(0, 10);
    });
  return { slug, updated, file, calendarEvents: [...new Set(calendarEvents)] };
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


/** Report incomplete claim sign-offs independently of a guide's recent update date. */
export function incompleteClaimAudits(ledger, records) {
  const section = ledger.split("## Guide inventory (full audit still outstanding)")[1]?.split("## Individually verified claim")[0];
  if (!section) throw Error("Claim-review ledger guide inventory missing");
  const states = new Map();
  for (const line of section.split("\n")) {
    const m = line.match(/^\|\s*[^|]+\|\s*`src\/data\/(law-topic-[a-z0-9-]+-authority\.ts)`\s*\|\s*\*\*(Partial|Fully reviewed)\*\*/i);
    if (!m) continue;
    if (states.has(m[1])) throw Error("Duplicate law guide in ledger: " + m[1]);
    states.set(m[1], m[2].toLowerCase());
  }
  return records.filter(r => {
    const status = states.get(r.file);
    if (!status) throw Error("Missing legal claim certification in ledger for " + r.file);
    return status !== "fully reviewed";
  });
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
    const expiredCalendar = (record.calendarEvents ?? []).filter((date) =>
      today > Date.parse(date + "T00:00:00Z") && last <= Date.parse(date + "T00:00:00Z"));
    return { ...record, ageDays, reviewNeeded: overdue || session || expiredCalendar.length > 0,
      reason: [overdue ? `last reviewed ${ageDays} days ago` : null,
               session ? "new Texas regular legislative session" : null,
               expiredCalendar.length ? "election-specific dates have passed (" + expiredCalendar.join(", ") + "); verify next election guidance" : null
      ].filter(Boolean).join("; ") };
  });
}

export function markdownReport(queue, now = new Date(), incomplete = null) {
  const monthKey = now.toISOString().slice(0, 7);
  const due = queue.filter((record) => record.reviewNeeded).sort((a, b) => b.ageDays - a.ageDays);
  const heading = `### Texas laws editorial review — ${monthKey} <!-- law-review:${monthKey} -->`;
  const lines = [heading,
    `Authority topics checked: ${queue.length}. Re-reviews due by date or election triggers: ${due.length}.`,
    ...(incomplete === null ? [] : [`Guides still missing complete primary-source claim certification: ${incomplete.length} of ${queue.length}.`]),
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
    lines.push("No 90-day or election-calendar re-review is currently due; this is not legal claim certification.");
  }
  if (incomplete !== null && incomplete.length) {
    lines.push("", "#### Outstanding complete legal claim reviews",
      "Recent guide updates do not mean every framework paragraph, threshold, exception, rule, FAQ and official source has been independently verified.");
    for (const item of incomplete) lines.push("- " + item.slug + " — " + item.file);
  }
  return { monthKey, dueCount: due.length, claimPartialCount: incomplete?.length ?? null, markdown: lines.join("\n") + "\n" };
}

// Keep the CLI pure and dependency-free; the workflow uses a straightforward
// GitHub output file for machine-readable due counts.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dataDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/data");
  const records = inventoryAuthorityFiles(dataDir);
    const ledger = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../../docs/laws/claim-review-ledger.md"), "utf8");
    const incomplete = incompleteClaimAudits(ledger, records);
    const report = markdownReport(reviewQueue(records), new Date(), incomplete);
  process.stdout.write(report.markdown);
  if (process.env.GITHUB_OUTPUT) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(process.env.GITHUB_OUTPUT, `due_count=${report.dueCount}\nclaim_partial_count=${report.claimPartialCount}\nmonth_key=${report.monthKey}\n`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, report.markdown);
  }
}
