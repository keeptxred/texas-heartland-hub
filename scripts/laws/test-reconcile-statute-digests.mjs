import assert from "node:assert/strict";
import { test } from "node:test";
import { compareStatuteFingerprints, lastBotSnapshot, SNAPSHOT_MARKER } from "./reconcile-statute-digests.mjs";

const A = "a".repeat(64);
const B = "b".repeat(64);
const C = "c".repeat(64);
const url = "https://tcss.legis.texas.gov/Docs/BC/htm/BC.17.htm";
const other = "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.552.htm";
const row = (hash, state = "healthy") => ({ url, state, statuteFingerprint: hash, guides: ["consumer.ts"] });

test("bootstraps without falsely alleging an enacted amendment", () => {
  const r = compareStatuteFingerprints([row(A)], null);
  assert.equal(r.publish, true);
  assert.equal(r.changed.length, 0);
  assert.match(r.markdown, /First successful scan/);
  assert.deepEqual(r.snapshot, { [url]: A });
  assert.equal(lastBotSnapshot(r.markdown)[url], A);
});
test("stable chapter is silent and exact content change becomes actionable review lead", () => {
  const same = compareStatuteFingerprints([row(A)], { [url]: A });
  assert.equal(same.publish, false);
  const changed = compareStatuteFingerprints([row(B)], { [url]: A });
  assert.equal(changed.publish, true);
  assert.deepEqual(changed.changed, [url]);
  assert.match(changed.markdown, /consumer.ts/);
  assert.match(changed.markdown, /NOT proof of a specific enacted amendment/);
});
test("403s and missing bodies preserve the prior signature, not an invented change", () => {
  const prior = { [url]: A, [other]: C };
  const r = compareStatuteFingerprints([row(undefined, "inconclusive")], prior);
  assert.equal(r.publish, false);
  assert.deepEqual(r.snapshot, prior);
  assert.equal(r.observed, 0);
});
test("a newly readable official source is not labeled a changed law", () => {
  const r = compareStatuteFingerprints([row(B)], { [other]: C });
  assert.deepEqual(r.changed, []);
  assert.deepEqual(r.added, [url]);
  assert.equal(r.publish, true);
});
test("only well-formed bot snapshots can be extracted and later valid wins", () => {
  assert.equal(lastBotSnapshot("<!-- "+SNAPSHOT_MARKER+"\n{not json}\n-->"), null);
  const good = compareStatuteFingerprints([row(A)], null).markdown;
  const later = compareStatuteFingerprints([row(B)], null).markdown;
  assert.equal(lastBotSnapshot(good + "\n" + later)[url], B);
});
