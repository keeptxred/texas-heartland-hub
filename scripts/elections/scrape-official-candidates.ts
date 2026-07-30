import { writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const SOURCE_URL =
  process.env.ELECTION_CANDIDATE_LIST_URL ??
  "https://goelect.txelections.civixapps.com/ivis-cbp-ui/candidate-information";
const API_URL =
  process.env.ELECTION_CANDIDATE_API_URL ??
  "https://goelect.txelections.civixapps.com/api-ivis-cbp/api/cbp/findQualifiedCandidates";
const ELECTION_YEAR = Number(process.env.ELECTION_YEAR ?? "2026");
const ELECTION_ID = Number(process.env.ELECTION_GENERAL_ELECTION_ID ?? "53815");
const OUTPUT = process.env.ELECTION_CANDIDATE_SCRAPE_OUTPUT ?? "/tmp/texas-candidates.json";
const DEBUG_HTML = "/tmp/official-candidate-debug.html";
const DEBUG_SCREENSHOT = "/tmp/official-candidate-debug.png";
const DEBUG_NETWORK = "/tmp/official-candidate-debug-network.json";
const retrievedAt = new Date(process.env.ELECTION_IMPORT_AS_OF ?? Date.now()).toISOString();
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
  if (!["error", "warning"].includes(message.type())) return;
  networkEvents.push({ kind: "console", level: message.type(), text: message.text() });
});

try {
  if (!Number.isInteger(ELECTION_YEAR) || ELECTION_YEAR < 2026) {
    throw new Error(`Invalid election year: ${ELECTION_YEAR}.`);
  }
  if (!Number.isInteger(ELECTION_ID) || ELECTION_ID <= 0) {
    throw new Error(`Invalid official general-election ID: ${ELECTION_ID}.`);
  }

  const navigation = await page.goto(SOURCE_URL, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  if (navigation && navigation.status() >= 400) {
    throw new Error(`Official candidate application returned HTTP ${navigation.status()}.`);
  }

  // Let the state application establish its normal browser session and Cloudflare cookies,
  // then query the same public endpoint the application uses. This avoids depending on
  // Angular Material controls whose enabled state has changed across deployments.
  await page.waitForTimeout(4_000);
  const filters = {
    electionYear: ELECTION_YEAR,
    electionId: ELECTION_ID,
    party: null,
    officeId: null,
    officeType: null,
    status: null,
    countyId: null,
  };
  const response = await context.request.post(API_URL, {
    data: filters,
    headers: {
      accept: "application/json, text/plain, */*",
      origin: new URL(SOURCE_URL).origin,
      referer: SOURCE_URL,
    },
    timeout: 120_000,
  });
  networkEvents.push({
    kind: "api-response",
    method: "POST",
    status: response.status(),
    contentType: response.headers()["content-type"] ?? "",
    url: API_URL,
    filters,
  });
  if (!response.ok()) {
    const body = (await response.text()).slice(0, 2_000);
    throw new Error(
      `Official qualified-candidate API returned HTTP ${response.status()}: ${body}`,
    );
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

  await writeFile(OUTPUT, `${JSON.stringify(rows, null, 2)}\n`);
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
  console.error(
    `Official candidate extraction failed: ${error instanceof Error ? error.message : String(error)}`,
  );
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
  flIncmbntGen?: unknown;
}

interface CandidateRow {
  fullName: string;
  ballotName: string;
  officeName: string;
  party: "republican" | "democratic" | "libertarian" | "green" | "independent" | "other";
  status: "nominee" | "write_in";
  filingStatus: "accepted";
  ballotAccessStatus: "qualified";
  incumbencyType: "incumbent" | "unknown";
  sourceName: string;
  sourceUrl: string;
  sourceType: "official_candidate_listing";
  sourceRecordId: string;
  sourceRetrievedAt: string;
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
  const classification = partyClassification(record.cdParty);
  const sourceRecordId = clean(record.idCandidate);
  if (!looksLikePerson(fullName) || !officeName || !classification || !sourceRecordId) return null;

  return {
    fullName,
    ballotName: fullName,
    officeName,
    party: classification.party,
    status: classification.writeIn ? "write_in" : "nominee",
    filingStatus: "accepted",
    ballotAccessStatus: "qualified",
    incumbencyType: record.flIncmbntGen === true ? "incumbent" : "unknown",
    sourceName: "Texas Secretary of State Qualified Candidate Listing",
    sourceUrl: SOURCE_URL,
    sourceType: "official_candidate_listing",
    sourceRecordId,
    sourceRetrievedAt: retrievedAt,
  };
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

function partyClassification(value: unknown): { party: CandidateRow["party"]; writeIn: boolean } | null {
  const party = clean(value).toUpperCase();
  if (["R", "REP", "REPUBLICAN", "GOP"].includes(party)) {
    return { party: "republican", writeIn: false };
  }
  if (["D", "DEM", "DEMOCRAT", "DEMOCRATIC"].includes(party)) {
    return { party: "democratic", writeIn: false };
  }
  if (["L", "LIB", "LIBERTARIAN"].includes(party)) {
    return { party: "libertarian", writeIn: false };
  }
  if (["G", "GRN", "GREEN"].includes(party)) return { party: "green", writeIn: false };
  if (["I", "IND", "INDEPENDENT"].includes(party)) {
    return { party: "independent", writeIn: false };
  }
  if (["W", "WRITE-IN", "WRITE IN"].includes(party)) return { party: "other", writeIn: true };
  if (["O", "OTH", "OTHER"].includes(party)) return { party: "other", writeIn: false };
  return null;
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
