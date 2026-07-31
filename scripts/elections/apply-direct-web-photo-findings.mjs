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
    candidateId: "candidate-clayton-tucker-democratic-race-2026-agriculture-commissioner",
    imageUrl: "https://cdn.hihello.me/v/22317c2f-7102-437d-b5a8-18a472c39b85.png-small-preserve-ratio",
    sourceUrl: "https://hihello.com/hi/claytontuckertx",
    altText: "Clayton Tucker, Democratic candidate for Texas Agriculture Commissioner",
    credit: "Clayton Tucker campaign",
    license: null,
    permissionBasis: "Candidate campaign portrait published on the campaign's public digital business card, used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "direct-public-web-search"
  },
  {
    candidateId: "candidate-alfred-molison-jr-green-race-2026-agriculture-commissioner",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1784299947/alfred.jpg?1784299947=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Alfred Molison Jr., Green Party candidate for Texas Agriculture Commissioner",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official party candidate-slate portrait used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "direct-public-web-search"
  },
  {
    candidateId: "candidate-nate-sheets-republican-race-2026-agriculture-commissioner",
    imageUrl: "https://www.texastribune.org/wp-content/uploads/2026/01/AgCo-Nate-Sheets-Campaign.jpg",
    sourceUrl: "https://www.texastribune.org/2026/01/27/texas-agriculture-commissioner-primary/",
    altText: "Nate Sheets, Republican candidate for Texas Agriculture Commissioner",
    credit: "Nate Sheets campaign via The Texas Tribune",
    license: null,
    permissionBasis: "Campaign-supplied candidate portrait published by The Texas Tribune, used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "direct-public-web-search"
  },
  {
    candidateId: "candidate-shehla-faizi-green-race-2026-comptroller",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6940b3b801659d28f153ab75/7f56185a-2012-4392-86ed-61f1c118f5fc/MomentsbyManar.Headshot-Shehla-2026-08.jpg",
    sourceUrl: "https://www.faizifortexas.com/",
    altText: "Shehla Faizi, Green Party candidate for Texas Comptroller",
    credit: "Shehla Faizi campaign / Moments by Manar",
    license: null,
    permissionBasis: "Candidate headshot published on the official campaign website, used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "direct-public-web-search"
  }
];

for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, { ...finding, discoveredAt: new Date().toISOString() });
}

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await writeFile(manifestPath, JSON.stringify(merged, null, 2) + "\n");
console.log(`Applied ${findings.length} direct web photo findings.`);
