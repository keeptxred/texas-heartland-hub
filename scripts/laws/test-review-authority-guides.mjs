import assert from "node:assert/strict";
import { test } from "node:test";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import {
  parseAuthority, inventoryAuthorityFiles, isRegularSessionReviewMonth,
  reviewQueue, markdownReport, REVIEW_AGE_DAYS
} from "./review-authority-guides.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/data");

test("inventory covers every current law authority and does not miss new modules", () => {
  const records = inventoryAuthorityFiles(root);
  assert.ok(records.length >= 18);
  assert.equal(new Set(records.map((r) => r.slug)).size, records.length);
  assert.ok(records.some((r) => r.slug === "gun-carry-law"));
  assert.ok(records.some((r) => r.slug === "business-formation-llc-law"));
});

test("accepts quoted JSON-style fields emitted by generated authority modules", () => {
  const sample = [
    'export const EXAMPLE = {',
    '  "slug": "generated-topic",',
    '  "updated": "2026-10-23"',
    '};',
  ].join(String.fromCharCode(10));
  const record = parseAuthority(sample, "generated.ts");
  assert.equal(record.slug, "generated-topic");
  assert.equal(record.updated, "2026-10-23");
});

test("reject malformed or fictitious review dates", () => {
  assert.throws(() => parseAuthority('slug: "example", updated: "2026-02-31"', "bad"), /missing|invalid/);
  assert.throws(() => parseAuthority('slug: "example",\n updated: "2026-02-31"', "bad"), /invalid review calendar date/);
});

test("marks a guide due at 90 days and not at 89, without altering review or publication dates", () => {
  const original = {slug: "sample", updated: "2026-07-26", published: "2025-12-01", file: "sample.ts"};
  const before = reviewQueue([original], new Date("2026-10-23T14:00:00Z"));
  const due = reviewQueue([original], new Date("2026-10-24T14:00:00Z"));
  assert.equal(REVIEW_AGE_DAYS, 90);
  assert.equal(before[0].ageDays, 89);
  assert.equal(before[0].reviewNeeded, false);
  assert.equal(due[0].ageDays, 90);
  assert.equal(due[0].reviewNeeded, true);
  assert.match(due[0].reason, /last reviewed 90 days ago/);
  assert.equal(original.updated, "2026-07-26");
  assert.equal(original.published, "2025-12-01");
});

test("flags all legal topics during Texas regular-session opening month", () => {
  assert.equal(isRegularSessionReviewMonth(new Date("2027-01-20T14:00:00Z")), true);
  assert.equal(isRegularSessionReviewMonth(new Date("2028-01-20T14:00:00Z")), false);
  assert.equal(isRegularSessionReviewMonth(new Date("2027-02-20T14:00:00Z")), false);
  const rows = reviewQueue([{slug:"sample",updated:"2027-01-15",file:"sample.ts"}], new Date("2027-01-20T14:00:00Z"));
  assert.equal(rows[0].reviewNeeded,true);
  assert.match(rows[0].reason,/legislative session/);
});

test("report includes a unique monthly marker and requires human verification", () => {
  const rows = reviewQueue([{slug:"sample",updated:"2026-02-01",file:"sample.ts"}], new Date("2026-10-24T14:00:00Z"));
  const report = markdownReport(rows,new Date("2026-10-24T14:00:00Z"));
  assert.equal(report.monthKey,"2026-10");
  assert.equal(report.dueCount,1);
  assert.match(report.markdown,/law-review:2026-10/);
  assert.match(report.markdown,/No legal text, source citations, published dates, or reviewed dates were changed automatically/);
});

test("flags completed election calendars at the November review before 90 days pass", () => {
  const election = inventoryAuthorityFiles(root).find((record) => record.slug === "election-law");
  assert.ok(election, "Current election authority must remain in inventory");
  assert.ok(election.calendarEvents.includes("2026-11-03"));
  assert.equal(reviewQueue([election], new Date("2026-10-26T14:00:00Z"))[0].reviewNeeded, false);
  // The dedicated November 4 GitHub run must flag this guide immediately after Election Day.
  const dayAfter = reviewQueue([election], new Date("2026-11-04T14:00:00Z"))[0];
  assert.equal(dayAfter.reviewNeeded, true);
  assert.match(dayAfter.reason, /2026-11-03/);
  const due = reviewQueue([election], new Date("2026-11-20T14:00:00Z"))[0];
  assert.equal(due.reviewNeeded, true);
  assert.match(due.reason, /election-specific dates have passed/);
  assert.match(due.reason, /2026-11-03/);
  assert.ok(due.ageDays < REVIEW_AGE_DAYS);
  const refreshed = { ...election, updated: "2026-11-19" };
  assert.equal(reviewQueue([refreshed], new Date("2026-11-20T14:00:00Z"))[0].reviewNeeded, false);
  assert.equal(election.updated, "2026-09-06");
});

test("a new date-specific election guide enters monthly review automatically", () => {
  const sample = [
    'slug: "sample-new-election"',
    'updated: "2026-09-01"',
    'framework: ["For the November 3, 2026 election, consult the official calendar."]',
  ].join("\n");
  const record = parseAuthority(sample, "new.ts");
  assert.deepEqual(record.calendarEvents, ["2026-11-03"]);
  assert.equal(reviewQueue([record], new Date("2026-11-20T14:00:00Z"))[0].reviewNeeded, true);
});
