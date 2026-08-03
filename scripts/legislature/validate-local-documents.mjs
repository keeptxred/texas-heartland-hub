#!/usr/bin/env node
import { access, readdir } from 'node:fs/promises';
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
const categories = ['billhistory', 'billtext', 'analysis', 'fiscalnotes', 'reports', 'witlistbill'];
const totals = Object.fromEntries(categories.map((name) => [name, { files: 0, html: 0, xml: 0, pdf: 0, doc: 0, other: 0, bills: new Set() }]));
const duplicates = new Map();

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else inspect(full);
  }
}

function inspect(fullPath) {
  const path = normalize(relative(root, fullPath));
  const category = categories.find((name) => path.toLowerCase().split('/').includes(name));
  if (!category) return;
  const record = totals[category];
  record.files++;
  const extension = extname(path).slice(1).toLowerCase();
  if (['htm', 'html'].includes(extension)) record.html++;
  else if (extension === 'xml') record.xml++;
  else if (extension === 'pdf') record.pdf++;
  else if (['doc', 'docx'].includes(extension)) record.doc++;
  else record.other++;
  const identity = path.match(/(?:^|\/)(HB|SB|HJR|SJR|HCR|SCR|HR|SR)0*(\d+)([A-Z])?\.[^.]+$/i);
  if (identity) record.bills.add(`${identity[1].toUpperCase()}${Number(identity[2])}`);
  const normalizedKey = path.toLowerCase();
  duplicates.set(normalizedKey, (duplicates.get(normalizedKey) || 0) + 1);
}

await walk(root);
const output = {};
for (const [name, value] of Object.entries(totals)) {
  output[name] = { files: value.files, unique_bills: value.bills.size, html: value.html, xml: value.xml, pdf: value.pdf, doc: value.doc, other: value.other };
}
const duplicatePaths = [...duplicates.entries()].filter(([, count]) => count > 1);
const missingCoreCategories = ['billhistory', 'billtext', 'analysis', 'fiscalnotes'].filter((name) => output[name].files === 0);
console.log(JSON.stringify({ root, categories: output, duplicate_paths: duplicatePaths.length, missing_core_categories: missingCoreCategories }, null, 2));
if (missingCoreCategories.length) {
  console.error(`Validation failed: missing core categories: ${missingCoreCategories.join(', ')}`);
  process.exitCode = 1;
}
