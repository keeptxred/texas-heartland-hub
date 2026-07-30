import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { federalOfficeForRace, resolveFecCandidateId } from "./fec-candidate-resolver.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FILE = path.join(ROOT, "src/data/elections/2026/candidates.json");
const candidates = JSON.parse(await readFile(FILE, "utf8"));
let resolved = 0;

const output = [];
for (const candidate of candidates) {
  const existing = candidate.externalIds?.fecCandidateId;
  const office = federalOfficeForRace(candidate.primaryRaceId);
  if (existing || !office) {
    output.push(candidate);
    continue;
  }

  const candidateId = await resolveFecCandidateId(candidate.fullName, office);
  if (!candidateId) {
    console.warn(`No unambiguous FEC identifier found for ${candidate.fullName}.`);
    output.push(candidate);
    continue;
  }

  resolved += 1;
  output.push({
    ...candidate,
    externalIds: {
      ...candidate.externalIds,
      fecCandidateId: candidateId,
    },
  });
}

await writeFile(FILE, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Resolved ${resolved} federal candidate FEC identifier(s).`);
