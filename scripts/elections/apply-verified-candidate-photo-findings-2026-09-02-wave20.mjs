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
    candidateId: "candidate-teresa-johnson-hernandez-republican-race-2026-texas-house-42",
    imageUrl: "https://teresafortexas.com/wp-content/uploads/2025/07/teresa-real-image.jpg",
    sourceUrl: "https://teresafortexas.com/",
    altText: "Teresa Johnson-Hernandez, Republican candidate for Texas House District 42",
    credit: "Dr. Teresa Johnson-Hernandez for Texas State Representative campaign",
    license: null,
    permissionBasis: "Dr. Teresa Johnson-Hernandez's official campaign homepage identifies her as the candidate for Texas House District 42 and directly publishes this candidate-specific photograph from the campaign-controlled teresafortexas.com domain alongside the campaign biography and candidacy context. Used only for editorial candidate identification with exact official-campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-09-02T11:37:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 2 wave 20.`);
