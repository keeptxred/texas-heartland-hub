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
    candidateId: "candidate-okey-anyiam-democratic-race-2026-court-of-criminal-appeals-place-3",
    imageUrl: "https://www.texastribune.org/wp-content/uploads/2026/02/CCA-Okey-Anyiam-Campaign-1.jpg",
    sourceUrl: "https://www.texastribune.org/2026/02/12/texas-court-of-criminal-appeals-primary-2026/",
    altText: "Okey Anyiam, Democratic candidate for Texas Court of Criminal Appeals Place 3",
    credit: "Okey Anyiam campaign via The Texas Tribune",
    license: null,
    permissionBasis: "Campaign-supplied candidate portrait published in The Texas Tribune candidate guide, used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "verified-candidate-guide"
  },
  {
    candidateId: "candidate-bo-french-republican-race-2026-railroad-commissioner",
    imageUrl: "https://bofrench.com/wp-content/uploads/2025/11/BoFrench06.jpg",
    sourceUrl: "https://bofrench.com/about/",
    altText: "Bo French, Republican candidate for Texas Railroad Commissioner",
    credit: "Bo French campaign",
    license: null,
    permissionBasis: "Candidate portrait published on the official campaign website, used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, { ...finding, discoveredAt: new Date().toISOString() });
  applied += 1;
}

await writeFile(
  manifestPath,
  JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
);
console.log(`Applied ${applied} automation-verified photo findings.`);
