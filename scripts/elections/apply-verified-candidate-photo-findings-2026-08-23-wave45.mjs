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
    candidateId: "candidate-andie-ho-democratic-race-2026-texas-house-12",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6972769d4f6b7575c547e702/d9e2bf72-f81e-4afd-9538-c04390b08d67/T_DSC9554-Edit%2Bcopy.png",
    sourceUrl: "https://www.andiefortexas.com/",
    altText: "Andie Ho, Democratic candidate for Texas House District 12",
    credit: "Andie Ho campaign",
    license: null,
    permissionBasis: "Candidate portrait published directly on the official campaign website and used for editorial candidate identification with source attribution.",
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 45.`);
