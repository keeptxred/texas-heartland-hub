#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));

const finding = {
  candidateId: "candidate-mark-teixeira-republican-race-2026-us-house-21",
  imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mark_Teixeira_allison_portrait_8_31_09.jpg",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Mark_Teixeira_allison_portrait_8_31_09.jpg",
  altText: "Portrait of Mark Teixeira",
  credit: "Keith Allison via Wikimedia Commons",
  license: "CC BY-SA 2.0",
  permissionBasis: "Wikimedia Commons identifies the subject as Mark Teixeira and records that the Flickr-sourced portrait was confirmed under the Creative Commons Attribution-ShareAlike 2.0 Generic license.",
  usageStatus: "approved",
  discoveryMethod: "wikimedia-verified-cc-by-sa-candidate-photo"
};

if (byId.get(finding.candidateId)?.usageStatus !== "approved") {
  byId.set(finding.candidateId, { ...finding, discoveredAt: new Date().toISOString() });
  await writeFile(
    manifestPath,
    JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
  );
  console.log("Applied verified CC BY-SA Mark Teixeira portrait.");
} else {
  console.log("Mark Teixeira already has an approved portrait.");
}
