/**
 * Parse TEC's expenditure-by-category PDF after pdftotext -layout.
 * These are activity expenditures, not lobbyist compensation or donations.
 * Reject missing, duplicated, invalid, or non-balancing totals.
 */
export const EXPENDITURE_CATEGORIES = [
  "Transportation", "Food and beverages", "Entertainment", "Gifts",
  "Awards", "Events", "Media",
];

function toCents(amount) {
  const digits = amount.replace(/[$,]/g, "");
  if (!/^\d+\.\d{2}$/.test(digits)) throw new Error("Invalid TEC currency cell: " + amount);
  const [whole, cents] = digits.split(".");
  return Number(whole) * 100 + Number(cents);
}

export function parseTexasLobbyExpenditures(pdfText) {
  const lines = pdfText.replace(/\r/g, "").split("\n");
  const month = "(?:January|February|March|April|May|June|July|August|September|October|November|December)";
  const printedDates = [...pdfText.matchAll(new RegExp("\\b" + month + " \\d{1,2}, 20\\d{2} \\d{1,2}:\\d{2}:\\d{2} (?:AM|PM)\\b", "g"))].map((match) => match[0]);
  if (!printedDates.length || new Set(printedDates).size !== 1)
    throw new Error("Missing or conflicting 2026 PDF printed-date stamps");

  function readYear(year) {
    const rows = lines.filter((line) => new RegExp("^\\s*" + year + "\\s+\\d{3,6}\\s+\\$").test(line));
    if (rows.length !== 1) throw new Error("Expected one TEC expenditure row for " + year + ", got " + rows.length);
    const countMatch = rows[0].match(new RegExp("^\\s*" + year + "\\s+(\\d{3,6})\\s+"));
    const amounts = rows[0].match(/\$[\d,]+\.\d{2}/g);
    if (!countMatch || amounts?.length !== 8) throw new Error("Malformed TEC expenditure row for " + year);
    const cents = amounts.map(toCents);
    if (cents.slice(0, 7).reduce((sum, n) => sum + n, 0) !== cents[7])
      throw new Error("TEC expenditure categories do not add to total for " + year);
    return {
      lobbyistCount: Number(countMatch[1]),
      categories: EXPENDITURE_CATEGORIES.map((category, index) => ({ category, amount: cents[index] / 100 })),
      total: cents[7] / 100,
    };
  }

  const reportPrintedAt = printedDates[0];
  const reportDate = new Date(reportPrintedAt);
  if (!Number.isFinite(reportDate.valueOf()) || reportDate < new Date("2026-01-01T00:00:00Z") ||
      reportDate.getTime() > Date.now() + 48 * 60 * 60 * 1000)
    throw new Error("Invalid expenditure PDF report date: " + reportPrintedAt);
  return { reportPrintedAt, year2025: readYear(2025), year2026: readYear(2026) };
}
