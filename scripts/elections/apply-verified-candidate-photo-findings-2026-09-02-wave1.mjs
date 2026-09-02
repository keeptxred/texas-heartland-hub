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
    candidateId: "candidate-mike-miller-other-race-2026-governor",
    imageUrl: "https://i.imgur.com/6P84PtO.jpeg",
    sourceUrl: "https://mikemiller.netlify.app/",
    altText: "Mike Miller, American Solidarity Party write-in candidate for Texas Governor",
    credit: "Mike Miller for Texas Governor campaign",
    license: null,
    permissionBasis: "Mike Miller's official campaign website identifies him as the American Solidarity Party write-in candidate for Texas Governor, publishes this candidate-specific portrait with alt text identifying Mike Miller as the candidate, and states that Miller personally oversaw production of the campaign website. The same candidacy and candidate portrait are independently corroborated by the American Solidarity Party's official candidate profile. Used only for narrow editorial candidate identification with exact campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-09-02T18:45:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 2 wave 1.`);
