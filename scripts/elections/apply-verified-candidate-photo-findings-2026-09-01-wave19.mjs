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
    candidateId: "candidate-julio-salinas-democratic-race-2026-texas-house-41",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68deb6f10abc8463a124e6c3/cfd458ec-28bf-422b-a3de-92cc9745938b/IMG_0059.jpg",
    sourceUrl: "https://www.julioforrgv.com/meetjulio",
    altText: "Julio Salinas, Democratic candidate for Texas House District 41, at the Texas State Capitol",
    credit: "Julio Salinas for Texas House District 41 campaign",
    license: null,
    permissionBasis: "Julio Salinas's official campaign biography identifies him as running for Texas House District 41 and directly publishes this candidate-specific photograph on the same campaign-controlled page with an item-level description identifying Salinas at the Texas State Capitol. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-09-01T13:48:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 1 wave 19.`);
