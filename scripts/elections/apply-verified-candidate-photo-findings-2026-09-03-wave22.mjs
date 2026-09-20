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
    candidateId: "candidate-tennyson-g-moreno-republican-race-2026-texas-house-45",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/64cb140d6b0cc07452e1c354/631aa5be-14a7-4d3a-a346-ec5a9065a286/image2.jpeg",
    sourceUrl: "https://www.tennysonmoreno.com/",
    altText: "Tennyson G. Moreno, Republican candidate for Texas House District 45",
    credit: "Tennyson Moreno Campaign",
    license: null,
    permissionBasis: "Tennyson Moreno's official campaign homepage identifies him as running for Texas House District 45 and directly publishes this candidate-specific photograph in the Meet Tennyson Moreno biography section. The campaign footer states the site is paid for by the Tennyson Moreno Campaign, and TCTA independently links tennysonmoreno.com as his District 45 campaign website. Used only for editorial candidate identification with exact official-campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-09-03T10:55:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 3 wave 22.`);
