import { writeFile } from "node:fs/promises";
import { chromium, type Page } from "@playwright/test";

const SOURCE_URL =
  process.env.ELECTION_PRIMARY_RESULTS_URL ??
  "https://results.texas-election.com/races?election_dt=03/03/2026";
const OUTPUT = process.env.ELECTION_PRIMARY_WINNERS_OUTPUT ?? "/tmp/texas-primary-winners.json";
const DEBUG_JSON = "/tmp/official-primary-results-debug.json";
const DEBUG_HTML = "/tmp/official-primary-results-debug.html";
const DEBUG_SCREENSHOT = "/tmp/official-primary-results-debug.png";
const retrievedAt = new Date(process.env.ELECTION_IMPORT_AS_OF ?? Date.now()).toISOString();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: "en-US",
  timezoneId: "America/Chicago",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150 Safari/537.36",
});
const page = await context.newPage();
const payloads: unknown[] = [];

page.on("response", async (response) => {
  const contentType = response.headers()["content-type"] ?? "";
  if (!contentType.includes("json")) return;
  if (!/race|result|candidate|contest|election/i.test(response.url())) return;
  try {
    payloads.push(await response.json());
  } catch {
    // Ignore empty or malformed response bodies.
  }
});

try {
  const response = await page.goto(SOURCE_URL, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  if (response && response.status() >= 400) {
    throw new Error(`Official primary-results application returned HTTP ${response.status()}.`);
  }
  await page.waitForTimeout(10_000);
  await revealAllResults(page);
  await page.waitForTimeout(5_000);

  const records = collectCandidateResults(payloads);
  const domRecords = await collectDomCandidateResults(page);
  const candidates = deduplicate([...records, ...domRecords]);
  const winners = determineOutrightWinners(candidates);
  if (!winners.length) {
    throw new Error(
      `The official March primary-results application loaded, but no outright launch-scope winners were extracted from ${candidates.length} candidate result row(s).`,
    );
  }

  await writeFile(OUTPUT, `${JSON.stringify(winners, null, 2)}\n`);
  console.log(
    `Extracted ${winners.length} outright March primary winner(s) from ${candidates.length} candidate result row(s) to ${OUTPUT}.`,
  );
} catch (error) {
  await Promise.allSettled([
    writeFile(DEBUG_JSON, `${JSON.stringify(payloads, null, 2)}\n`),
    page.content().then((html) => writeFile(DEBUG_HTML, html)),
    page.screenshot({ path: DEBUG_SCREENSHOT, fullPage: true }),
  ]);
  console.error(`Official primary-winner extraction failed: ${(error as Error).message}`);
  throw error;
} finally {
  await browser.close();
}

interface CandidateResult {
  fullName: string;
  party: string;
  officeName: string;
  raceId: string;
  votes: number | null;
  percentage: number | null;
  incumbent: boolean;
  explicitWinner: boolean;
  runoff: boolean;
  sourceRecordId: string | null;
}

async function revealAllResults(page: Page) {
  for (const frame of page.frames()) {
    for (const select of await frame.locator("select").all()) {
      const options = await select.locator("option").allTextContents();
      const option = options.find((value) => /all races|all contests|all offices/i.test(value));
      if (!option) continue;
      try {
        await select.selectOption({ label: option.trim() });
      } catch {
        // Some filters are read-only or populated asynchronously.
      }
    }
    const controls = frame.getByRole("button", { name: /show all|load more|view all|search|apply/i });
    for (let index = 0; index < (await controls.count()); index += 1) {
      const control = controls.nth(index);
      if (!(await control.isVisible()) || !(await control.isEnabled())) continue;
      try {
        await control.click({ timeout: 4_000 });
        await frame.waitForTimeout(1_000);
      } catch {
        // Continue through other possible result controls.
      }
    }
  }
  for (let index = 0; index < 50; index += 1) {
    const more = page
      .locator(
        'button:has-text("Load more"), button:has-text("Show more"), button:has-text("Next"), [aria-label*="next" i]',
      )
      .filter({ visible: true })
      .first();
    if (!(await more.count()) || !(await more.isEnabled())) break;
    try {
      await more.click({ timeout: 4_000 });
      await page.waitForTimeout(750);
    } catch {
      break;
    }
  }
}

function collectCandidateResults(payloads: readonly unknown[]) {
  const output: CandidateResult[] = [];
  for (const payload of payloads) walk(payload, {}, output);
  return output;
}

function walk(value: unknown, inherited: Record<string, unknown>, output: CandidateResult[]) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, inherited, output);
    return;
  }
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  const context = { ...inherited, ...contextFields(record) };
  const normalized = normalizeResultRecord(record, context);
  if (normalized) output.push(normalized);
  for (const child of Object.values(record)) walk(child, context, output);
}

