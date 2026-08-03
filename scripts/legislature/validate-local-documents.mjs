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
const totals = Object.fromEntries(categories.map((name) => [name, {
  files: 0, html: 0, xml: 0, pdf: 0, doc: 0, other: 0, matched_documents: 0, unmatched_text_documents: 0, bills: new Set(),
}]));
const duplicates = new Map();
const identityPattern = /(?:^|\/)(HB|SB|HJR|SJR|HCR|SCR|HR|SR|HJ|SJ)\s*0*(\d+)([A-Z])?\.[^.]+$/i;
const typeAliases = { HJ: 'HJR', SJ: 'SJR' };

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else inspect(full);
  }
}

function inspect(fullPath) {
  const path = normalize(relative(root, fullPath));
  const parts = path.toLowerCase().split('/');
  const category = categories.find((name) => parts.includes(name));
  if (!category) return;
  const record = totals[category];
  record.files++;
  const extension = extname(path).slice(1).toLowerCase();
  const isText = ['htm', 'html', 'xml', 'txt'].includes(extension);
  if (['htm', 'html'].includes(extension)) record.html++;
  else if (extension === 'xml') record.xml++;
  else if (extension === 'pdf') record.pdf++;
  else if (['doc', 'docx'].includes(extension)) record.doc++;
  else record.other++;
  const identity = path.match(identityPattern);
  if (identity) {
    const rawType = identity[1].toUpperCase();
    const type = typeAliases[rawType] || rawType;
    record.bills.add(`${type}${Number(identity[2])}`);
    record.matched_documents++;
  } else if (isText && category !== 'reports' && !/history(?:_periodic)?\.xml$/i.test(path)) {
    record.unmatched_text_documents++;
  }
  const normalizedKey = path.toLowerCase();
  duplicates.set(normalizedKey, (duplicates.get(normalizedKey) || 0) + 1);
}

await walk(root);
const output = {};
for (const [name, value] of Object.entries(totals)) {
  output[name] = {
    files: value.files, unique_bills: value.bills.size, matched_documents: value.matched_documents,
    unmatched_text_documents: value.unmatched_text_documents, html: value.html, xml: value.xml,
    pdf: value.pdf, doc: value.doc, other: value.other,
  };
}
const duplicatePaths = [...duplicates.entries()].filter(([, count]) => count > 1);
console.log(JSON.stringify({ root, categories: output, duplicate_paths: duplicatePaths.length }, null, 2));

const required = ['billhistory', 'billtext', 'analysis', 'fiscalnotes'];
const missing = required.filter((name) => !output[name].files);
const unmatched = required.filter((name) => output[name].unmatched_text_documents > 0);
if (missing.length) {
  console.error(`Validation failed: missing required archive categories: ${missing.join(', ')}`);
  process.exitCode = 1;
}
if (unmatched.length) {
  console.error(`Validation failed: unrecognized text-document filenames remain in: ${unmatched.join(', ')}`);
  process.exitCode = 1;
}
