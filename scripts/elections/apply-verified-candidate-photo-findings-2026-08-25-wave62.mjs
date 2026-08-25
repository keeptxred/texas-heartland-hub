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
    candidateId: "candidate-adrian-reyna-democratic-race-2026-texas-house-125",
    imageUrl: "https://npr.brightspotcdn.com/dims4/default/813a4a6/2147483647/strip/true/crop/806x461%2B0%2B0/resize/880x503%21/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Ffa%2F25%2F4248ee78495ababba5d9058fe62c%2Fimg-0685.jpeg",
    sourceUrl: "https://www.tpr.org/government-politics/2026-05-26/saisd-teacher-labor-activist-adrian-reyna-holds-commanding-early-lead-in-democratic-runoff-for-texas-house-district-125",
    altText: "Adrian Reyna, Democratic candidate for Texas House District 125",
    credit: "Reyna campaign, via Texas Public Radio",
    license: null,
    permissionBasis: "Texas Public Radio explicitly credits this candidate-identifying photograph to the Reyna campaign on its May 26, 2026 article identifying Adrian Reyna as the Democratic nominee for Texas House District 125. Used only for editorial candidate identification with campaign/newsroom attribution and an exact source link.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-photo"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 62.`);
