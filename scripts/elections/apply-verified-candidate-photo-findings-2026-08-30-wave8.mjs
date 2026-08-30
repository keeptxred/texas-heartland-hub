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
    candidateId: "candidate-cullin-knutson-democratic-race-2026-texas-house-86",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/691b38500ad6874b244eddef/dc4e5c03-b06b-4e41-a680-ebfba0823868/_1064628.jpg",
    sourceUrl: "https://www.cullinfortexas.com/",
    altText: "Cullin Knutson, Democratic candidate for Texas House District 86",
    credit: "Cullin for Texas campaign",
    license: null,
    permissionBasis: "Cullin Knutson's official campaign homepage identifies him as running to represent Texas House District 86 and publishes this candidate-specific portrait at the top of the page with descriptive alt text identifying the pictured candidate. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:30:00.000Z"
  },
  {
    candidateId: "candidate-cecilia-castellano-democratic-race-2026-texas-house-80",
    imageUrl: "https://cecilia4texas.com/wp-content/uploads/2023/08/Cecilia-Castellano-6.jpg",
    sourceUrl: "https://cecilia4texas.com/",
    altText: "Cecilia Castellano, Democratic candidate for Texas House District 80",
    credit: "Cecilia Castellano for Texas House District 80 campaign",
    license: null,
    permissionBasis: "Cecilia Castellano's official campaign homepage identifies her as a Democratic candidate for Texas House District 80 and publishes this candidate-specific portrait in its campaign imagery. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:30:00.000Z"
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
console.log(`Applied ${applied} verified candidate portraits from August 30 wave 8.`);
