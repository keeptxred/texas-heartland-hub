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

const normalizePath = (value) => value.split(sep).join('/');
const aliasMap = { HJ: 'HJR', SJ: 'SJR', HC: 'HCR', SC: 'SCR' };
const supportedTypes = new Set(['HB', 'SB', 'HJR', 'SJR', 'HCR', 'SCR', 'HR', 'SR']);
const versionOrder = { F: 10, I: 20, H: 40, C: 50, S: 60, A: 70, E: 80, R: 90, L: 100 };
const datasets = ['billhistory', 'billtext', 'analysis', 'fiscalnotes', 'witlistbill'];

function parseIdentity(path) {
  const file = path.split('/').at(-1);
  const match = file.match(/^(HB|SB|HJ|SJ|HC|SC|HR|SR|HJR|SJR|HCR|SCR)\s*0*(\d+)([A-Z])?\.(?:html?|xml|pdf)$/i);
  if (!match) return null;
  const rawType = match[1].toUpperCase();
  const billType = aliasMap[rawType] || rawType;
  if (!supportedTypes.has(billType)) return null;
  return {
    billType,
    billNumber: Number(match[2]),
    versionCode: match[3]?.toUpperCase() || null,
    billKey: `${billType}${Number(match[2])}`,
  };
}

function classify(path) {
  const parts = path.toLowerCase().split('/');
  return datasets.find((dataset) => parts.includes(dataset)) || null;
}

async function walk(dir, output = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(full, output);
    else output.push(full);
  }
  return output;
}

const files = await walk(root);
const documents = new Map();
const byBill = new Map();
const unmatched = [];
const unknownVersions = new Set();

for (const fullPath of files) {
  const path = normalizePath(relative(root, fullPath));
  const dataset = classify(path);
  if (!dataset) continue;
  const extension = extname(path).slice(1).toLowerCase();
  if (!['htm', 'html', 'xml', 'pdf'].includes(extension)) continue;
  const identity = parseIdentity(path);
  if (!identity) {
    const base = path.split('/').at(-1).toLowerCase();
    if (!['history.xml', 'history_periodic.xml'].includes(base)) unmatched.push(path);
    continue;
  }
  if (identity.versionCode && !(identity.versionCode in versionOrder)) unknownVersions.add(identity.versionCode);
  const canonicalKey = `${dataset}:${identity.billKey}:${identity.versionCode || 'NONE'}:${extension}`;
  if (!documents.has(canonicalKey)) documents.set(canonicalKey, []);
  documents.get(canonicalKey).push(path);
  if (!byBill.has(identity.billKey)) byBill.set(identity.billKey, new Map());
  const datasetMap = byBill.get(identity.billKey);
  if (!datasetMap.has(dataset)) datasetMap.set(dataset, []);
  datasetMap.get(dataset).push({ path, versionCode: identity.versionCode, extension });
}

const duplicateCanonicalRecords = [...documents.entries()]
  .filter(([, paths]) => paths.length > 1)
  .map(([key, paths]) => ({ key, count: paths.length, paths: paths.slice(0, 5) }));

const historyBills = new Set([...byBill.entries()].filter(([, map]) => map.has('billhistory')).map(([bill]) => bill));
const orphanDocuments = [];
const versionSummaries = {};
const latestVersions = {};

for (const [billKey, datasetMap] of byBill) {
  for (const [dataset, records] of datasetMap) {
    if (dataset !== 'billhistory' && !historyBills.has(billKey)) {
      orphanDocuments.push({ billKey, dataset, files: records.length });
    }
    if (!versionSummaries[dataset]) versionSummaries[dataset] = {};
    for (const record of records) {
      const code = record.versionCode || 'NONE';
      versionSummaries[dataset][code] = (versionSummaries[dataset][code] || 0) + 1;
    }
    const ranked = records
      .filter((record) => record.versionCode)
      .sort((a, b) => (versionOrder[b.versionCode] || -1) - (versionOrder[a.versionCode] || -1));
    if (ranked.length) {
      latestVersions[dataset] ||= {};
      const latest = ranked[0].versionCode;
      latestVersions[dataset][latest] = (latestVersions[dataset][latest] || 0) + 1;
    }
  }
}

const missingCoreByDataset = {};
for (const dataset of ['billtext', 'analysis', 'fiscalnotes', 'witlistbill']) {
  missingCoreByDataset[dataset] = [...byBill.entries()].filter(([, map]) => map.has(dataset) && !map.has('billhistory')).length;
}

const result = {
  root,
  unique_bills: byBill.size,
  history_bills: historyBills.size,
  canonical_document_records: documents.size,
  duplicate_canonical_records: duplicateCanonicalRecords.length,
  duplicate_examples: duplicateCanonicalRecords.slice(0, 20),
  orphan_document_groups: orphanDocuments.length,
  orphan_examples: orphanDocuments.slice(0, 20),
  unmatched_files: unmatched.length,
  unmatched_examples: unmatched.slice(0, 20),
  unknown_version_codes: [...unknownVersions].sort(),
  version_counts: versionSummaries,
  inferred_latest_version_counts: latestVersions,
  orphan_counts_by_dataset: missingCoreByDataset,
};

console.log(JSON.stringify(result, null, 2));

if (unmatched.length || orphanDocuments.length || unknownVersions.size) {
  process.exitCode = 1;
}
