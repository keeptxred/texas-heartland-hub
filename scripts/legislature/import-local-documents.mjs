#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { access, readFile, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { parseOfficialDocument } from './parse-official-document.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));
const rootInput = String(args.root || process.env.TLO_LOCAL_ROOT || '').trim();
if (!rootInput) throw new Error('--root is required.');
const root = resolve(rootInput);
await access(root);
const session = String(args.session || process.env.TLO_SESSION || '89R').toUpperCase();
const legislatureNumber = Number(session.match(/^\d+/)?.[0]);
const sessionCode = session.replace(/^\d+/, '') || 'R';
if (!Number.isFinite(legislatureNumber)) throw new Error('--session must look like 89R.');
const dryRun = Boolean(args['dry-run']);
const freshRun = Boolean(args.fresh);
const maxFiles = Number(args.limit || 0);
const maxSeconds = Number(args['max-seconds'] || 0);
const startedAt = Date.now();
const timedOut = () => maxSeconds > 0 && (Date.now() - startedAt) / 1000 >= maxSeconds;
const checkpointPath = resolve(String(args.checkpoint || `${root}/.legislative-document-import-${session}.json`));
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!dryRun && (!SUPABASE_URL || !SERVICE_KEY)) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');

const DATASETS = ['billhistory', 'billtext', 'analysis', 'fiscalnotes', 'reports', 'witlistbill'];
const DOCUMENT_TYPES = { billhistory: 'history', billtext: 'bill_text', analysis: 'analysis', fiscalnotes: 'fiscal_note', witlistbill: 'witness_list' };
const aliases = { HJ: 'HJR', SJ: 'SJR', HC: 'HCR', SC: 'SCR' };
const VERSION_MAP = { A: ['Amended', 70], C: ['Committee substitute', 50], E: ['Engrossed', 80], F: ['Filed', 10], H: ['House committee report', 40], I: ['Introduced', 20], S: ['Senate committee report', 60], R: ['Re-enrolled', 90], L: ['Enrolled', 100] };
const normalizePath = (value) => value.split(sep).join('/');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };

async function isDirectory(path) { try { return (await stat(path)).isDirectory(); } catch { return false; } }
async function resolveDatasetRoot(name) {
  const explicit = String(args[`${name}-root`] || '').trim();
  const candidates = explicit ? [resolve(explicit)] : [resolve(root, name), resolve(root, name, name), resolve(root, name, 'html')];
  for (const candidate of candidates) if (await isDirectory(candidate)) return candidate;
  return null;
}
function parseIdentity(filename) {
  const match = filename.match(/^(HB|SB|HJR|SJR|HCR|SCR|HR|SR|HJ|SJ|HC|SC)\s*0*(\d+)([A-Z])?\.[^.]+$/i);
  if (!match) return null;
  const rawType = match[1].toUpperCase();
  return { billType: (aliases[rawType] || rawType).toLowerCase(), billNumber: Number(match[2]), versionCode: match[3]?.toUpperCase() || null };
}
function decodeText(text) {
  return text.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/p>|<\/div>|<\/tr>|<\/li>|<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n').trim();
}
function structuredMetadata(parsed) {
  const { extracted_text: _ignored, ...structured } = parsed || {};
  return structured;
}
async function request(path, init = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
const billCache = new Map();
async function findBill(identity) {
  const key = `${identity.billType}:${identity.billNumber}`;
  if (billCache.has(key)) return billCache.get(key);
  if (dryRun) { const fake = { id: `dry-run:${key}` }; billCache.set(key, fake); return fake; }
  const query = new URLSearchParams({ legislature_number: `eq.${legislatureNumber}`, session_code: `eq.${sessionCode}`, bill_type: `eq.${identity.billType}`, bill_number: `eq.${identity.billNumber}`, select: 'id', limit: '1' });
  const bill = (await request(`bills?${query}`))?.[0] || null;
  billCache.set(key, bill); return bill;
}
async function atomicCheckpoint(data) {
  if (dryRun) return;
  const temp = `${checkpointPath}.tmp`;
  await writeFile(temp, JSON.stringify(data, null, 2));
  await rename(temp, checkpointPath);
}
async function loadCheckpoint() {
  if (freshRun) { try { await unlink(checkpointPath); } catch {} return null; }
  try { return JSON.parse(await readFile(checkpointPath, 'utf8')); } catch { return null; }
}

const files = [];
for (const dataset of DATASETS) {
  const datasetRoot = await resolveDatasetRoot(dataset);
  if (!datasetRoot) continue;
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = resolve(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else {
        const extension = extname(entry.name).slice(1).toLowerCase();
        if (!['htm', 'html', 'xml', 'txt'].includes(extension)) continue;
        const rel = normalizePath(relative(datasetRoot, full));
        files.push({ dataset, full, rel, key: `${dataset}/${rel}` });
      }
    }
  }
  await walk(datasetRoot);
}
files.sort((a, b) => a.key.localeCompare(b.key));
const checkpoint = await loadCheckpoint();
let startIndex = checkpoint?.last_key ? files.findIndex((file) => file.key > checkpoint.last_key) : 0;
if (startIndex < 0) startIndex = files.length;
const counts = { total: files.length, start_index: startIndex, seen: 0, imported: 0, reports: 0, parsed_structured: 0, skipped: 0, missing_bill: 0, errors: 0 };
const touchedBills = new Set();
let lastKey = checkpoint?.last_key || null;

