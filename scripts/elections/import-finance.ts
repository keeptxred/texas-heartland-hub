import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATE_FILE = path.join(ROOT, "src/data/elections/2026/candidates.json");
const STATE_FILE = path.resolve(
  process.env.TEXAS_ETHICS_EXPORT ?? path.join(ROOT, "scripts/elections/import/texas-finance.json"),
);
const FEC_API_KEY = process.env.FEC_API_KEY || "DEMO_KEY";
const timestamp = new Date(process.env.ELECTION_IMPORT_AS_OF ?? Date.now()).toISOString();

const candidates = JSON.parse(await readFile(CANDIDATE_FILE, "utf8"));
const stateRows = await readStateRows();
const stateByCandidateId = new Map(stateRows.map((row) => [row.candidateId, row]));
let updated = 0;

const output = [];
for (const candidate of candidates) {
  let finance = null;
  const fecId = candidate.externalIds?.fecCandidateId;
  if (fecId) finance = await fetchFecTotals(fecId);
  if (!finance && stateByCandidateId.has(candidate.id)) finance = normalizeStateRow(stateByCandidateId.get(candidate.id));
  if (!finance) {
    output.push(candidate);
    continue;
  }
  updated += 1;
  output.push({
    ...candidate,
    fundraising: finance,
    campaignFinanceUrl: finance.sourceUrl,
    updatedAt: timestamp,
    dataAsOf: finance.updatedAt,
    lastCheckedAt: timestamp,
    staleAfter: addDays(new Date(timestamp), 45).toISOString(),
    sources: deduplicateSources([
      ...(candidate.sources ?? []),
      {
        label: finance.sourceLabel,
        url: finance.sourceUrl,
        retrievedAt: finance.updatedAt,
      },
    ]),
  });
}

await writeFile(CANDIDATE_FILE, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Updated selective campaign-finance summaries for ${updated} candidate(s).`);

async function fetchFecTotals(fecId) {
  const url = new URL(`https://api.open.fec.gov/v1/candidate/${encodeURIComponent(fecId)}/totals/`);
  url.searchParams.set("api_key", FEC_API_KEY);
  url.searchParams.set("election_full", "true");
  url.searchParams.set("election_year", "2026");
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "KeepTXRed Election Central finance importer" },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const payload = await response.json();
    const record = [...(payload.results ?? [])].sort(
      (left, right) => String(right.coverage_end_date ?? "").localeCompare(String(left.coverage_end_date ?? "")),
    )[0];
    if (!record) return null;
    const publicUrl = `https://www.fec.gov/data/candidate/${encodeURIComponent(fecId)}/?election_full=true&cycle=2026`;
    return {
      totalRaised: numberOrNull(record.receipts ?? record.contributions),
      totalSpent: numberOrNull(record.disbursements),
      cashOnHand: numberOrNull(record.last_cash_on_hand_end_period ?? record.cash_on_hand_end_period),
      debtsOwed: numberOrNull(record.debts_owed_by_committee),
      reportingPeriodEnd: dateOnly(record.coverage_end_date),
      sourceUrl: publicUrl,
      updatedAt: timestamp,
      sourceLabel: "Federal Election Commission",
    };
  } catch (error) {
    console.warn(`OpenFEC import skipped for ${fecId}: ${error.message}`);
    return null;
  }
}

async function readStateRows() {
  try {
    const parsed = JSON.parse(await readFile(STATE_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : parsed.records ?? [];
  } catch (error) {
    console.warn(`Texas Ethics Commission finance import skipped: ${error.message}`);
    return [];
  }
}

function normalizeStateRow(row) {
  if (!row?.candidateId || !String(row.sourceUrl ?? "").startsWith("https://")) return null;
  return {
    totalRaised: numberOrNull(row.totalRaised),
    totalSpent: numberOrNull(row.totalSpent),
    cashOnHand: numberOrNull(row.cashOnHand),
    debtsOwed: numberOrNull(row.debt ?? row.debtsOwed),
    reportingPeriodEnd: dateOnly(row.reportingPeriodEnd),
    sourceUrl: row.sourceUrl,
    updatedAt: row.retrievedAt ?? timestamp,
    sourceLabel: row.sourceName ?? "Texas Ethics Commission",
  };
}

function numberOrNull(value) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : null;
}

function dateOnly(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function deduplicateSources(sources) {
  return [...new Map(sources.filter(Boolean).map((source) => [source.url, source])).values()];
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 86_400_000);
}
