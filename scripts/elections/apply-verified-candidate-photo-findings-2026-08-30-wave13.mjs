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
    candidateId: "candidate-kristen-plaisance-republican-race-2026-texas-house-3",
    imageUrl: "https://kristenplaisance.com/wp-content/uploads/2025/11/KMT_5238-5-X-7-scaled.jpg",
    sourceUrl: "https://kristenplaisance.com/about-kristen-plaisance/",
    altText: "Kristen Plaisance, Republican candidate for Texas House District 3",
    credit: "Kristen Plaisance Campaign",
    license: null,
    permissionBasis: "Kristen Plaisance's official campaign biography identifies her as running for Texas House District 3 and publishes this candidate-specific image with the page description 'Portrait of Kristen Plaisance'. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T20:25:00.000Z"
  },
  {
    candidateId: "candidate-max-alalibo-republican-race-2026-texas-house-27",
    imageUrl: "https://maxwellalalibo71us.com/wp-content/uploads/2026/04/Max1-1.png",
    sourceUrl: "https://maxwellalalibo71us.com/",
    altText: "Max Alalibo, Republican candidate for Texas House District 27",
    credit: "Max-Alalibo for Texas House District 27 campaign",
    license: null,
    permissionBasis: "Max Alalibo's official campaign homepage identifies him as a candidate for Texas House District 27 and publishes the candidate-specific image 'Max1 (1)' in the campaign's Meet Max section. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T20:25:00.000Z"
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
console.log(`Applied ${applied} verified candidate portraits from August 30 wave 13.`);
