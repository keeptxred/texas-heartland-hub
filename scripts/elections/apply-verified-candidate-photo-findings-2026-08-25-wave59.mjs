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
    candidateId: "candidate-helen-zhou-republican-race-2026-texas-house-137",
    imageUrl: "https://helenforstaterep.com/wp-content/uploads/elementor/thumbs/HelenZhouHeadshot_new-scaled-ri8heqpop4b3cte6rm9anrhfki8mlxn05phvos15vk.png",
    sourceUrl: "https://helenforstaterep.com/",
    altText: "Helen Zhou, Republican candidate for Texas House District 137",
    credit: "Helen Zhou Campaign",
    license: null,
    permissionBasis: "Candidate-identifying headshot published directly on Helen Zhou's official Texas House District 137 campaign homepage, which identifies her as the Republican candidate and carries the campaign's paid-political-advertising disclaimer. Used for editorial candidate identification with campaign attribution and an exact source link.",
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 59.`);
