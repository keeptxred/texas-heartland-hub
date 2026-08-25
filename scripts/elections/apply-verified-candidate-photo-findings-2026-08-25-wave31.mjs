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
    candidateId: "candidate-jenn-mack-other-race-2026-governor",
    imageUrl: "https://taketexasback.com/wp-content/uploads/2025/10/Jen5-e1760106621892.jpg",
    sourceUrl: "https://taketexasback.com/pledged-candidates/jenn-mack-raphoon",
    altText: "Jenn Mack Raphoon, Independent candidate for Governor of Texas in 2026",
    credit: "Jenn Mack Raphoon / Texas First Pledge",
    license: null,
    permissionBasis: "Candidate-identifying portrait published on Jenn Mack Raphoon's signed Texas First Pledge candidate profile and used for editorial candidate identification with exact source attribution; the profile links her official campaign website and identifies her as the 2026 Independent candidate for Governor of Texas.",
    usageStatus: "approved",
    discoveryMethod: "candidate-linked-pledge-profile"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 31.`);
