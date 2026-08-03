#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));

const rootInput = String(args.root || process.env.TLO_LOCAL_ROOT || '').trim();
if (!rootInput) throw new Error('--root is required.');
const root = resolve(rootInput);
const session = String(args.session || process.env.TLO_SESSION || '89R').toUpperCase();
const legislatureNumber = Number(session.match(/^\d+/)?.[0]);
const sessionCode = session.replace(/^\d+/, '') || 'R';
const dryRun = Boolean(args['dry-run']);
const freshRun = Boolean(args.fresh);
const maxFiles = Number(args.limit || 0);
const maxSeconds = Number(args['max-seconds'] || 0);
const checkpointPath = resolve(String(args.checkpoint || `${root}/.legislative-document-import-${session}.json`));
const startedAt = Date.now();
const timedOut = () => maxSeconds > 0 && (Date.now() - startedAt) / 1000 >= maxSeconds;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!Number.isFinite(legislatureNumber)) throw new Error('--session must look like 89R.');
if (!dryRun && (!SUPABASE_URL || !SERVICE_KEY)) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');

const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const normalizePath = (value) => value.split(sep).join('/');
const decodeMarkup = (text) => text
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<br\s*\/?\s*>/gi, '\n')
  .replace(/<\/(?:p|div|tr|li|h[1-6])>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
  .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim();

const TYPE_ALIASES = { HJ: 'hjr', SJ: 'sjr', HC: 'hcr', SC: 'scr' };
const VERSION_MAP = {
  A: ['Amended', 70], C: ['Committee substitute', 50], E: ['Engrossed', 80],
  F: ['Filed', 10], H: ['House committee report', 40], I: ['Introduced', 20],
  S: ['Senate committee report', 60], R: ['Re-enrolled', 90], L: ['Enrolled', 100],
};

function parseIdentity(filePath) {
  const name = normalizePath(filePath);
  const match = name.match(/(?:^|\/)(HB|SB|HJR|SJR|HCR|SCR|HR|SR|HJ|SJ|HC|SC)\s*0*(\d+)([A-Z])?\.(?:html?|xml|pdf|docx?|txt)$/i);
  if (!match) return null;
  const rawType = match[1].toUpperCase();
  return { billType: TYPE_ALIASES[rawType] || rawType.toLowerCase(), billNumber: Number(match[2]), versionCode: match[3]?.toUpperCase() || null };
}

function classify(relativePath) {
  const parts = relativePath.toLowerCase().split('/');
  if (parts.includes('billtext')) return 'bill_text';
  if (parts.includes('analysis')) return 'analysis';
  if (parts.includes('fiscalnotes')) return 'fiscal_note';
  if (parts.includes('witlistbill')) return 'witness_list';
  if (parts.includes('billhistory')) return 'history';
  if (parts.includes('reports')) return 'report';
  return null;
}

async function walk(dir, output = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(fullPath, output);
    else output.push(fullPath);
  }
  return output;
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
  if (dryRun) {
    const synthetic = { id: `dry-run:${key}` };
    billCache.set(key, synthetic);
    return synthetic;
  }
  const query = new URLSearchParams({ legislature_number: `eq.${legislatureNumber}`, session_code: `eq.${sessionCode}`, bill_type: `eq.${identity.billType}`, bill_number: `eq.${identity.billNumber}`, select: 'id', limit: '1' });
  const bill = (await request(`bills?${query}`))?.[0] || null;
  billCache.set(key, bill);
  return bill;
}

async function upsert(table, row, conflict) {
  if (dryRun) return;
  await request(`${table}?on_conflict=${conflict}`, { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(row) });
}

async function readCheckpoint() {
  if (freshRun) { await unlink(checkpointPath).catch(() => {}); return null; }
  try { return JSON.parse(await readFile(checkpointPath, 'utf8')); } catch { return null; }
}
async function saveCheckpoint(data) {
  if (dryRun) return;
  const temp = `${checkpointPath}.tmp`;
  await writeFile(temp, JSON.stringify(data, null, 2));
  await rename(temp, checkpointPath);
}

