import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");

const raceFile = path.join(DATA_DIR, "races.json");
const candidateFile = path.join(DATA_DIR, "candidates.json");
const [races, candidates] = await Promise.all([readJson(raceFile), readJson(candidateFile)]);

let changed = 0;

const normalizedRaces = races.map((race) => {
  const next = { ...race };
  if (next.status === "general") {
    next.status = "scheduled";
    changed += 1;
  }
  return next;
});

const normalizedCandidates = candidates.map((candidate) => {
  const next = {
    ...candidate,
    source: candidate.source ? { ...candidate.source } : candidate.source,
  };

  if (["official_election_results", "official_candidate_listing"].includes(next.source?.sourceType)) {
    next.source.sourceType = "official";
    changed += 1;
  }
  if (next.profileDepth === "basic") {
    next.profileDepth = "standard";
    changed += 1;
  }
  return next;
});

await Promise.all([
  writeFile(raceFile, `${JSON.stringify(normalizedRaces, null, 2)}\n`),
  writeFile(candidateFile, `${JSON.stringify(normalizedCandidates, null, 2)}\n`),
]);

console.log(`Normalized election import output (${changed} correction${changed === 1 ? "" : "s"}).`);

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}
