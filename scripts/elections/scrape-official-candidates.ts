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
const networkEvents: Record<string, unknown>[] = [];

page.on("response", (response) => {
  networkEvents.push({
    kind: "response",
    method: response.request().method(),
    status: response.status(),
    contentType: response.headers()["content-type"] ?? "",
    url: response.url(),
  });
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
  if (!['error', 'warning'].includes(message.type())) return;
  networkEvents.push({ kind: "console", level: message.type(), text: message.text() });
});

try {
  const navigation = await page.goto(SOURCE_URL, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  if (navigation && navigation.status() >= 400) {
    throw new Error(`Official candidate application returned HTTP ${navigation.status()}.`);
  }
  await page.waitForTimeout(8_000);

  const frame = await findCandidateFrame(page);
  await selectMatOption(frame, 'mat-select[formcontrolname="electionYear"]', /^2026$/i);
  await selectMatOption(
    frame,
    'mat-select[formcontrolname="electionId"]',
    /(?:2026.*general|general.*2026|nov(?:ember)?\s*3.*2026)/i,
  );

  const responsePromise = page.waitForResponse(
    (response) => /\/findQualifiedCandidates(?:\?|$)/i.test(response.url()),
    { timeout: 120_000 },
  );
  const button = frame.getByRole("button", { name: /qualified candidates information/i }).first();
  await waitForButtonEnabled(button);
  await button.click({ timeout: 10_000 });

  const response = await responsePromise;
  if (!response.ok()) {
    throw new Error(`Official qualified-candidate API returned HTTP ${response.status()}.`);
  }
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Official qualified-candidate API did not return an array.");
  }

  const rows = deduplicateRows(payload.map(normalizeOfficialCandidate).filter(isCandidateRow));
  if (!rows.length) {
    throw new Error(
      `Official qualified-candidate API returned ${payload.length} record(s), but none matched the public candidate schema.`,
    );
  }

  await writeFile(OUTPUT, candidateRowsToTable(rows));
  console.log(
    `Extracted ${rows.length} privacy-safe candidate row(s) from ${payload.length} official qualified-candidate record(s).`,
  );
} catch (error) {
  await Promise.allSettled([
    page.content().then((html) => writeFile(DEBUG_HTML, html)),
    page.screenshot({ path: DEBUG_SCREENSHOT, fullPage: true }),
    writeFile(
      DEBUG_NETWORK,
      `${JSON.stringify(
        {
          capturedAt: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
          events: networkEvents,
        },
        null,
        2,
      )}\n`,
    ),
  ]);
  console.error(`Official candidate extraction failed: ${error instanceof Error ? error.message : String(error)}`);
  throw error;
} finally {
  await browser.close();
}

interface OfficialCandidateRecord {
  idCandidate?: unknown;
  cdParty?: unknown;
  txLastNameBallot?: unknown;
  txFirstNameBallot?: unknown;
  txFullNameBallot?: unknown;
  txOfficeName?: unknown;
  flActive?: unknown;
}

interface CandidateRow {
  fullName: string;
  officeName: string;
  party: string;
  sourceRecordId: string;
}

async function findCandidateFrame(page: Page) {
  for (const frame of page.frames()) {
    if (await frame.locator('mat-select[formcontrolname="electionYear"]').count()) return frame;
  }
  throw new Error("The official candidate application did not expose the election-year control.");
}

async function selectMatOption(frame: Frame, selector: string, pattern: RegExp) {
  const control = frame.locator(selector).first();
  await waitForEnabled(control);
  await control.scrollIntoViewIfNeeded();
  await control.click({ timeout: 10_000 });
  const options = frame.locator('mat-option, [role="option"]');
  await options.first().waitFor({ state: "visible", timeout: 10_000 });
  const texts = await options.allTextContents();
  const index = texts.findIndex((text) => pattern.test(clean(text)));
  if (index < 0) {
    throw new Error(`Candidate application option not found. Available options: ${texts.map(clean).join(" | ")}`);
  }
  await options.nth(index).click({ timeout: 10_000 });
  await frame.waitForTimeout(1_500);
}

async function waitForEnabled(locator: Locator, timeoutMs = 20_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if ((await locator.count()) && (await locator.getAttribute("aria-disabled")) !== "true") return;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("A required candidate application control remained disabled.");
}

async function waitForButtonEnabled(button: Locator, timeoutMs = 20_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await button.isEnabled()) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("The qualified-candidate search button remained disabled.");
}

function normalizeOfficialCandidate(value: unknown): CandidateRow | null {
  if (!value || typeof value !== "object") return null;
  const record = value as OfficialCandidateRecord;
  if (record.flActive === false) return null;

  const fullName = clean(
    record.txFullNameBallot ??
      [record.txFirstNameBallot, record.txLastNameBallot].map(clean).filter(Boolean).join(" "),
  );
  const officeName = clean(record.txOfficeName);
  const party = partyLabel(record.cdParty);
  const sourceRecordId = clean(record.idCandidate);
  if (!looksLikePerson(fullName) || !officeName || !party || !sourceRecordId) return null;

  return { fullName, officeName, party, sourceRecordId };
}

function isCandidateRow(value: CandidateRow | null): value is CandidateRow {
  return value !== null;
}

function deduplicateRows(rows: readonly CandidateRow[]) {
  return [
    ...new Map(
      rows.map((row) => [
        `${normalize(row.fullName)}|${normalize(row.officeName)}|${normalize(row.party)}`,
        row,
      ]),
    ).values(),
  ].sort((left, right) =>
    `${left.officeName}|${left.party}|${left.fullName}`.localeCompare(
      `${right.officeName}|${right.party}|${right.fullName}`,
      "en-US",
    ),
  );
}

function partyLabel(value: unknown) {
  const party = clean(value).toUpperCase();
  if (["R", "REP", "REPUBLICAN", "GOP"].includes(party)) return "Republican";
  if (["D", "DEM", "DEMOCRAT", "DEMOCRATIC"].includes(party)) return "Democratic";
  if (["L", "LIB", "LIBERTARIAN"].includes(party)) return "Libertarian";
  if (["G", "GRN", "GREEN"].includes(party)) return "Green";
  if (["I", "IND", "INDEPENDENT"].includes(party)) return "Independent";
  if (["NP", "NON", "NONPARTISAN"].includes(party)) return "Nonpartisan";
  if (["O", "OTH", "OTHER"].includes(party)) return "Other";
  return null;
}

function candidateRowsToTable(rows: readonly CandidateRow[]) {
  return `<html><body><table><thead><tr><th>Candidate Name</th><th>Office</th><th>Party</th><th>Source Record ID</th></tr></thead><tbody>${rows
    .map(
      (row) =>
        `<tr><td>${escapeHtml(row.fullName)}</td><td>${escapeHtml(row.officeName)}</td><td>${escapeHtml(row.party)}</td><td>${escapeHtml(row.sourceRecordId)}</td></tr>`,
    )
    .join("\n")}</tbody></table></body></html>`;
}

function looksLikePerson(value: unknown) {
  const text = clean(value);
  return text.length >= 3 && /[A-Za-z]/.test(text) && !/^(candidate|name|vacant)$/i.test(text);
}

function normalize(value: unknown) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]/g, "");
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
