import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const OUTPUT = path.join(DATA_DIR, "political-authority-registry.json");

const [candidates, races] = await Promise.all([
  readJson(path.join(DATA_DIR, "candidates.json")),
  readJson(path.join(DATA_DIR, "races.json")),
]);

const raceById = new Map(races.map((race) => [race.id, race]));
const compactCandidates = candidates
  .filter(
    (candidate) =>
      candidate.verificationStatus === "verified" &&
      candidate.publicationStatus === "published" &&
      candidate.source?.sourceType === "official",
  )
  .map((candidate) => ({
    id: candidate.id,
    aliases: aliasesFor(candidate),
    party: candidate.party,
    externalIds: Object.fromEntries(
      Object.entries(candidate.externalIds ?? {}).filter(([, value]) => Boolean(value)),
    ),
    contests: (candidate.raceIds ?? [])
      .map((raceId) => raceById.get(raceId))
      .filter(Boolean)
      .map((race) => ({
        raceId: race.id,
        electionYear: electionYear(race),
        office: race.officeName,
        officeLevel: race.officeLevel,
        districtId: race.districtId,
        districtName: race.districtName,
        districtNumber: race.districtNumber,
      })),
  }))
  .filter((candidate) => candidate.aliases.length > 0 && candidate.contests.length > 0)
  .sort((left, right) => left.id.localeCompare(right.id));

const registry = {
  generatedAt: new Date().toISOString(),
  authoritySources: [
    "Texas Secretary of State Qualified Candidate Listing",
    "Keep TX Red verified election race registry",
  ],
  candidates: compactCandidates,
};

await writeFile(OUTPUT, `${JSON.stringify(registry, null, 2)}\n`);
console.log(
  `Generated ${compactCandidates.length} verified political authority records at ${OUTPUT}.`,
);

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

function clean(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function aliasesFor(candidate) {
  const values = [
    candidate.fullName,
    candidate.ballotName,
    [candidate.firstName, candidate.middleName, candidate.lastName, candidate.suffix]
      .filter(Boolean)
      .join(" "),
    [candidate.preferredName, candidate.lastName].filter(Boolean).join(" "),
  ];
  return [...new Set(values.map(clean).filter((name) => name.split(/\s+/).length >= 2))];
}

function electionYear(race) {
  const values = [race.electionCycleId, race.id, race.slug, race.name];
  for (const value of values) {
    const match = String(value ?? "").match(/\b(20\d{2})\b/);
    if (match) return Number(match[1]);
  }
  throw new Error(`Race ${race.id} has no election year.`);
}
