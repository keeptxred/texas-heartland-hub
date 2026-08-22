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
    candidateId: "candidate-katy-padilla-stout-democratic-race-2026-us-house-23",
    imageUrl: "https://www.katyforcongress.com/wp-content/uploads/2023/06/katy-picnic-website-3.png",
    sourceUrl: "https://www.katyforcongress.com/",
    altText: "Katy Padilla Stout, Democratic candidate for U.S. House Texas District 23",
    credit: "Katy Padilla Stout for Congress",
    license: null,
    permissionBasis: "Candidate image is directly hosted and displayed by the official 2026 Katy Padilla Stout for Congress campaign website and is used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage"
  },
  {
    candidateId: "candidate-brandon-herrera-republican-race-2026-us-house-23",
    imageUrl: "https://brandonherreraforcongress.com/wp-content/uploads/video-4-screenshot.png",
    sourceUrl: "https://brandonherreraforcongress.com/",
    altText: "Brandon Herrera, Republican candidate for U.S. House Texas District 23, speaking at a campaign event",
    credit: "Brandon Herrera for Congress",
    license: null,
    permissionBasis: "Campaign-event image is directly hosted and displayed by the official current Brandon Herrera for Congress website and is used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 11.`);
