import { writeFile } from "node:fs/promises";
import { chromium, type Frame, type Locator, type Page } from "@playwright/test";

const SOURCE_URL =
  process.env.ELECTION_CANDIDATE_LIST_URL ??
  "https://goelect.txelections.civixapps.com/ivis-cbp-ui/candidate-information";
const OUTPUT = process.env.ELECTION_CANDIDATE_SCRAPE_OUTPUT ?? "/tmp/texas-candidates.html";
const DEBUG_HTML = "/tmp/official-candidate-debug.html";
const DEBUG_SCREENSHOT = "/tmp/official-candidate-debug.png";
const DEBUG_NETWORK = "/tmp/official-candidate-debug-network.json";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: "en-US",
  timezoneId: "America/Chicago",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150 Safari/537.36",
});
const page = await context.newPage();
const networkPayloads: unknown[] = [];
const networkEvents: Record<string, unknown>[] = [];

page.on("response", async (response) => {
  const contentType = response.headers()["content-type"] ?? "";
  networkEvents.push({
    kind: "response",
    method: response.request().method(),
    status: response.status(),
    contentType,
    url: response.url(),
  });
  if (!contentType.includes("application/json")) return;
  if (!/candidate|election|office|ballot|civix|contest/i.test(response.url())) return;
  try {
    networkPayloads.push(await response.json());
  } catch {
    // Some application endpoints identify JSON but return no body.
  }
});
page.on("requestfailed", (request) => {
  networkEvents.push({
    kind: "requestfailed",
    method: request.method(),
    url: request.url(),
    errorText: request.failure()?.errorText ?? "unknown request failure",
  });
});
page.on("console", (message) => {
  if (message.type() !== "error" && message.type() !== "warning") return;
  networkEvents.push({
    kind: "console",
    level: message.type(),
    text: message.text(),
  });
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
  await select2026Election(page);
  await clickSearchControls(page);
  await waitForCandidateResults(page);

  const rows = new Map<string, CandidateRow>();
  for (const row of findCandidateRows(networkPayloads)) rows.set(rowKey(row), row);
  for (const candidatePage of context.pages()) {
    for (const frame of candidatePage.frames()) {
      for (const row of await collectPaginatedCandidateRows(frame)) rows.set(rowKey(row), row);
    }
  }

  if (rows.size === 0) {
    throw new Error(
      `The official candidate application completed loading, but no candidate rows were found in ${networkPayloads.length} captured JSON payload(s).`,
    );
  }

  const html = candidateRowsToTable([...rows.values()]);
  await writeFile(OUTPUT, html);
  console.log(`Extracted ${rows.size} candidate row(s) from the official application to ${OUTPUT}.`);
} catch (error) {
  await Promise.allSettled([
    page.content().then((html) => writeFile(DEBUG_HTML, html)),
    page.screenshot({ path: DEBUG_SCREENSHOT, fullPage: true }),
    writeFile(
      DEBUG_NETWORK,
      `${JSON.stringify(
        {
          capturedAt: new Date().toISOString(),
          error: (error as Error).message,
          events: networkEvents,
          payloadCount: networkPayloads.length,
        },
        null,
        2,
      )}\n`,
    ),
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

async function select2026Election(page: Page) {
  let selected = false;
  for (const frame of page.frames()) {
    const yearControl = frame.locator('mat-select[formcontrolname="electionYear"]').first();
    if (!(await yearControl.count())) continue;

    await selectMatOption(frame, yearControl, /^2026$/i, "2026 election year");
    const electionControl = frame.locator('mat-select[formcontrolname="electionId"]').first();
    await waitForEnabled(electionControl, 20_000);
    await selectMatOption(
      frame,
      electionControl,
      /(?:2026.*general|general.*2026|nov(?:ember)?\s*3.*2026)/i,
      "2026 general election",
    );
    selected = true;
    break;
  }
  if (!selected) {
    throw new Error("The official candidate application did not expose the electionYear control.");
  }
}

async function selectMatOption(
  frame: Frame,
  control: Locator,
  optionPattern: RegExp,
  description: string,
) {
  await waitForEnabled(control, 20_000);
  await control.scrollIntoViewIfNeeded();
  await control.click({ timeout: 10_000 });

  const options = frame.locator('mat-option, [role="option"]');
  await options.first().waitFor({ state: "visible", timeout: 10_000 });
  const texts = await options.allTextContents();
  const index = texts.findIndex((text) => optionPattern.test(clean(text)));
  if (index < 0) {
    await control.press("Escape").catch(() => undefined);
    throw new Error(
      `The official candidate application did not offer ${description}. Available options: ${texts
        .map(clean)
        .filter(Boolean)
        .join(" | ")}`,
    );
  }
  await options.nth(index).click({ timeout: 10_000 });
  await frame.waitForTimeout(1_500);
}

async function waitForEnabled(locator: Locator, timeoutMs: number) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if ((await locator.count()) && (await locator.getAttribute("aria-disabled")) !== "true") return;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("A required official candidate application control remained disabled.");
}

async function clickSearchControls(page: Page) {
  for (const frame of page.frames()) {
    const preferred = frame.getByRole("button", { name: /qualified candidates information/i }).first();
    if ((await preferred.count()) && (await preferred.isVisible())) {
      await waitForButtonEnabled(preferred, 20_000);
      await preferred.click({ timeout: 10_000 });
      await frame.waitForTimeout(1_000);
      return;
    }

    const candidates = frame.getByRole("button", { name: /search|view|apply|submit|load/i });
    for (let index = 0; index < (await candidates.count()); index += 1) {
      const button = candidates.nth(index);
      if (!(await button.isVisible()) || !(await button.isEnabled())) continue;
      const name = await button.textContent();
      if (/reset|clear/i.test(name ?? "")) continue;
      try {
        await button.click({ timeout: 5_000 });
        await frame.waitForTimeout(1_000);
        return;
      } catch {
        // Continue to another visible search control.
      }
    }
  }
  throw new Error("The official candidate application did not enable its search control.");
}

async function waitForButtonEnabled(button: Locator, timeoutMs: number) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await button.isEnabled()) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("The official candidate application search button remained disabled.");
}

async function waitForCandidateResults(page: Page) {
  const spinner = page.locator("lib-loading-spinner").first();
  await spinner.waitFor({ state: "visible", timeout: 10_000 }).catch(() => undefined);
  if (await spinner.count()) {
    await spinner.waitFor({ state: "hidden", timeout: 120_000 }).catch(() => {
      throw new Error("The official candidate application loading dialog remained open for two minutes.");
    });
  }
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);
  await page.waitForTimeout(4_000);
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