function contextFields(record: Record<string, unknown>) {
  return {
    officeName: first(record, [
      /office.*name/i,
      /contest.*name/i,
      /race.*name/i,
      /^office$/i,
      /^contest$/i,
    ]),
    party: first(record, [/party.*name/i, /party.*label/i, /^party$/i, /affiliation/i]),
    runoff: first(record, [/runoff/i]),
    totalVotes: first(record, [/total.*votes/i, /votes.*total/i, /ballots.*cast/i]),
  };
}

function normalizeResultRecord(
  record: Record<string, unknown>,
  context: Record<string, unknown>,
): CandidateResult | null {
  const fullName =
    first(record, [/ballot.*name/i, /candidate.*name/i, /full.*name/i]) || joinName(record);
  const officeName = clean(
    first(record, [/office.*name/i, /contest.*name/i, /race.*name/i]) ?? context.officeName,
  );
  const party = partyFromText(
    first(record, [/party.*name/i, /party.*label/i, /^party$/i, /affiliation/i]) ?? context.party,
  );
  const raceId = raceIdFromOffice(officeName);
  if (!looksLikePerson(fullName) || !party || !raceId) return null;

  const votes = numberOrNull(
    first(record, [/candidate.*votes/i, /vote.*count/i, /ballots.*cast/i, /^votes$/i]),
  );
  const percentage = percentOrNull(
    first(record, [/vote.*percent/i, /percentage/i, /percent/i, /^pct$/i]),
  );
  const statusText = Object.entries(record)
    .filter(([key]) => /winner|status|result|nominee|runoff|advance/i.test(key))
    .map(([, value]) => clean(value))
    .join(" ");
  return {
    fullName: stripIncumbent(fullName),
    party,
    officeName,
    raceId,
    votes,
    percentage,
    incumbent: /\(I\)/i.test(fullName) || /incumbent/i.test(statusText),
    explicitWinner:
      booleanValue(first(record, [/is.*winner/i, /^winner$/i, /nominee/i])) ||
      /winner|won|nominee|nominated/i.test(statusText),
    runoff:
      booleanValue(first(record, [/runoff/i]) ?? context.runoff) ||
      /runoff|required runoff|advanced to runoff/i.test(statusText),
    sourceRecordId: clean(first(record, [/candidate.*id/i, /result.*id/i, /^id$/i])) || null,
  };
}

