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
    candidateId: "candidate-roxanne-lathan-democratic-race-2026-texas-house-11",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68e58c8b8b6d880c64714bab/fd075cc0-3512-430d-8914-50b85be252fd/RoxanneforHD11backyardtrees.jpg",
    sourceUrl: "https://www.roxanne4texans.com/",
    altText: "Roxanne Lathan, Democratic candidate for Texas House District 11",
    credit: "Roxanne for HD 11 campaign",
    license: null,
    permissionBasis: "Candidate portrait published on the official campaign website and used for editorial candidate identification with source attribution.",
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 42.`);
