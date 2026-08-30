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
    candidateId: "candidate-stephanie-guerrero-saenz-democratic-race-2026-texas-house-34",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/69ef82a23ef5e90e064855a0/d368380a-b174-4f69-b079-a110095d294a/DSC_5978%2B%282%29.jpg",
    sourceUrl: "https://www.stephanie4texas.com/",
    altText: "Stephanie Guerrero Sáenz, Democratic candidate for Texas House District 34",
    credit: "Stephanie Guerrero Sáenz for HD 34 campaign",
    license: null,
    permissionBasis: "Stephanie Guerrero Sáenz's official campaign homepage identifies her as the candidate for Texas House District 34 and publishes this candidate-specific photograph immediately before the Meet Stephanie biography section. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T20:42:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from August 30 wave 14.`);
