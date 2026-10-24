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
  const record = parseAuthority('export const EXAMPLE = {\\n  "slug": "generated-topic",\\n  "updated": "2026-10-23"\\n};', "generated.ts");
  assert.equal(record.slug, "generated-topic");
  assert.equal(record.updated, "2026-10-23");
});

test("reject malformed or fictitious review dates", () => {
  assert.throws(() => parseAuthority('slug: "example", updated: "2026-02-31"', "bad"), /missing|invalid/);
  assert.throws(() => parseAuthority('slug: "example",\n updated: "2026-02-31"', "bad"), /invalid review calendar date/);
});

test("marks a guide due after 180 days without altering a publication date", () => {
  const original = {slug: "sample", updated: "2026-04-01", published: "2025-12-01", file: "sample.ts"};
  const rows = reviewQueue([original], new Date("2026-10-24T14:00:00Z"));
  assert.equal(REVIEW_AGE_DAYS, 180);
  assert.equal(rows[0].reviewNeeded, true);
  assert.match(rows[0].reason, /last reviewed/);
  assert.equal(original.updated, "2026-04-01");
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
