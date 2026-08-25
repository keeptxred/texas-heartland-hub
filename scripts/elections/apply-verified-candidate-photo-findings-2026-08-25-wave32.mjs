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
    candidateId: "candidate-jordan-scott-hoffnagle-republican-race-2026-texas-house-100",
    imageUrl: "https://dallasgop.org/wp-content/uploads/2026/06/Jordan-Hoffnagle.jpg",
    sourceUrl: "https://dallasgop.org/meet-the-candidates/",
    altText: "Jordan Hoffnagle, Republican candidate for Texas House District 100",
    credit: "Dallas County Republican Party candidate directory",
    license: null,
    permissionBasis: "Candidate-identifying portrait published by the Dallas County Republican Party on its current 2026 Meet the Candidates page, where Jordan Hoffnagle is identified as the Republican candidate for Texas House District 100 and linked to his campaign website. Used only for editorial candidate identification with exact source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-county-party-candidate-directory"
  },
  {
    candidateId: "candidate-melanie-medley-thomas-republican-race-2026-texas-house-103",
    imageUrl: "https://dallasgop.org/wp-content/uploads/2026/07/Melanie-Medley-Thomas-for-HD-103-843x1024.webp",
    sourceUrl: "https://dallasgop.org/meet-the-candidates/",
    altText: "Melanie Medley-Thomas, Republican candidate for Texas House District 103",
    credit: "Dallas County Republican Party candidate directory",
    license: null,
    permissionBasis: "Candidate-identifying portrait published by the Dallas County Republican Party on its current 2026 Meet the Candidates page, where Melanie Medley-Thomas is identified as the Republican candidate for Texas House District 103 and linked to melanie4texas.com. Used only for editorial candidate identification with exact source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-county-party-candidate-directory"
  },
  {
    candidateId: "candidate-tim-mcdonough-republican-race-2026-texas-house-114",
    imageUrl: "https://dallasgop.org/wp-content/uploads/2026/04/Tim-McDonough-for-HD-114-844x1024.jpg",
    sourceUrl: "https://dallasgop.org/meet-the-candidates/",
    altText: "Tim McDonough, Republican candidate for Texas House District 114",
    credit: "Dallas County Republican Party candidate directory",
    license: null,
    permissionBasis: "Candidate-identifying portrait published by the Dallas County Republican Party on its current 2026 Meet the Candidates page, where Tim McDonough is identified as the Republican candidate for Texas House District 114 and linked to timforhouse.com. Used only for editorial candidate identification with exact source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-county-party-candidate-directory"
  },
  {
    candidateId: "candidate-danny-rosellini-republican-race-2026-texas-house-115",
    imageUrl: "https://dallasgop.org/wp-content/uploads/2026/04/Danny-Rosellini-for-HD-115-1024x1024.jpg",
    sourceUrl: "https://dallasgop.org/meet-the-candidates/",
    altText: "Danny Rosellini, Republican candidate for Texas House District 115",
    credit: "Dallas County Republican Party candidate directory",
    license: null,
    permissionBasis: "Candidate-identifying portrait published by the Dallas County Republican Party on its current 2026 Meet the Candidates page, where Danny Rosellini is identified as the Republican candidate for Texas House District 115 and linked to rosellinifortx.com. Used only for editorial candidate identification with exact source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-county-party-candidate-directory"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 32.`);
