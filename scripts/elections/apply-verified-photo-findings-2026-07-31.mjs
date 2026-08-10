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
    candidateId: "candidate-thomas-smith-republican-race-2026-court-of-criminal-appeals-place-3",
    imageUrl: "https://www.smithfortexas.org/UserFiles/image/Thomas_Smith_Family.webp",
    sourceUrl: "https://www.smithfortexas.org/about.html",
    altText: "Thomas Smith, Republican candidate for Texas Court of Criminal Appeals Place 3",
    credit: "Thomas Smith campaign",
    license: null,
    permissionBasis: "Candidate portrait published on the official campaign website, used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
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
  },
  {
    candidateId: "candidate-holly-taylor-democratic-race-2026-court-of-criminal-appeals-place-9",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/656b914f3b6db119ed7e75b7/c622c5d3-0c53-4db8-8c9c-ce60c4d90eaf/HT_head-shot-2026.2400x3360.png?content-type=image%2Fpng",
    sourceUrl: "https://www.hollytforjudge.com/downloads",
    altText: "Holly Taylor, Democratic candidate for Texas Court of Criminal Appeals Place 9",
    credit: "Holly Taylor campaign",
    license: null,
    permissionBasis: "Official campaign downloadable headshot; the campaign page expressly permits personal and small-group printing. Used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-downloadable-asset"
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
console.log(`Applied ${applied} verified candidate portraits.`);
