import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const [registry, candidates, races] = await Promise.all(
  ["political-authority-registry", "candidates", "races"].map(async (name) =>
    JSON.parse(await readFile(path.join(DATA_DIR, `${name}.json`), "utf8")),
  ),
);

const errors = [];
const verifiedCandidates = candidates.filter(
  (candidate) =>
    candidate.verificationStatus === "verified" &&
    candidate.publicationStatus === "published" &&
    candidate.source?.sourceType === "official",
);
const registryById = new Map(registry.candidates.map((candidate) => [candidate.id, candidate]));
const raceById = new Map(races.map((race) => [race.id, race]));

for (const candidate of verifiedCandidates) {
  const authority = registryById.get(candidate.id);
  if (!authority) {
    errors.push(`Missing verified candidate ${candidate.id}.`);
    continue;
  }
  if (authority.party !== candidate.party) {
    errors.push(`Party mismatch for ${candidate.id}.`);
  }
  for (const raceId of candidate.raceIds ?? []) {
    const race = raceById.get(raceId);
    const contest = authority.contests.find((record) => record.raceId === raceId);
    if (!race || !contest) {
      errors.push(`Missing race authority ${raceId} for ${candidate.id}.`);
      continue;
    }
    if (
      contest.office !== race.officeName ||
      contest.officeLevel !== race.officeLevel ||
      String(contest.districtNumber ?? "") !== String(race.districtNumber ?? "")
    ) {
      errors.push(`Office, level, or district mismatch for ${candidate.id} in ${raceId}.`);
    }
  }
}

if (registry.candidates.length !== verifiedCandidates.length) {
  errors.push(
    `Registry count ${registry.candidates.length} does not match ${verifiedCandidates.length} verified official candidates.`,
  );
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Political authority registry validation passed (${registry.candidates.length} candidates).`,
);
