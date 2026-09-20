#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const assetsPath = path.join(ROOT, "src/data/elections/2026/candidate-photo-assets.json");
const supremeCourtMediaPath = path.join(ROOT, "src/data/elections/2026/candidate-supreme-court-media.json");

const [manifest, assets, supremeCourtMedia] = await Promise.all([
  readJson(manifestPath),
  readJson(assetsPath),
  readJsonIfExists(supremeCourtMediaPath, { assets: [] }),
]);

const approvedAssets = [
  ...assets,
  ...(Array.isArray(supremeCourtMedia?.assets) ? supremeCourtMedia.assets : []),
];

const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
let applied = 0;

for (const asset of approvedAssets) {
  if (asset.usageStatus !== "approved") continue;
  if (!/^https:\/\//i.test(asset.imageUrl ?? "")) continue;
  if (!/^https:\/\//i.test(asset.sourceUrl ?? "")) continue;
  if (!asset.altText?.trim()) continue;
  if (!asset.license?.trim() && !asset.permissionBasis?.trim()) continue;
  if (byId.get(asset.candidateId)?.usageStatus === "approved") continue;

  byId.set(asset.candidateId, {
    candidateId: asset.candidateId,
    imageUrl: asset.imageUrl,
    sourceUrl: asset.sourceUrl,
    altText: asset.altText,
    credit: asset.credit ?? null,
    license: asset.license ?? null,
    permissionBasis: asset.permissionBasis ?? null,
    usageStatus: "approved",
    discoveredAt: new Date().toISOString(),
    discoveryMethod: `verified-asset:${asset.assetType ?? "unspecified"}`,
  });
  applied += 1;
}

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await writeFile(manifestPath, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`Merged ${applied} approved candidate photo asset(s) into the canonical manifest.`);

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readJsonIfExists(filePath, fallback) {
  try {
    return await readJson(filePath);
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}
