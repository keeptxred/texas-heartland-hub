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
    candidateId: "candidate-matthias-jonah-early-democratic-race-2026-texas-house-20",
    imageUrl: "https://img1.wsimg.com/blobby/go/33d1332d-5bef-40eb-9710-f3a767473910/downloads/4b4a45a0-4615-49e4-821d-6e5c9f0f3e09/Copy%20of%20Georgetown%20Square-24.jpg?ver=1774800228137",
    sourceUrl: "https://votematthiasearly.com/press",
    altText: "Matthias Early, Democratic nominee for Texas House District 20",
    credit: "Matthias Early campaign",
    license: null,
    permissionBasis: "The official Matthias Early campaign press page labels this file as a downloadable Headshot (Portrait) inside a Press Kit of downloadable assets for media and press. Used for editorial candidate identification with exact campaign attribution and source provenance.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-press-kit"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 80.`);