const files = (await walk(root)).sort((a, b) => normalizePath(relative(root, a)).localeCompare(normalizePath(relative(root, b))));
const checkpoint = await readCheckpoint();
const resumeAfter = checkpoint?.last_path || null;
let resumePassed = !resumeAfter;
const counts = { total: files.length, processed: 0, candidates: 0, imported: 0, reports: 0, skipped: 0, missingBill: 0, errors: 0 };
const touchedBills = new Set();
let lastPath = resumeAfter;

for (const fullPath of files) {
  const relativePath = normalizePath(relative(root, fullPath));
  if (!resumePassed) { if (relativePath === resumeAfter) resumePassed = true; continue; }
  if (timedOut() || (maxFiles && counts.processed >= maxFiles)) break;
  counts.processed++;
  lastPath = relativePath;
  const documentType = classify(relativePath);
  const extension = extname(fullPath).slice(1).toLowerCase();
  if (!documentType || !['htm', 'html', 'xml', 'txt'].includes(extension)) {
    counts.skipped++;
    await saveCheckpoint({ session, last_path: lastPath, updated_at: new Date().toISOString() });
    continue;
  }
  try {
    const raw = await readFile(fullPath, 'utf8');
    const contentHash = sha256(raw);
    const extractedText = decodeMarkup(raw);
    const sourceRecordKey = `${session}/${relativePath}`;
    if (documentType === 'report') {
      const filename = relativePath.split('/').at(-1).replace(/\.[^.]+$/, '');
      const reportType = relativePath.split('/').slice(-2, -1)[0] || 'general';
      await upsert('legislative_report_indexes', {
        source_key: 'texas-legislature-online-local', source_record_key: sourceRecordKey, legislature_number: legislatureNumber, session_code: sessionCode,
        report_type: reportType, report_key: filename, report_title: filename.replace(/[_-]+/g, ' '), source_url: `local://${sourceRecordKey}`,
        content_hash: contentHash, extracted_text: extractedText, metadata: { relative_path: relativePath, file_format: extension },
        last_seen_at: new Date().toISOString(), last_imported_at: new Date().toISOString(),
      }, 'source_key,source_record_key');
      counts.reports++;
    } else {
      const identity = parseIdentity(fullPath);
      if (!identity) { counts.skipped++; await saveCheckpoint({ session, last_path: lastPath, updated_at: new Date().toISOString() }); continue; }
      counts.candidates++;
      const bill = await findBill(identity);
      if (!bill) { counts.missingBill++; await saveCheckpoint({ session, last_path: lastPath, updated_at: new Date().toISOString() }); continue; }
      const [versionLabel, versionSequence] = VERSION_MAP[identity.versionCode] || [identity.versionCode || 'Official', null];
      await upsert('bill_documents', {
        bill_id: bill.id, source_key: 'texas-legislature-online-local', source_record_key: sourceRecordKey,
        legislature_number: legislatureNumber, session_code: sessionCode, bill_type: identity.billType, bill_number: identity.billNumber,
        document_type: documentType, document_title: `${identity.billType.toUpperCase()} ${identity.billNumber} — ${documentType.replaceAll('_', ' ')}`,
        document_url: `local://${sourceRecordKey}`, file_format: extension, version_code: identity.versionCode, version_label: versionLabel,
        version_sequence: versionSequence, content_hash: contentHash, extracted_text: extractedText, extracted_text_hash: sha256(extractedText),
        metadata: { relative_path: relativePath }, last_seen_at: new Date().toISOString(), last_imported_at: new Date().toISOString(),
      }, 'source_key,source_record_key');
      touchedBills.add(bill.id); counts.imported++;
    }
  } catch (error) {
    counts.errors++;
    console.error(`ERROR ${relativePath}: ${error.message}`);
  }
  await saveCheckpoint({ session, last_path: lastPath, updated_at: new Date().toISOString() });
}

if (!dryRun) {
  for (const billId of touchedBills) await request('rpc/refresh_bill_document_latest_flags', { method: 'POST', body: JSON.stringify({ p_bill_id: billId }) });
}
const complete = Boolean(lastPath && lastPath === normalizePath(relative(root, files.at(-1))));
if (complete && !dryRun) await unlink(checkpointPath).catch(() => {});
console.log(JSON.stringify({ root, session, dryRun, complete, timedOut: timedOut(), checkpoint: complete ? null : checkpointPath, lastPath, touchedBills: touchedBills.size, ...counts }, null, 2));
if (counts.errors) process.exitCode = 1;
