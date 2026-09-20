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
    candidateId: "candidate-brandon-gill-republican-race-2026-us-house-26",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Brandon_Gill%2C_official_portrait%2C_119th_Congress.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Brandon_Gill,_official_portrait,_119th_Congress.jpg",
    altText: "Official congressional portrait of U.S. Representative Brandon Gill of Texas",
    credit: "House Creative Services via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons file page identifies the image as Brandon Gill's official 119th Congress portrait, credits House Creative Services, and marks it as a public-domain U.S. Congress/federal-government work.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
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
console.log(`Applied ${applied} verified public-domain congressional portrait(s) from wave 4.`);
