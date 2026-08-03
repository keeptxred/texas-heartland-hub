#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));
const batchesDir = resolve(String(args.batches || ''));
const endpoint = String(args.endpoint || '').trim();
const secretFile = resolve(String(args['secret-file'] || ''));
const mode = args.live ? 'live' : 'dry-run';
const limit = Number(args.limit || 0);
if (!String(args.batches || '').trim()) throw new Error('--batches is required.');
if (!endpoint.startsWith('https://')) throw new Error('--endpoint must be an HTTPS URL.');
if (!String(args['secret-file'] || '').trim()) throw new Error('--secret-file is required.');

const secret = (await readFile(secretFile, 'utf8')).trim();
if (secret.length < 32) throw new Error('Import secret must contain at least 32 characters.');
const manifest = JSON.parse(await readFile(resolve(batchesDir, 'manifest.json'), 'utf8'));
const checkpointPath = resolve(batchesDir, mode === 'live' ? 'checkpoint.json' : 'checkpoint.dry-run.json');
let checkpoint;
try { checkpoint = JSON.parse(await readFile(checkpointPath, 'utf8')); }
catch { checkpoint = { schema_version: 1, session: manifest.session, next_batch_index: 0, completed_batches: [], totals: { imported: 0, updated: 0, skipped: 0, missing_bill: 0, errors: 0, reports: 0 } }; }
const totals = checkpoint.totals;
let processed = 0;

async function save() {
  const temporary = `${checkpointPath}.tmp`;
  await writeFile(temporary, `${JSON.stringify(checkpoint, null, 2)}\n`, 'utf8');
  await rename(temporary, checkpointPath);
}

for (let index = Number(checkpoint.next_batch_index || 0); index < manifest.batches.length; index++) {
  if (limit && processed >= limit) break;
  const descriptor = manifest.batches[index];
  const raw = await readFile(resolve(batchesDir, descriptor.filename), 'utf8');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== descriptor.sha256) throw new Error(`Checksum mismatch for ${descriptor.filename}.`);
  const payload = JSON.parse(raw);
  payload.mode = mode;
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-import-secret': secret }, body: JSON.stringify(payload) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${descriptor.filename}: ${response.status} ${JSON.stringify(result)}`);
  const counts = result.counts || {};
  for (const key of ['imported', 'updated', 'skipped', 'missing_bill', 'errors', 'reports']) totals[key] = Number(totals[key] || 0) + Number(counts[key] || 0);
  checkpoint.next_batch_index = index + 1;
  checkpoint.completed_batches.push({ index, filename: descriptor.filename, completed_at: new Date().toISOString(), counts });
  checkpoint.updated_at = new Date().toISOString();
  await save();
  processed++;
  console.log(JSON.stringify({ batch: index, filename: descriptor.filename, mode, counts, totals }));
  if (Number(counts.errors || 0) || Number(counts.missing_bill || 0)) throw new Error(`${descriptor.filename} returned errors or missing bills; checkpoint preserved.`);
}

console.log(JSON.stringify({ mode, processed_batches: processed, next_batch_index: checkpoint.next_batch_index, complete: checkpoint.next_batch_index >= manifest.batches.length, totals }, null, 2));