for (let index = startIndex; index < files.length; index++) {
  if (timedOut() || (maxFiles && counts.seen >= maxFiles)) break;
  const file = files[index]; counts.seen++;
  try {
    const raw = await readFile(file.full, 'utf8');
    const contentHash = sha256(raw);
    const sourceRecordKey = `${session}/${file.key}`;
    const officialUrl = `ftp://ftp.legis.state.tx.us/bills/${session}/${file.dataset}/${file.rel}`;
    if (file.dataset === 'reports') {
      const extractedText = decodeText(raw);
      const parts = file.rel.split('/');
      const filename = parts.at(-1).replace(/\.[^.]+$/, '');
      const reportType = parts.length > 1 ? parts.at(-2) : 'general';
      if (!dryRun) await request('legislative_report_indexes?on_conflict=source_key,source_record_key', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ source_key: 'texas-legislature-online-local', source_record_key: sourceRecordKey, legislature_number: legislatureNumber, session_code: sessionCode, report_type: reportType, report_key: filename, report_title: filename.replace(/[_-]+/g, ' '), source_url: officialUrl, content_hash: contentHash, extracted_text: extractedText, metadata: { relative_path: file.rel }, last_seen_at: new Date().toISOString(), last_imported_at: new Date().toISOString() }) });
      counts.reports++;
    } else {
      const identity = parseIdentity(file.rel.split('/').at(-1));
      if (!identity) { counts.skipped++; lastKey = file.key; await atomicCheckpoint({ session, last_key: lastKey, index, total: files.length }); continue; }
      const bill = await findBill(identity);
      if (!bill) { counts.missing_bill++; lastKey = file.key; await atomicCheckpoint({ session, last_key: lastKey, index, total: files.length }); continue; }
      const [versionLabel, versionSequence] = VERSION_MAP[identity.versionCode] || [identity.versionCode || 'Official', null];
      const documentType = DOCUMENT_TYPES[file.dataset];
      const parsed = parseOfficialDocument(documentType, raw);
      const extractedText = parsed.extracted_text || decodeText(raw);
      const structured = structuredMetadata(parsed);
      if (['analysis', 'fiscal_note', 'witness_list'].includes(documentType)) counts.parsed_structured++;
      if (!dryRun) await request('bill_documents?on_conflict=source_key,source_record_key', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ bill_id: bill.id, source_key: 'texas-legislature-online-local', source_record_key: sourceRecordKey, legislature_number: legislatureNumber, session_code: sessionCode, bill_type: identity.billType, bill_number: identity.billNumber, document_type: documentType, document_title: `${identity.billType.toUpperCase()} ${identity.billNumber} — ${documentType.replaceAll('_', ' ')}`, document_url: officialUrl, source_html_url: ['htm', 'html'].includes(extname(file.full).slice(1).toLowerCase()) ? officialUrl : null, file_format: extname(file.full).slice(1).toLowerCase(), version_code: identity.versionCode, version_label: versionLabel, version_sequence: versionSequence, content_hash: contentHash, extracted_text: extractedText, extracted_text_hash: sha256(extractedText), metadata: { dataset: file.dataset, relative_path: file.rel, parser_version: 1, structured }, last_seen_at: new Date().toISOString(), last_imported_at: new Date().toISOString() }) });
      touchedBills.add(bill.id); counts.imported++;
    }
  } catch (error) { counts.errors++; console.error(`ERROR ${file.key}: ${error.message}`); }
  lastKey = file.key;
  await atomicCheckpoint({ session, last_key: lastKey, index, total: files.length, updated_at: new Date().toISOString() });
}
if (!dryRun) for (const billId of touchedBills) await request('rpc/refresh_bill_document_latest_flags', { method: 'POST', body: JSON.stringify({ p_bill_id: billId }) });
const complete = startIndex + counts.seen >= files.length && !timedOut();
if (complete && !dryRun) try { await unlink(checkpointPath); } catch {}
console.log(JSON.stringify({ root, session, dryRun, complete, timed_out: timedOut(), checkpoint: complete ? null : checkpointPath, last_key: lastKey, touched_bills: touchedBills.size, ...counts }, null, 2));
if (counts.errors) process.exitCode = 1;
