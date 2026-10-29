#!/usr/bin/env node
/**
 * Backfill and maintain official TLO bill subjects without changing the proven
 * bill-history importer. Progress is checkpointed in legislative_source_records
 * metadata, including records where the official file contains no subjects.
 */
import { parseTloSession, identityFromTloHistoryUrl } from './session-identity.mjs';
import { execFile } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { promisify } from 'node:util';

// Version 3 repairs false attribution from parsing the FTP grouping folder instead of the XML basename.
// All version-2 records are intentionally re-evaluated with the corrected identity parser.
const IMPORT_VERSION = 3;
const SOURCE_KEY = 'texas-legislature-online';
const SUBJECT_SOURCE = 'official-tlo-subject-record-v1';
const execFileAsync = promisify(execFile);
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));
const sessions = String(args.sessions || process.env.TLO_SESSIONS || '89R')
  .split(',').map((value) => value.trim()).filter(Boolean);
const dryRun = Boolean(args['dry-run']);
const maxRecords = Number(args['subject-limit'] || args.limit || 0);
const maxSeconds = Number(args['subject-max-seconds'] || process.env.TLO_SUBJECT_MAX_SECONDS || 420);
const transferTimeout = String(Number(process.env.TLO_TRANSFER_TIMEOUT_SECONDS || 120));
const startedAt = Date.now();
const outOfTime = () => (Date.now() - startedAt) / 1000 >= maxSeconds;

