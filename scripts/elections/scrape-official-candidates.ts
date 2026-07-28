import { writeFile } from "node:fs/promises";
import { chromium, type Frame, type Page } from "@playwright/test";

const SOURCE_URL =
  process.env.ELECTION_CANDIDATE_LIST_URL ??
  "https://goelect.txelections.civixapps.com/ivis-cbp-ui/candidate-information";
const OUTPUT = process.env.ELECTION_CANDIDATE_SCRAPE_OUTPUT ?? "/tmp/texas-candidates.html";
const DEBUG_HTML = "/tmp/official-candidate-debug.html";
const DEBUG_SCREENSHOT = "/tmp/official-candidate-debug.png";
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
  if (!/candidate|election|office|ballot|civix|contest/i.test(response.url())) return;
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

  const rows = new Map<string, CandidateRow>();
  for (const row of findCandidateRows(networkPayloads)) rows.set(rowKey(row), row);
  for (const frame of page.frames()) {
    for (const row of await collectPaginatedCandidateRows(frame)) rows.set(rowKey(row), row);
  }

  if (rows.size === 0) {
    throw new Error("The official candidate application loaded, but no candidate rows were found.");
  }

  const html = candidateRowsToTable([...rows.values()]);
  await writeFile(OUTPUT, html);
  console.log(`Extracted ${rows.size} candidate row(s) from the official application to ${OUTPUT}.`);
} catch (error) {
  await Promise.allSettled([
    page.content().then((html) => writeFile(DEBUG_HTML, html)),
    page.screenshot({ path: DEBUG_SCREENSHOT, fullPage: true }),
  ]);
  console.error(`Official candidate extraction failed: ${(error as Error).message}`);
  throw error;
} finally {
  await browser.close();
}

interface CandidateRow {
  fullName: string;
  officeName: string;
  party: string;
  ballotName?: string;
  sourceRecordId?: string;
}

async function select2026Options(page: Page) {
  for (const frame of page.frames()) {
    for (const select of await frame.locator("select").all()) {
      const options = await select.locator("option").allTextContents();
      const preferred =
        options.find((option) => /nov(?:ember)?\s*3.*2026|2026.*general/i.test(option)) ??
        options.find((option) => /2026/i.test(option));
      if (!preferred) continue;
      try {
        await select.selectOption({ label: preferred.trim() });
        await frame.waitForTimeout(1_000);
      } catch {
        // A select may be read-only or populated after another control.
      }
    }
  }
}

async function clickSearchControls(page: Page) {
  for (const frame of page.frames()) {
    const candidates = frame.getByRole("button", { name: /search|view|apply|submit|load/i });
    for (let index = 0; index < (await candidates.count()); index += 1) {
      const button = candidates.nth(index);
      if (!(await button.isVisible()) || !(await button.isEnabled())) continue;
      const name = await button.textContent();
      if (/reset|clear/i.test(name ?? "")) continue;
      try {
        await button.click({ timeout: 5_000 });
        await frame.waitForTimeout(2_000);
        return;
      } catch {
        // Continue to another visible search control.
      }
    }
  }
}

