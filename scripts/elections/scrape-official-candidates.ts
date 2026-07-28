import { writeFile } from "node:fs/promises";
import { chromium, type Frame, type Page } from "playwright";

const SOURCE_URL =
  process.env.ELECTION_CANDIDATE_LIST_URL ??
  "https://goelect.txelections.civixapps.com/ivis-cbp-ui/candidate-information";
const OUTPUT = process.env.ELECTION_CANDIDATE_SCRAPE_OUTPUT ?? "/tmp/texas-candidates.html";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: "en-US",
  timezoneId: "America/Chicago",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150 Safari/537.36",
});
const page = await context.newPage();
const networkPayloads: unknown[] = [];

page.on("response", async (response) => {
  const contentType = response.headers()["content-type"] ?? "";
  if (!contentType.includes("application/json")) return;
  if (!/candidate|election|office|ballot|civix/i.test(response.url())) return;
  try {
    networkPayloads.push(await response.json());
  } catch {
    // Some application endpoints identify JSON but return no body.
  }
});

try {
  const response = await page.goto(SOURCE_URL, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  if (response && response.status() >= 400) {
    throw new Error(`Official candidate application returned HTTP ${response.status()}.`);
  }
  await page.waitForTimeout(8_000);
  await select2026Options(page);
  await clickSearchControls(page);
  await page.waitForTimeout(5_000);

  const tableHtml: string[] = [];
  for (const frame of page.frames()) {
    tableHtml.push(...(await collectPaginatedTables(frame)));
  }

  const normalizedRows = findCandidateRows(networkPayloads);
  const html = normalizedRows.length
    ? jsonRowsToTable(normalizedRows)
    : tableHtml.length
      ? `<html><body>${tableHtml.join("\n")}</body></html>`
      : await page.content();
  const rowCount = countCandidateRows(html);
  if (rowCount === 0) {
    throw new Error("The official candidate application loaded, but no candidate table rows were found.");
  }

  await writeFile(OUTPUT, html);
  console.log(`Extracted ${rowCount} candidate table row(s) from the official application to ${OUTPUT}.`);
} finally {
  await browser.close();
}

async function select2026Options(page: Page) {
  for (const select of await page.locator("select").all()) {
    const options = await select.locator("option").allTextContents();
    const preferred =
      options.find((option) => /nov(?:ember)?\s*3.*2026|2026.*general/i.test(option)) ??
      options.find((option) => /2026/i.test(option));
    if (!preferred) continue;
    try {
      await select.selectOption({ label: preferred.trim() });
    } catch {
      // A select may be read-only or populated after another control.
    }
  }
}

async function clickSearchControls(page: Page) {
  const candidates = page.getByRole("button", { name: /search|view|apply|submit|load/i });
  for (let index = 0; index < (await candidates.count()); index += 1) {
    const button = candidates.nth(index);
    if (!(await button.isVisible()) || !(await button.isEnabled())) continue;
    const name = await button.textContent();
    if (/reset|clear/i.test(name ?? "")) continue;
    try {
      await button.click({ timeout: 5_000 });
      await page.waitForTimeout(2_000);
      break;
    } catch {
      // Continue to another visible search control.
    }
  }
}

async function collectPaginatedTables(frame: Frame) {
  const html: string[] = [];
  const seen = new Set<string>();
  for (let pageNumber = 0; pageNumber < 100; pageNumber += 1) {
    const tables = frame.locator("table");
    for (let index = 0; index < (await tables.count()); index += 1) {
      const table = tables.nth(index);
      const outer = await table.evaluate((element) => element.outerHTML);
      const key = outer.replace(/\s+/g, " ");
      if (!seen.has(key)) {
        seen.add(key);
        html.push(outer);
      }
    }

    const next = frame
      .locator(
        'button:has-text("Next"), a:has-text("Next"), [aria-label*="next" i], .p-paginator-next, .mat-mdc-paginator-navigation-next',
      )
      .first();
    if (!(await next.count()) || !(await next.isVisible()) || !(await next.isEnabled())) break;
    const disabled = await next.getAttribute("aria-disabled");
    const className = await next.getAttribute("class");
    if (disabled === "true" || /disabled/.test(className ?? "")) break;
    try {
      await next.click({ timeout: 5_000 });
      await frame.waitForTimeout(1_000);
    } catch {
      break;
    }
  }
  return html;
}

function findCandidateRows(payloads: readonly unknown[]) {
  const rows: Record<string, unknown>[] = [];
  for (const payload of payloads) walk(payload, rows);
  return [...new Map(rows.map((row) => [rowKey(row), row])).values()];
}

function walk(value: unknown, rows: Record<string, unknown>[]) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, rows);
    return;
  }
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  if (looksLikeCandidateRecord(record)) rows.push(record);
  for (const child of Object.values(record)) walk(child, rows);
}

function looksLikeCandidateRecord(record: Record<string, unknown>) {
  const keys = Object.keys(record).join(" ");
  const text = Object.values(record).map(String).join(" ");
  return /candidate|ballot.?name|first.?name|last.?name/i.test(keys) &&
    /office|contest|race|district/i.test(keys) &&
    /republican|democratic|libertarian|green|independent/i.test(text);
}

function jsonRowsToTable(rows: readonly Record<string, unknown>[]) {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  return `<html><body><table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows
    .map(
      (row) =>
        `<tr>${headers.map((header) => `<td>${escapeHtml(flatten(row[header]))}</td>`).join("")}</tr>`,
    )
    .join("\n")}</tbody></table></body></html>`;
}

function countCandidateRows(html: string) {
  return (html.match(/<tr\b/gi) ?? []).length - (html.match(/<thead\b/gi) ?? []).length;
}

function rowKey(row: Record<string, unknown>) {
  return Object.values(row).map(flatten).join("|").toLowerCase();
}

function flatten(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
