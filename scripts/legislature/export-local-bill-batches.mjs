#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, relative, resolve, sep } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => { const [key, ...value] = arg.replace(/^--/, '').split('='); return [key, value.join('=') || true]; }));
const root = resolve(String(args.root || ''));
const output = resolve(String(args.output || 'artifacts/legislative-bill-batches'));
const session = String(args.session || '89R').toUpperCase();
const batchSize = Number(args['batch-size'] || 100);
if (!String(args.root || '').trim()) throw new Error('--root is required.');
if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 100) throw new Error('--batch-size must be between 1 and 100.');
await access(root);
const normalize = (value) => value.split(sep).join('/');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const decode = (value = '') => value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const value = (xml, names) => names.flatMap((name) => [...xml.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'gi'))].map((match) => decode(match[1].replace(/<[^>]+>/g, ' ')))).filter(Boolean)[0] || null;
const isoDate = (text) => { if (!text) return null; const date = new Date(text); return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10); };
function identity(filename) {
  const match = filename.match(/^(HB|SB|HJR|SJR|HCR|SCR|HR|SR|HJ|SJ|HC|SC)\s*0*(\d+)\.xml$/i);
  if (!match) return null;
  const aliases = { HJ: 'HJR', SJ: 'SJR', HC: 'HCR', SC: 'SCR' };
  const raw = match[1].toUpperCase();
  return { bill_type: (aliases[raw] || raw).toLowerCase(), bill_number: Number(match[2]) };
}
const files = [];
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.xml$/i.test(entry.name) && !/^history(?:_periodic)?\.xml$/i.test(entry.name)) files.push(full);
  }
}
await walk(root);
files.sort((a, b) => normalize(relative(root, a)).localeCompare(normalize(relative(root, b))));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const batches = [];
let records = [];
async function flush() {
  if (!records.length) return;
  const index = batches.length;
  const filename = `batch-${String(index + 1).padStart(4, '0')}.json`;
  const payload = { schema_version: 1, session, batch_index: index, records };
  const body = `${JSON.stringify(payload)}\n`;
  await writeFile(resolve(output, filename), body, 'utf8');
  batches.push({ index, filename, records: records.length, sha256: sha256(body), first_key: records[0].source_record_key, last_key: records.at(-1).source_record_key });
  records = [];
}
for (const full of files) {
  const parsedIdentity = identity(basename(full));
  if (!parsedIdentity) continue;
  const xml = await readFile(full, 'utf8');
  const rel = normalize(relative(root, full));
  const chamber = parsedIdentity.bill_type.startsWith('h') ? 'house' : parsedIdentity.bill_type.startsWith('s') ? 'senate' : 'joint';
  records.push({ kind: 'bill', source_record_key: `${session}:bill:${parsedIdentity.bill_type}:${parsedIdentity.bill_number}`, legislature_number: 89, session_code: 'R', ...parsedIdentity, chamber, caption: value(xml, ['caption', 'billCaption', 'description', 'title']) || `${parsedIdentity.bill_type.toUpperCase()} ${parsedIdentity.bill_number}`, description: value(xml, ['description', 'summary']), current_status_code: 'filed', current_status_label: 'Filed', introduced_date: isoDate(value(xml, ['filedDate', 'introducedDate'])), became_law: false, is_active: true, source_url: `ftp://ftp.legis.state.tx.us/bills/${session}/billhistory/${rel}`, last_synced_at: new Date().toISOString() });
  if (records.length === batchSize) await flush();
}
await flush();
const manifest = { schema_version: 1, created_at: new Date().toISOString(), session, batch_size: batchSize, batch_count: batches.length, counts: { bills: files.length }, batches };
await writeFile(resolve(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(resolve(output, 'checkpoint.json'), `${JSON.stringify({ schema_version: 1, session, next_batch_index: 0, completed_batches: [], totals: { imported: 0, updated: 0, skipped: 0, missing_bill: 0, errors: 0, bills: 0 } }, null, 2)}\n`);
console.log(JSON.stringify({ output, batch_count: batches.length, bills: files.length }, null, 2));
