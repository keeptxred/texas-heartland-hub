#!/usr/bin/env node

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));

const session = String(args.session || process.env.TLO_SESSION || '89R').toUpperCase();
const legislatureNumber = Number(session.match(/^\d+/)?.[0]);
const sessionCode = session.replace(/^\d+/, '') || 'R';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!Number.isFinite(legislatureNumber)) throw new Error('--session must look like 89R.');
if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

async function request(path, init = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function count(table, filters = '') {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id${filters ? `&${filters}` : ''}`, {
    headers: { ...headers, Prefer: 'count=exact', Range: '0-0' },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  const range = response.headers.get('content-range') || '0/0';
  return Number(range.split('/').at(-1) || 0);
}

const sessionFilter = new URLSearchParams({
  legislature_number: `eq.${legislatureNumber}`,
  session_code: `eq.${sessionCode}`,
}).toString();

const documentCounts = {};
for (const type of ['history', 'bill_text', 'analysis', 'fiscal_note', 'witness_list']) {
  documentCounts[type] = await count('bill_documents', `${sessionFilter}&document_type=eq.${type}`);
}

const totals = {
  bills: await count('bills', sessionFilter),
  documents: await count('bill_documents', sessionFilter),
  reports: await count('legislative_report_indexes', sessionFilter),
  missing_bill_links: await count('bill_documents', `${sessionFilter}&bill_id=is.null`),
  missing_source_keys: await count('bill_documents', `${sessionFilter}&source_record_key=is.null`),
  missing_hashes: await count('bill_documents', `${sessionFilter}&content_hash=is.null`),
  latest_flags: await count('bill_documents', `${sessionFilter}&is_latest=eq.true`),
};

const duplicates = await request(`bill_documents?select=source_key,source_record_key&${sessionFilter}`);
const seen = new Set();
let duplicateSourceRecords = 0;
for (const row of duplicates || []) {
  const key = `${row.source_key}:${row.source_record_key}`;
  if (seen.has(key)) duplicateSourceRecords++;
  else seen.add(key);
}

const latestRows = await request(`bill_documents?select=bill_id,document_type,is_latest&${sessionFilter}&is_latest=eq.true`);
const latestGroupCounts = new Map();
for (const row of latestRows || []) {
  const key = `${row.bill_id}:${row.document_type}`;
  latestGroupCounts.set(key, (latestGroupCounts.get(key) || 0) + 1);
}
const duplicateLatestGroups = [...latestGroupCounts.values()].filter((count) => count > 1).length;

const failures = [];
if (!totals.bills) failures.push('No bills found for session.');
if (!totals.documents) failures.push('No legislative documents imported.');
if (totals.missing_bill_links) failures.push(`${totals.missing_bill_links} documents are missing bill links.`);
if (totals.missing_source_keys) failures.push(`${totals.missing_source_keys} documents are missing source record keys.`);
if (totals.missing_hashes) failures.push(`${totals.missing_hashes} documents are missing content hashes.`);
if (duplicateSourceRecords) failures.push(`${duplicateSourceRecords} duplicate source records found.`);
if (duplicateLatestGroups) failures.push(`${duplicateLatestGroups} bill/document groups have multiple latest rows.`);

console.log(JSON.stringify({
  session,
  totals,
  document_counts: documentCounts,
  duplicate_source_records: duplicateSourceRecords,
  duplicate_latest_groups: duplicateLatestGroups,
  status: failures.length ? 'failed' : 'passed',
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;
