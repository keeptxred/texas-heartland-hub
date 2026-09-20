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
    candidateId: "candidate-brad-bailey-republican-race-2026-texas-house-15",
    imageUrl: "https://bradbaileycampaign.com/wp-content/themes/bailey-tx/assets/images/1_hero_fg.png",
    sourceUrl: "https://bradbaileycampaign.com/",
    altText: "Brad Bailey, Republican candidate for Texas House District 15",
    credit: "Brad Bailey Campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published directly on Brad Bailey's official Texas House District 15 campaign homepage, which identifies Bailey as running for the Texas House and carries the campaign's paid-political-advertising disclaimer. Used only for editorial candidate identification with exact campaign attribution and source provenance.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage"
  },
  {
    candidateId: "candidate-bobbie-clayton-democratic-race-2026-texas-house-16",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/69a1fd111d1839115d3a41fb/4c096925-ef4a-4068-b91f-c81c60fc0fd3/IMG_7222.jpg",
    sourceUrl: "https://www.bobbieclaytonforhd16.com/",
    altText: "Bobbie Clayton, Democratic candidate for Texas House District 16",
    credit: "Bobbie Clayton for HD 16 campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published on Bobbie Clayton's official Texas House District 16 campaign website adjacent to the campaign's candidate biography. Used only for editorial candidate identification with exact campaign attribution and source provenance.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 63.`);