async function collectDomCandidateResults(page: Page) {
  const output: CandidateResult[] = [];
  for (const frame of page.frames()) {
    const rows = await frame
      .locator('table tbody tr, [role="row"]')
      .evaluateAll((elements) =>
        elements.map((element) => ({
          text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
          cells: Array.from(
            element.querySelectorAll('th,td,[role="cell"],[role="gridcell"]'),
          ).map((cell) => cell.textContent?.replace(/\s+/g, " ").trim() ?? ""),
        })),
      );
    let currentOffice = "";
    let currentParty = "";
    for (const row of rows) {
      const combined = clean(row.text);
      const detectedOffice = row.cells.find((cell) => raceIdFromOffice(cell));
      if (detectedOffice) currentOffice = detectedOffice;
      const detectedParty = row.cells.find((cell) => partyFromText(cell));
      if (detectedParty) currentParty = detectedParty;
      const officeName = detectedOffice ?? currentOffice;
      const party = partyFromText(detectedParty ?? currentParty);
      const raceId = raceIdFromOffice(officeName);
      const fullName = row.cells.find(
        (cell) => looksLikePerson(cell) && !partyFromText(cell) && !raceIdFromOffice(cell),
      );
      if (!fullName || !party || !raceId) continue;
      const numeric = row.cells
        .map((cell) => ({ raw: cell, value: numberOrNull(cell) }))
        .filter((item) => item.value != null);
      const percentageCell = row.cells.find((cell) => /%/.test(cell));
      output.push({
        fullName: stripIncumbent(fullName),
        party,
        officeName,
        raceId,
        votes: numeric.find((item) => !/%/.test(item.raw))?.value ?? null,
        percentage: percentOrNull(percentageCell),
        incumbent: /\(I\)/i.test(fullName),
        explicitWinner: /winner|won|nominee/i.test(combined),
        runoff: /runoff/i.test(combined),
        sourceRecordId: null,
      });
    }
  }
  return output;
}

function determineOutrightWinners(candidates: readonly CandidateResult[]) {
  const groups = new Map<string, CandidateResult[]>();
  for (const candidate of candidates) {
    const key = `${candidate.raceId}|${candidate.party}`;
    const group = groups.get(key) ?? [];
    group.push(candidate);
    groups.set(key, group);
  }

  const winners = [];
  for (const group of groups.values()) {
    const unique = deduplicate(group);
    const totalVotes = unique.reduce((total, candidate) => total + (candidate.votes ?? 0), 0);
    const ranked = unique
      .map((candidate) => ({
        ...candidate,
        percentage:
          candidate.percentage ??
          (candidate.votes != null && totalVotes > 0
            ? Math.round((candidate.votes / totalVotes) * 10_000) / 100
            : null),
      }))
      .sort(
        (left, right) =>
          Number(right.explicitWinner) - Number(left.explicitWinner) ||
          (right.percentage ?? -1) - (left.percentage ?? -1) ||
          (right.votes ?? -1) - (left.votes ?? -1),
      );
    const leader = ranked[0];
    if (!leader || leader.runoff) continue;
    const wonOutright =
      leader.explicitWinner || ranked.length === 1 || (leader.percentage != null && leader.percentage > 50);
    if (!wonOutright) continue;
    winners.push({
      fullName: leader.fullName,
      ballotName: leader.fullName,
      party: leader.party,
      raceId: leader.raceId,
      incumbencyType: leader.incumbent ? "incumbent" : "unknown",
      status: "nominee",
      filingStatus: "accepted",
      ballotAccessStatus: "qualified",
      sourceName: "Texas 2026 Primary Election Results Application",
      sourceUrl: SOURCE_URL,
      sourceType: "official",
      sourceRecordId:
        leader.sourceRecordId ?? slugify(`${leader.party}-${leader.officeName}-${leader.fullName}`),
      sourceRetrievedAt: retrievedAt,
      notes:
        leader.percentage != null
          ? `Won the March 3, 2026 ${leader.party} primary with ${leader.percentage.toFixed(2)}% of reported votes.`
          : `Won the March 3, 2026 ${leader.party} primary according to the official results application.`,
    });
  }
  return winners.sort((left, right) =>
    `${left.raceId}|${left.party}|${left.fullName}`.localeCompare(
      `${right.raceId}|${right.party}|${right.fullName}`,
      "en-US",
    ),
  );
}

function first(record: Record<string, unknown>, patterns: readonly RegExp[]) {
  for (const pattern of patterns) {
    const entry = Object.entries(record).find(
      ([key, value]) => pattern.test(key) && value != null && typeof value !== "object",
    );
    if (entry) return entry[1];
  }
  return null;
}

function joinName(record: Record<string, unknown>) {
  const firstName = clean(first(record, [/first.*name/i]));
  const middleName = clean(first(record, [/middle.*name/i]));
  const lastName = clean(first(record, [/last.*name/i]));
  return clean([firstName, middleName, lastName].filter(Boolean).join(" "));
}

