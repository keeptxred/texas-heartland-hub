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
    candidateId: "candidate-jennifer-mushtaler-republican-race-2026-texas-house-47",
    imageUrl: "https://static.wixstatic.com/media/7fd3aa_42a89a6d337f448c861b5586626363ff~mv2.png/v1/fill/w_1272,h_604,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Profile.png",
    sourceUrl: "https://www.drjenfortexas.com/",
    altText: "Jennifer Mushtaler, Republican candidate for Texas House District 47",
    credit: "Jennifer Mushtaler campaign / Dr. Jen for Texas",
    license: null,
    permissionBasis: "Jennifer Mushtaler's official campaign homepage identifies her as the Texas House District 47 candidate and publishes this candidate-specific image in the campaign hero with the alt text 'Dr Jennifer'. The image is used only for editorial candidate identification with exact official-campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-09-02T23:34:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 2 wave 1834.`);