async function collectPaginatedCandidateRows(frame: Frame) {
  const output = new Map<string, CandidateRow>();
  for (let pageNumber = 0; pageNumber < 100; pageNumber += 1) {
    for (const row of await collectTableRows(frame)) output.set(rowKey(row), row);
    for (const row of await collectAccessibleGridRows(frame)) output.set(rowKey(row), row);

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
  return [...output.values()];
}

async function collectTableRows(frame: Frame) {
  const raw = await frame.locator("table").evaluateAll((tables) =>
    tables.flatMap((table) => {
      const headers = Array.from(table.querySelectorAll("thead th")).map(
        (cell) => cell.textContent?.trim() ?? "",
      );
      return Array.from(table.querySelectorAll("tbody tr")).map((row) => ({
        headers,
        cells: Array.from(row.querySelectorAll("th,td")).map(
          (cell) => cell.textContent?.replace(/\s+/g, " ").trim() ?? "",
        ),
      }));
    }),
  );
  return raw.map(normalizeColumnRow).filter((row): row is CandidateRow => row !== null);
}

async function collectAccessibleGridRows(frame: Frame) {
  const raw = await frame.locator('[role="grid"], [role="table"]').evaluateAll((grids) =>
    grids.flatMap((grid) => {
      const headers = Array.from(grid.querySelectorAll('[role="columnheader"]')).map(
        (cell) => cell.textContent?.trim() ?? "",
      );
      return Array.from(grid.querySelectorAll('[role="row"]'))
        .map((row) => ({
          headers,
          cells: Array.from(row.querySelectorAll('[role="gridcell"], [role="cell"]')).map(
            (cell) => cell.textContent?.replace(/\s+/g, " ").trim() ?? "",
          ),
        }))
        .filter((row) => row.cells.length > 0);
    }),
  );
  return raw.map(normalizeColumnRow).filter((row): row is CandidateRow => row !== null);
}

function normalizeColumnRow(input: { headers: string[]; cells: string[] }): CandidateRow | null {
  const headers = input.headers.map(normalizeHeader);
  const get = (pattern: RegExp) => {
    const index = headers.findIndex((header) => pattern.test(header));
    return index >= 0 ? clean(input.cells[index]) : "";
  };
  const party = get(/party|affiliation/) || input.cells.find(isParty) || "";
  const office =
    get(/office|contest|race/) || input.cells.find((cell) => looksLikeOffice(cell)) || "";
  const name =
    get(/candidate|ballot.*name|full.*name|name/) ||
    input.cells.find((cell) => looksLikePerson(cell) && !isParty(cell) && cell !== office) ||
    "";
  if (!looksLikePerson(name) || !isParty(party) || !looksLikeOffice(office)) return null;
  return { fullName: name, ballotName: name, officeName: office, party };
}

function findCandidateRows(payloads: readonly unknown[]) {
  const rows: CandidateRow[] = [];
  for (const payload of payloads) walk(payload, rows);
  return [...new Map(rows.map((row) => [rowKey(row), row])).values()];
}

function walk(value: unknown, rows: CandidateRow[]) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, rows);
    return;
  }
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  const normalized = normalizeNetworkRecord(record);
  if (normalized) rows.push(normalized);
  for (const child of Object.values(record)) walk(child, rows);
}

function normalizeNetworkRecord(record: Record<string, unknown>): CandidateRow | null {
  const fullName = firstValue(record, [
    /ballot.*name/i,
    /candidate.*name/i,
    /full.*name/i,
    /^name$/i,
  ]) || joinName(record);
  const officeName = firstValue(record, [/office.*name/i, /contest.*name/i, /race.*name/i, /^office$/i]);
  const party = firstValue(record, [/party.*name/i, /party.*label/i, /^party$/i, /affiliation/i]);
  if (!looksLikePerson(fullName) || !looksLikeOffice(officeName) || !isParty(party)) return null;
  return {
    fullName,
    ballotName: fullName,
    officeName,
    party,
    sourceRecordId: firstValue(record, [/candidate.*id/i, /^id$/i]) || undefined,
  };
}

function firstValue(record: Record<string, unknown>, patterns: readonly RegExp[]) {
  for (const pattern of patterns) {
    const entry = Object.entries(record).find(
      ([key, value]) => pattern.test(key) && ["string", "number"].includes(typeof value),
    );
    if (entry) return clean(entry[1]);
  }
  return "";
}

function joinName(record: Record<string, unknown>) {
  const first = firstValue(record, [/first.*name/i]);
  const middle = firstValue(record, [/middle.*name/i]);
  const last = firstValue(record, [/last.*name/i]);
  return clean([first, middle, last].filter(Boolean).join(" "));
}

function candidateRowsToTable(rows: readonly CandidateRow[]) {
  return `<html><body><table><thead><tr><th>Candidate Name</th><th>Office</th><th>Party</th><th>Source Record ID</th></tr></thead><tbody>${rows
    .map(
      (row) =>
        `<tr><td>${escapeHtml(row.ballotName ?? row.fullName)}</td><td>${escapeHtml(row.officeName)}</td><td>${escapeHtml(row.party)}</td><td>${escapeHtml(row.sourceRecordId ?? "")}</td></tr>`,
    )
    .join("\n")}</tbody></table></body></html>`;
}

function rowKey(row: CandidateRow) {
  return `${row.fullName}|${row.officeName}|${row.party}`.toLocaleLowerCase("en-US");
}

function normalizeHeader(value: string) {
  return clean(value).toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, " ");
}

function looksLikePerson(value: unknown) {
  const text = clean(value);
  return (
    text.length >= 3 &&
    /[A-Za-z]/.test(text) &&
    !isParty(text) &&
    !looksLikeOffice(text) &&
    !/^(candidate|ballots cast|polling|race total|status|name)$/i.test(text)
  );
}

function looksLikeOffice(value: unknown) {
  const text = clean(value);
  return /senator|senate|representative|governor|attorney general|comptroller|commissioner|supreme court|criminal appeals|state board of education|district/i.test(
    text,
  );
}

function isParty(value: unknown) {
  return /^(republican|democratic|democrat|libertarian|green|independent|nonpartisan|rep|dem|gop|r|d|l|g|i)$/i.test(
    clean(value),
  );
}

function clean(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
