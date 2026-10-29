import test from "node:test";
import assert from "node:assert/strict";
import { parseTexasLobbyExpenditures } from "./parse-texas-expenditures.mjs";

const fixture = [
  "TEXAS ETHICS COMMISSION SUMMARY OF LOBBY EXPENDITURES",
  "Year Lobbyist Count Transportation Food&Beverage Entertainment Gifts Awards Events Media Total",
  "2025 1900 $63,945.62 $4,216,096.56 $367,640.25 $282,441.86 $33,830.64 $65,313.70 $14,002,768.76 $19,032,037.39",
  "2026 1584 $200,991.17 $1,101,492.72 $186,532.67 $40,599.74 $11,313.68 $49,800.00 $291,744.27 $1,882,474.25",
  "October 16, 2026 5:02:05 PM Page 2 of 2",
].join("\n");

test("parses stamped 2025/2026 rows and exactly checks category totals", () => {
  const report = parseTexasLobbyExpenditures(fixture);
  assert.equal(report.reportPrintedAt, "October 16, 2026 5:02:05 PM");
  assert.equal(report.year2025.total, 19032037.39);
  assert.equal(report.year2026.total, 1882474.25);
  assert.equal(report.year2026.lobbyistCount, 1584);
  assert.equal(report.year2026.categories.length, 7);
});
test("fails closed on arithmetic mismatch", () => {
  assert.throws(() => parseTexasLobbyExpenditures(fixture.replace("$1,882,474.25", "$1,882,474.24")), /do not add/);
});
test("fails closed on missing date", () => {
  assert.throws(() => parseTexasLobbyExpenditures(fixture.replace("October 16, 2026 5:02:05 PM", "")), /printed-date/);
});
test("fails closed on duplicated rows", () => {
  assert.throws(() => parseTexasLobbyExpenditures(fixture + "\n" + fixture), /one TEC expenditure row/);
});
