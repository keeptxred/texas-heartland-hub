#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const AUTHORITY_PATH = path.join(ROOT, "src/data/elections/2026/candidate-filing-status-authority.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-eligibility-reconciliation.json");

const [candidates, authority] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(AUTHORITY_PATH),
]);

const validFilingStatuses = new Set(["filed", "pending_review", "accepted", "rejected", "withdrawn", "challenged"]);
const validBallotAccessStatuses = new Set(["pending", "qualified", "challenged", "removed", "write_in_only", "unknown"]);
const matched = [];
const unmatched = [];
const ambiguous = [];
let changed = 0;

for (const entry of authority.entries ?? []) {
  if (!validFilingStatuses.has(entry.filingStatus)) {
    throw new Error(`Unsupported filingStatus in authority registry: ${entry.filingStatus}`);
  }
  if (entry.ballotAccessStatus && !validBallotAccessStatuses.has(entry.ballotAccessStatus)) {
    throw new Error(`Unsupported ballotAccessStatus in authority registry: ${entry.ballotAccessStatus}`);
  }

  const matches = candidates.filter((candidate) =>
    candidate.primaryRaceId === entry.raceId && normalize(candidate.fullName) === normalize(entry.fullName)
  );

  if (matches.length === 0) {
    unmatched.push({ ...entry, issue: "No canonical candidate matched exact normalized name and race." });
    continue;
  }
  if (matches.length > 1) {
    ambiguous.push({ ...entry, candidateIds: matches.map((candidate) => candidate.id) });
    continue;
  }

  const candidate = matches[0];
  const before = {
    filingStatus: candidate.filingStatus ?? null,
    ballotAccessStatus: candidate.ballotAccessStatus ?? null,
  };
  if (candidate.filingStatus !== entry.filingStatus) {
    candidate.filingStatus = entry.filingStatus;
    changed += 1;
  }
  if (entry.ballotAccessStatus && candidate.ballotAccessStatus !== entry.ballotAccessStatus) {
    candidate.ballotAccessStatus = entry.ballotAccessStatus;
    changed += 1;
  }
  matched.push({
    candidateId: candidate.id,
    fullName: candidate.fullName,
    raceId: candidate.primaryRaceId,
    before,
    after: {
      filingStatus: candidate.filingStatus ?? null,
      ballotAccessStatus: candidate.ballotAccessStatus ?? null,
    },
  });
}

await writeFile(CANDIDATES_PATH, `${JSON.stringify(candidates, null, 2)}\n`);
await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  sourceName: authority.sourceName,
  sourceUrl: authority.sourceUrl,
  sourceRetrievedAt: authority.retrievedAt,
  authorityEntryCount: authority.entries?.length ?? 0,
  matchedCount: matched.length,
  unmatchedCount: unmatched.length,
  ambiguousCount: ambiguous.length,
  changedFieldCount: changed,
  matched,
  unmatched,
  ambiguous,
}, null, 2)}\n`);

if (ambiguous.length) {
  console.error(`Candidate filing-status reconciliation found ${ambiguous.length} ambiguous match(es).`);
  process.exitCode = 1;
} else {
  console.log(`Candidate filing-status reconciliation matched ${matched.length} authoritative record(s); ${unmatched.length} were not present in the canonical dataset.`);
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}
