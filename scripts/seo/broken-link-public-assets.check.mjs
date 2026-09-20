import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_ROOT = path.join(ROOT, 'public');

async function walkAllFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkAllFiles(full));
    else files.push(full);
  }
  return files;
}

const files = await walkAllFiles(PUBLIC_ROOT);
const publicAssetPaths = new Set(
  files.map((file) => `/${path.relative(PUBLIC_ROOT, file).replace(/\\/g, '/')}`),
);

assert.equal(publicAssetPaths.has('/images/elections/election-central-social.jpg'), true);
assert.equal(publicAssetPaths.has('/images/elections/definitely-missing.jpg'), false);
console.log('Broken-link public asset regression check passed.');
