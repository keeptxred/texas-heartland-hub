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
    candidateId: "candidate-samantha-lopez-resendez-democratic-race-2026-texas-house-50",
    imageUrl: "https://samanthafortexas.com/hero-image.jpeg",
    sourceUrl: "https://samanthafortexas.com/",
    altText: "Samantha Lopez-Resendez, Democratic candidate for Texas House District 50",
    credit: "Samantha Lopez-Resendez for Texas campaign",
    license: null,
    permissionBasis: "Samantha Lopez-Resendez's official campaign website identifies her as running for Texas House District 50, is paid for by Samantha Lopez-Resendez For Texas, and publishes this candidate-specific portrait in the campaign's Meet Samantha biography area with an image link labeled 'Samantha for Texas'. Used only for narrow editorial candidate identification with exact campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-09-05T13:49:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 5 wave 1.`);
