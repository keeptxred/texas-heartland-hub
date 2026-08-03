#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));

const root = resolve(String(args.root || process.env.TLO_LOCAL_ROOT || ''));
const session = String(args.session || process.env.TLO_SESSION || '89R').toUpperCase();
const legislatureNumber = Number(session.match(/^\d+/)?.[0]);
const sessionCode = session.replace(/^\d+/, '') || 'R';
const dryRun = Boolean(args['dry-run']);
const maxFiles = Number(args.limit || 0);
const maxSeconds = Number(args['max-seconds'] || 0);
const startedAt = Date.now();
const timedOut = () => maxSeconds > 0 && (Date.now() - startedAt) / 1000 >= maxSeconds;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!root || !Number.isFinite(legislatureNumber)) throw new Error('--root and a valid --session such as 89R are required.');
if (!dryRun && (!SUPABASE_URL || !SERVICE_KEY)) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');

const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const normalizePath = (path) => path.split(sep).join('/');
const decodeHtml = (text) => text
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<br\s*\/?\s*>/gi, '\n')
  .replace(/<\/p>|<\/div>|<\/tr>|<\/li>|<\/h[1-6]>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/[ \t]+/g, ' ')
  .replace(/\n\s*\n+/g, '\n\n')
  .trim();

const VERSION_MAP = {
  A: ['Amended', 70], C: ['Committee substitute', 50], E: ['Engrossed', 80],
  F: ['Filed', 10], H: ['House committee report', 40], I: ['Introduced', 20],
  S: ['Senate committee report', 60], R: ['Re-enrolled', 90], L: ['Enrolled', 100],
};

function parseIdentity(filePath) {
  const name = normalizePath(filePath);
  const match = name.match(/(?:^|\/)(HB|SB|HJR|SJR|HCR|SCR|HR|SR)0*(\d+)([A-Z])?\.(?:html?|xml|pdf|docx?|txt)$/i);
  if (!match) return null;
  return { billType: match[1].toLowerCase(), billNumber: Number(match[2]), versionCode: match[3]?.toUpperCase() || null };
}

function classify(relativePath) {
  const path = relativePath.toLowerCase();
  if (path.includes('/billtext/') || path.startsWith('billtext/')) return 'bill_text';
  if (path.includes('/analysis/') || path.startsWith('analysis/')) return 'analysis';
  if (path.includes('/fiscalnotes/') || path.startsWith('fiscalnotes/')) return 'fiscal_note';
  if (path.includes('/witlistbill/') || path.startsWith('witlistbill/')) return 'witness_list';
  if (path.includes('/billhistory/') || path.startsWith('billhistory/')) return 'history';
  if (path.includes('/reports/') || path.startsWith('reports/')) return 'report';
  return null;
}

async function walk(dir, output = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (timedOut() || (maxFiles && output.length >= maxFiles)) break;
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

async function findBill(identity) {
  const query = new URLSearchParams({
    legislature_number: `eq.${legislatureNumber}`,
    session_code: `eq.${sessionCode}`,
    bill_type: `eq.${identity.billType}`,
    bill_number: `eq.${identity.billNumber}`,
    select: 'id', limit: '1',
  });
  return (await request(`bills?${query}`))?.[0] || null;
}

async function upsertDocument(row) {
  if (dryRun) return;
  await request('bill_documents?on_conflict=source_key,source_record_key', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row),
  });
}

async function upsertReport(row) {
  if (dryRun) return;
  await request('legislative_report_indexes?on_conflict=source_key,source_record_key', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row),
  });
}

const files = await walk(root);
const counts = { seen: 0, imported: 0, reports: 0, skipped: 0, missingBill: 0, errors: 0 };
const touchedBills = new Set();

for (const fullPath of files) {
  if (timedOut()) break;
  const relativePath = normalizePath(relative(root, fullPath));
  const documentType = classify(relativePath);
  const extension = extname(fullPath).slice(1).toLowerCase();
  if (!documentType || !['htm', 'html', 'xml', 'txt'].includes(extension)) { counts.skipped++; continue; }
  counts.seen++;
  try {
    const raw = await readFile(fullPath, 'utf8');
    const contentHash = sha256(raw);
    const extractedText = extension === 'xml' ? decodeHtml(raw.replace(/<[^>]+>/g, ' ')) : decodeHtml(raw);
    const sourceRecordKey = `${session}/${relativePath}`;

    if (documentType === 'report') {
      const filename = relativePath.split('/').at(-1).replace(/\.[^.]+$/, '');
      const reportType = relativePath.split('/').slice(-2, -1)[0] || 'general';
      await upsertReport({
        source_key: 'texas-legislature-online-local', source_record_key: sourceRecordKey,
        legislature_number: legislatureNumber, session_code: sessionCode,
        report_type: reportType, report_key: filename, report_title: filename.replace(/[_-]+/g, ' '),
        source_url: `local://${sourceRecordKey}`, content_hash: contentHash,
        extracted_text: extractedText, metadata: { relative_path: relativePath, file_format: extension },
        last_seen_at: new Date().toISOString(), last_imported_at: new Date().toISOString(),
      });
      counts.reports++; continue;
    }

    const identity = parseIdentity(fullPath);
    if (!identity) { counts.skipped++; continue; }
    const bill = await findBill(identity);
    if (!bill) { counts.missingBill++; continue; }
    const [versionLabel, versionSequence] = VERSION_MAP[identity.versionCode] || [identity.versionCode || 'Official', null];
    await upsertDocument({
      bill_id: bill.id, source_key: 'texas-legislature-online-local', source_record_key: sourceRecordKey,
      legislature_number: legislatureNumber, session_code: sessionCode,
      bill_type: identity.billType, bill_number: identity.billNumber,
      document_type: documentType, document_title: `${identity.billType.toUpperCase()} ${identity.billNumber} — ${documentType.replaceAll('_', ' ')}`,
      document_url: `local://${sourceRecordKey}`, file_format: extension,
      version_code: identity.versionCode, version_label: versionLabel, version_sequence: versionSequence,
      content_hash: contentHash, extracted_text: extractedText, extracted_text_hash: sha256(extractedText),
      metadata: { relative_path: relativePath }, last_seen_at: new Date().toISOString(), last_imported_at: new Date().toISOString(),
    });
    touchedBills.add(bill.id); counts.imported++;
  } catch (error) {
    counts.errors++;
    console.error(`ERROR ${relativePath}: ${error.message}`);
  }
}

if (!dryRun) {
  for (const billId of touchedBills) {
    await request('rpc/refresh_bill_document_latest_flags', { method: 'POST', body: JSON.stringify({ p_bill_id: billId }) });
  }
}

console.log(JSON.stringify({ root, session, dryRun, timedOut: timedOut(), touchedBills: touchedBills.size, ...counts }, null, 2));
if (counts.errors) process.exitCode = 1;
