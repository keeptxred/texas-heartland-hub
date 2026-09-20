#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));

const findings = [
  {
    candidateId: "candidate-margo-jordan-other-race-2026-state-board-of-education-6",
    imageUrl: "https://assets.cdn.filesafe.space/81LxH6WyydB93Iyr90JD/media/6627d738c2107c6f48dd5fc8.jpeg",
    sourceUrl: "https://margojordan.com/about",
    altText: "Margo Jordan, 2026 Texas State Board of Education District 6 candidate",
    credit: "Margo Jordan official biography",
    license: null,
    permissionBasis: "Margo Jordan's candidate-controlled official biography publishes this candidate-specific portrait in the 'Meet Margo Jordan' section. Her current campaign site, MargoForTexas.com, identifies the same Margo Jordan as a 2026 Texas State Board of Education candidate, and an August 3, 2026 candidate interview links MargoForTexas.com and her personal biography to the same person. Used only for editorial candidate identification with exact candidate-controlled source attribution and source link; no broader reuse right is asserted.",
    usageStatus: "approved",
    discoveryMethod: "candidate-controlled-official-biography",
    discoveredAt: "2026-08-30T20:49:00.000Z"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, finding);
  applied += 1;
}

await writeFile(
  manifestPath,
  JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
);
console.log(`Applied ${applied} verified candidate portrait from August 30 wave 15.`);
