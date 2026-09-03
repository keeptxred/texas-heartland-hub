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
    candidateId: "candidate-michelle-palmer-democratic-race-2026-state-board-of-education-6",
    imageUrl: "https://outsmartmag.s3.us-east-2.amazonaws.com/wp-content/uploads/2020/09/19151141/high-res-headshot-red-1024x683.jpg",
    sourceUrl: "https://www.outsmartmagazine.com/2020/09/michelle-palmer-advocates-for-texas-students/",
    altText: "Michelle Palmer, Democratic candidate for Texas State Board of Education District 6",
    credit: "Michelle Palmer courtesy photo via OutSmart Magazine",
    license: null,
    permissionBasis: "OutSmart Magazine's September 14, 2020 candidate profile explicitly identifies Michelle Palmer as a Texas State Board of Education District 6 candidate and captions this exact candidate-specific headshot as 'Michelle Palmer (courtesy photo)'. ATPE's current 2026 candidate profile independently identifies Palmer as the Democratic challenger for State Board of Education District 6 and links her current campaign website. Used only for editorial candidate identification with exact source attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "reputable-news-candidate-courtesy-photo",
    discoveredAt: "2026-09-03T12:47:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 3 wave 24.`);
