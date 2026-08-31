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
    candidateId: "candidate-janie-lopez-republican-race-2026-texas-house-37",
    imageUrl: "https://www.texaspolicy.com/wp-content/uploads/2023/04/Janie-Lopez.jpg",
    sourceUrl: "https://www.texaspolicy.com/about/people/the-honorable-janie-lopez",
    altText: "Janie Lopez, Republican candidate for Texas House District 37",
    credit: "Texas Public Policy Foundation / Janie Lopez headshot",
    license: null,
    permissionBasis: "Texas Public Policy Foundation's Janie Lopez profile identifies her as the Texas House District 37 representative and explicitly provides this candidate-specific image through a 'Download Headshot' link. Used narrowly for editorial candidate identification with exact source attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "institutional-profile-download-headshot",
    discoveredAt: "2026-08-30T23:39:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from August 30 wave 17.`);
