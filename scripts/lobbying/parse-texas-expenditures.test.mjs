import { describe, expect, it } from "vitest";
import { parseTexasLobbyExpenditures } from "./parse-texas-expenditures.mjs";

const fixture = [
  "TEXAS ETHICS COMMISSION SUMMARY OF LOBBY EXPENDITURES",
  "Year Lobbyist Count Transportation Food&Beverage Entertainment Gifts Awards Events Media Total",
  "2025 1900 $63,945.62 $4,216,096.56 $367,640.25 $282,441.86 $33,830.64 $65,313.70 $14,002,768.76 $19,032,037.39",
  "2026 1584 $200,991.17 $1,101,492.72 $186,532.67 $40,599.74 $11,313.68 $49,800.00 $291,744.27 $1,882,474.25",
  "October 16, 2026 5:02:05 PM Page 2 of 2",
].join("\n");

describe("2026 official TEC expenditure PDF extraction", () => {
  it("parses stamped 2025 and 2026 rows and reconciles their totals", () => {
    const report = parseTexasLobbyExpenditures(fixture);
    expect(report.reportPrintedAt).toBe("October 16, 2026 5:02:05 PM");
    expect(report.year2025.total).toBe(19032037.39);
    expect(report.year2026.total).toBe(1882474.25);
    expect(report.year2026.lobbyistCount).toBe(1584);
    expect(report.year2026.categories).toHaveLength(7);
  });
  it("fails closed on arithmetic mismatch", () => {
    expect(() => parseTexasLobbyExpenditures(fixture.replace("$1,882,474.25", "$1,882,474.24"))).toThrow(/do not add/);
  });
  it("fails closed on a missing stamped date", () => {
    expect(() => parseTexasLobbyExpenditures(fixture.replace("October 16, 2026 5:02:05 PM", ""))).toThrow(/printed-date/);
  });
  it("fails closed on duplicated rows", () => {
    expect(() => parseTexasLobbyExpenditures(fixture + "\n" + fixture)).toThrow(/one TEC expenditure row/);
  });
});