if (!SUPABASE_URL || (!SERVICE_KEY && !dryRun)) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (service key is optional with --dry-run).');
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
  ...(process.env.GITHUB_RUN_ID ? { 'X-GitHub-Run-Id': process.env.GITHUB_RUN_ID } : {}),
  ...(process.env.GITHUB_REPOSITORY ? { 'X-GitHub-Repository': process.env.GITHUB_REPOSITORY } : {}),
};
const decode = (value = '') => value
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const values = (xml, names) => names.flatMap((name) =>
  [...xml.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'gi'))]
    .map((match) => decode(match[1].replace(/<[^>]+>/g, ' '))),
).filter(Boolean);
const slug = (text = '') => text.toLowerCase().replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function request(url, init = {}) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response;
}
async function rest(path, init = {}) {
  return request(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
  });
}
async function transferText(url) {
  if (!url.startsWith('ftp://')) return (await request(url)).text();
  const command = process.env.TLO_TRANSFER_COMMAND || (process.platform === 'win32' ? 'curl.exe' : 'curl');
  const { stdout } = await execFileAsync(command, [
    '--fail', '--silent', '--show-error', '--location', '--ftp-pasv',
    '--retry', '3', '--retry-all-errors', '--connect-timeout', '20',
    '--max-time', transferTimeout, url,
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return stdout;
}
async function upsert(table, rows, onConflict) {
  if (!rows.length || dryRun) return rows;
  const response = await rest(`${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: 'POST',
    body: JSON.stringify(rows),
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  });
  return response.json();
}

const sessionParts = parseTloSession;
const sourceIdentity = identityFromTloHistoryUrl;
function billKey(record) {
  return `${record.legislature_number}:${record.session_code}:${record.bill_type}:${record.bill_number}`;
}
function extractSubjects(xml) {
  const direct = values(xml, [
    'subject', 'subjectName', 'subjectDescription', 'billSubject', 'legislativeSubject',
  ]);
  const listed = values(xml, ['subjects', 'billSubjects'])
    .flatMap((value) => value.split(/[|;\r\n]+/));

  return [...new Map([...direct, ...listed]
    .map((name) => name.replace(/\s+/g, ' ').trim())
    .filter((name) => name.length >= 2 && name.length <= 200)
    .map((name) => [slug(name), { name, slug: slug(name) }])
    .filter(([subjectSlug]) => Boolean(subjectSlug))).values()];
}

async function loadBills(session) {
  const parts = sessionParts(session);
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const response = await rest(
      `bills?legislature_number=eq.${parts.legislature_number}&session_code=eq.${parts.session_code}` +
      `&is_active=eq.true&select=id,legislature_number,session_code,bill_type,bill_number&order=id.asc&offset=${offset}&limit=1000`,
    );
    const page = await response.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return new Map(rows.map((row) => [billKey(row), row]));
}
async function loadSourceRecords(session) {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const response = await rest(
      `legislative_source_records?source_key=eq.${SOURCE_KEY}` +
      `&select=source_record_key,source_url,metadata&order=source_record_key.asc&offset=${offset}&limit=1000`,
    );
    const page = await response.json();
    rows.push(...page.filter((row) => row.source_record_key?.startsWith(`${session}:`)));
    if (page.length < 1000) break;
  }
  return rows;
}
async function markChecked(record, subjectCount) {
  if (dryRun) return;
  const metadata = {
    ...(record.metadata || {}),
    subjectsImportedVersion: IMPORT_VERSION,
    subjectsImportedAt: new Date().toISOString(),
    subjectCount,
  };
  await rest(
    `legislative_source_records?source_key=eq.${SOURCE_KEY}` +
    `&source_record_key=eq.${encodeURIComponent(record.source_record_key)}`,
    { method: 'PATCH', body: JSON.stringify({ metadata }) },
  );
}

let erroredSessions = 0;
for (const session of sessions) {
  const bills = await loadBills(session);
  const sourceRecords = await loadSourceRecords(session);
  const pending = sourceRecords.filter((record) =>
    Number(record.metadata?.subjectsImportedVersion || 0) < IMPORT_VERSION,
  );
  const totals = { checked: 0, linked: 0, subjects: 0, missingBill: 0, errors: 0 };

  console.log(`${session}: ${pending.length} official records need subject import${dryRun ? ' (dry run)' : ''}.`);
  for (const record of pending) {
    if (outOfTime() || (maxRecords && totals.checked >= maxRecords)) break;
    try {
      const identity = sourceIdentity(record.source_url, session);
      const bill = identity ? bills.get(billKey(identity)) : null;
      if (!bill) {
        totals.missingBill += 1;
        // Do not mark as imported when bill is absent: retry once the bill importer catches up.
        totals.checked += 1;
        continue;
      }

      const xml = await transferText(record.source_url);
      const subjects = extractSubjects(xml);
      const savedSubjects = await upsert('bill_subjects', subjects, 'slug');
      const relationships = savedSubjects
        .filter((subject) => subject.id)
        .map((subject) => ({
          bill_id: bill.id,
          subject_id: subject.id,
          confidence: 1.000,
          source: SUBJECT_SOURCE,
          is_manual: false,
          review_status: 'approved',
          evidence: {
            source: 'official-tlo-bill-history',
            source_url: record.source_url,
            subject_name: subject.name,
          },
          updated_at: new Date().toISOString(),
        }));
      await upsert('bill_subject_relationships', relationships, 'bill_id,subject_id');
      await markChecked(record, relationships.length);

      totals.checked += 1;
      totals.linked += relationships.length;
      totals.subjects += subjects.length;
      if (totals.checked % 50 === 0) {
        console.log(`${session}: checked ${totals.checked}, linked ${totals.linked}, errors ${totals.errors}.`);
      }
    } catch (error) {
      totals.errors += 1;
      console.error(`${session}: ${record.source_url} -> ${error.message}`);
    }
  }

  const remaining = Math.max(0, pending.length - totals.checked) + totals.missingBill;
  const state = totals.errors ? 'FAILED' : remaining ? 'PARTIAL (checkpointed)' : 'COMPLETE';
  console.log(
    `${session}: ${state} subject import — checked ${totals.checked}/${pending.length}, ` +
    `relationships ${totals.linked}, parsed subjects ${totals.subjects}, ` +
    `missing bills ${totals.missingBill}, remaining/retry ${remaining}, errors ${totals.errors}.`,
  );
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      `\n### Official TLO subjects: ${session}\n- Result: **${state}**\n- Records checked: ${totals.checked}/${pending.length}\n- Linked: ${totals.linked}\n- Missing bill records for retry: ${totals.missingBill}\n- Still pending/retry: ${remaining}\n- Errors: ${totals.errors}\n`);
  }
  if (totals.errors) erroredSessions++;
}
if (erroredSessions) process.exitCode = 1;