function raceIdFromOffice(value: unknown) {
  const office = clean(value).toUpperCase().replace(/\./g, "");
  if (!office) return null;
  if (/^U S SENATOR$|^UNITED STATES SENATOR$/.test(office)) return "race-2026-us-senate";
  if (/^GOVERNOR$/.test(office)) return "race-2026-governor";
  if (/LIEUTENANT GOVERNOR/.test(office)) return "race-2026-lieutenant-governor";
  if (/ATTORNEY GENERAL/.test(office)) return "race-2026-attorney-general";
  if (/COMPTROLLER/.test(office)) return "race-2026-comptroller";
  if (/GENERAL LAND|LAND COMMISSIONER/.test(office)) return "race-2026-land-commissioner";
  if (/AGRICULTURE/.test(office)) return "race-2026-agriculture-commissioner";
  if (/RAILROAD COMMISSIONER/.test(office)) return "race-2026-railroad-commissioner";
  let match = office.match(/U S REPRESENTATIVE(?:,)? DISTRICT (\d+)/);
  if (match) return `race-2026-us-house-${Number(match[1])}`;
  match = office.match(/STATE SENATOR(?:,)? DISTRICT (\d+)/);
  if (match) return `race-2026-texas-senate-${Number(match[1])}`;
  match = office.match(/STATE REPRESENTATIVE(?:,)? DISTRICT (\d+)/);
  if (match) return `race-2026-texas-house-${Number(match[1])}`;
  match = office.match(/(?:MEMBER, )?STATE BOARD OF EDUCATION(?:,)? DISTRICT (\d+)/);
  if (match) return `race-2026-state-board-of-education-${Number(match[1])}`;
  match = office.match(/SUPREME COURT.*PLACE (\d+)/);
  if (match) return `race-2026-texas-supreme-court-place-${Number(match[1])}`;
  match = office.match(/COURT OF CRIMINAL APPEALS.*PLACE (\d+)/);
  if (match) return `race-2026-court-of-criminal-appeals-place-${Number(match[1])}`;
  return null;
}

function partyFromText(value: unknown) {
  const normalized = clean(value).toLowerCase();
  if (/republican|^rep$|^r$|gop/.test(normalized)) return "republican";
  if (/democratic|democrat|^dem$|^d$/.test(normalized)) return "democratic";
  if (/libertarian|^lib$|^l$/.test(normalized)) return "libertarian";
  if (/green|^grn$|^g$/.test(normalized)) return "green";
  return null;
}

function booleanValue(value: unknown) {
  if (typeof value === "boolean") return value;
  return /^(1|true|yes|y|winner|won)$/i.test(clean(value));
}

function numberOrNull(value: unknown) {
  const text = clean(value).replace(/[$,%]/g, "").replace(/,/g, "");
  if (!text || !/^-?\d+(?:\.\d+)?$/.test(text)) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function percentOrNull(value: unknown) {
  const parsed = numberOrNull(value);
  if (parsed == null || parsed < 0 || parsed > 100) return null;
  return parsed;
}

function deduplicate<T extends CandidateResult>(values: readonly T[]) {
  return [...new Map(values.map((value) => [`${normalize(value.fullName)}|${value.party}|${value.raceId}`, value])).values()];
}

function normalize(value: unknown) {
  return stripIncumbent(clean(value)).toLocaleLowerCase("en-US").replace(/[^a-z0-9]/g, "");
}

function looksLikePerson(value: unknown) {
  const text = clean(value);
  return (
    text.length >= 3 &&
    /[A-Za-z]/.test(text) &&
    !partyFromText(text) &&
    !raceIdFromOffice(text) &&
    !/^(candidate|ballots cast|polling|race total|status|votes|percentage)$/i.test(text)
  );
}

function stripIncumbent(value: unknown) {
  return clean(value).replace(/\s*\(I\)\s*$/i, "");
}

function clean(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function slugify(value: unknown) {
  return clean(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
