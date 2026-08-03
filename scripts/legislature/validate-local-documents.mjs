#!/usr/bin/env node
import { access, readdir, stat } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));
const rootInput = String(args.root || process.env.TLO_LOCAL_ROOT || '').trim();
if (!rootInput) throw new Error('--root is required.');
const root = resolve(rootInput);
await access(root);

const normalize = (value) => value.split(sep).join('/');
const DATASETS = {
  billhistory: { required: true },
  billtext: { required: true },
  analysis: { required: true },
  fiscalnotes: { required: true },
  reports: { required: false },
  witlistbill: { required: false },
};

async function isDirectory(path) {
  try { return (await stat(path)).isDirectory(); } catch { return false; }
}
async function resolveDatasetRoot(name) {
  const explicit = String(args[`${name}-root`] || '').trim();
  const candidates = explicit
    ? [resolve(explicit)]
    : [resolve(root, name), resolve(root, name, name), resolve(root, name, 'html'), resolve(root, name, 'pdf')];
  for (const candidate of candidates) if (await isDirectory(candidate)) return candidate;
  return null;
}
function parseIdentity(path) {
  const base = path.split('/').at(-1) || '';
  const match = base.match(/^(HB|SB|HJR|SJR|HCR|SCR|HR|SR|HJ|SJ|HC|SC)\s*0*(\d+)([A-Z])?\.[^.]+$/i);
  if (!match) return null;
  const aliases = { HJ: 'HJR', SJ: 'SJR', HC: 'HCR', SC: 'SCR' };
  return `${aliases[match[1].toUpperCase()] || match[1].toUpperCase()}${Number(match[2])}`;
}

const output = {};
let failed = false;
for (const [name, config] of Object.entries(DATASETS)) {
  const datasetRoot = await resolveDatasetRoot(name);
  const record = { root: datasetRoot, files: 0, unique_bills: 0, html: 0, xml: 0, pdf: 0, doc: 0, other: 0, recognized: 0, unmatched: 0 };
  const bills = new Set();
  if (!datasetRoot) {
    record.missing = true;
    output[name] = record;
    if (config.required) failed = true;
    continue;
  }
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = resolve(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else {
        record.files++;
        const extension = extname(entry.name).slice(1).toLowerCase();
        if (['htm', 'html'].includes(extension)) record.html++;
        else if (extension === 'xml') record.xml++;
        else if (extension === 'pdf') record.pdf++;
        else if (['doc', 'docx'].includes(extension)) record.doc++;
        else record.other++;
        const identity = parseIdentity(normalize(relative(datasetRoot, full)));
        if (identity) { bills.add(identity); record.recognized++; }
        else if (name !== 'reports' && !/^history(?:_periodic)?\.xml$/i.test(entry.name)) record.unmatched++;
      }
    }
  }
  await walk(datasetRoot);
  record.unique_bills = bills.size;
  output[name] = record;
  if (config.required && record.files === 0) failed = true;
}

console.log(JSON.stringify({ root, datasets: output, validation_passed: !failed }, null, 2));
if (failed) process.exitCode = 1;
