#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { parseOfficialDocument } from './parse-official-document.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));
const root = resolve(String(args.root || process.env.TLO_LOCAL_ROOT || ''));
const output = resolve(String(args.output || 'artifacts/legislature-import-batches'));
const session = String(args.session || '89R').toUpperCase();
const batchSize = Number(args['batch-size'] || 100);
if (!String(args.root || process.env.TLO_LOCAL_ROOT || '').trim()) throw new Error('--root is required.');
if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 100) throw new Error('--batch-size must be between 1 and 100.');
await access(root);

const legislatureNumber = Number(session.match(/^\d+/)?.[0]);
const sessionCode = session.replace(/^\d+/, '') || 'R';
if (!Number.isFinite(legislatureNumber)) throw new Error('--session must look like 89R.');
const datasets = ['billhistory', 'billtext', 'analysis', 'fiscalnotes', 'reports', 'witlistbill'];
const documentTypes = { billhistory: 'history', billtext: 'bill_text', analysis: 'analysis', fiscalnotes: 'fiscal_note', witlistbill: 'witness_list' };
const aliases = { HJ: 'HJR', SJ: 'SJR', HC: 'HCR', SC: 'SCR' };
const versionMap = { A: ['Amended', 70], C: ['Committee substitute', 50], E: ['Engrossed', 80], F: ['Enrolled', 100], H: ['House committee report', 40], I: ['Introduced', 20], S: ['Senate committee report', 60], R: ['Re-enrolled', 110], L: ['Senate amendments printing', 90] };
const normalize = (value) => value.split(sep).join('/');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

async function isDirectory(path) { try { return (await stat(path)).isDirectory(); } catch { return false; } }
async function datasetRoot(name) {
  for (const candidate of [resolve(root, name), resolve(root, name, name), resolve(root, name, 'html')]) if (await isDirectory(candidate)) return candidate;
  return null;
}
function identity(filename) {
  const match = filename.match(/^(HB|SB|HJR|SJR|HCR|SCR|HR|SR|HJ|SJ|HC|SC)\s*0*(\d+)([A-Z])?\.[^.]+$/i);
  if (!match) return null;
  const rawType = match[1].toUpperCase();
  return { bill_type: (aliases[rawType] || rawType).toLowerCase(), bill_number: Number(match[2]), version_code: match[3]?.toUpperCase() || null };
}
function decodeText(text) {
  return text.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/p>|<\/div>|<\/tr>|<\/li>|<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n').trim();
}

const files = [];
for (const dataset of datasets) {
  const base = await datasetRoot(dataset);
  if (!base) continue;
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = resolve(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (['htm', 'html', 'xml', 'txt'].includes(extname(entry.name).slice(1).toLowerCase())) {
        const rel = normalize(relative(base, full));
        files.push({ dataset, full, rel, key: `${dataset}/${rel}` });
      }
    }
  }
  await walk(base);
}
files.sort((a, b) => a.key.localeCompare(b.key));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const counts = { total: files.length, documents: 0, reports: 0, skipped: 0, structured: 0, by_document_type: {} };
let batch = [];
let batchIndex = 0;
const batches = [];
async function flush() {
  if (!batch.length) return;
  const filename = `batch-${String(batchIndex + 1).padStart(4, '0')}.json`;
  const payload = { schema_version: 1, session, legislature_number: legislatureNumber, session_code: sessionCode, batch_index: batchIndex, records: batch };
  const body = `${JSON.stringify(payload)}\n`;
  await writeFile(resolve(output, filename), body, 'utf8');
  batches.push({ index: batchIndex, filename, records: batch.length, sha256: sha256(body), first_key: batch[0].source_record_key, last_key: batch.at(-1).source_record_key });
  batch = [];
  batchIndex++;
}

for (const file of files) {
  const raw = await readFile(file.full, 'utf8');
  const sourceRecordKey = `${session}/${file.key}`;
  const sourceUrl = `ftp://ftp.legis.state.tx.us/bills/${session}/${file.dataset}/${file.rel}`;
  if (file.dataset === 'reports') {
    const parts = file.rel.split('/');
    const filename = parts.at(-1).replace(/\.[^.]+$/, '');
    batch.push({ kind: 'report', source_key: 'texas-legislature-online-local', source_record_key: sourceRecordKey, legislature_number: legislatureNumber, session_code: sessionCode, report_type: parts.length > 1 ? parts.at(-2) : 'general', report_key: filename, report_title: filename.replace(/[_-]+/g, ' '), source_url: sourceUrl, content_hash: sha256(raw), extracted_text: decodeText(raw), metadata: { relative_path: file.rel } });
    counts.reports++;
  } else {
    const parsedIdentity = identity(file.rel.split('/').at(-1));
    if (!parsedIdentity) { counts.skipped++; continue; }
    const documentType = documentTypes[file.dataset];
    const parsed = parseOfficialDocument(documentType, raw);
    const extractedText = parsed.extracted_text || decodeText(raw);
    const { extracted_text: _ignored, ...structured } = parsed || {};
    const [versionLabel, versionSequence] = versionMap[parsedIdentity.version_code] || [parsedIdentity.version_code || 'Official', null];
    const format = extname(file.full).slice(1).toLowerCase();
    batch.push({ kind: 'document', source_key: 'texas-legislature-online-local', source_record_key: sourceRecordKey, legislature_number: legislatureNumber, session_code: sessionCode, ...parsedIdentity, document_type: documentType, document_title: `${parsedIdentity.bill_type.toUpperCase()} ${parsedIdentity.bill_number} — ${documentType.replaceAll('_', ' ')}`, document_url: sourceUrl, source_html_url: ['htm', 'html'].includes(format) ? sourceUrl : null, file_format: format, version_label: versionLabel, version_sequence: versionSequence, content_hash: sha256(raw), extracted_text: extractedText, extracted_text_hash: sha256(extractedText), metadata: { dataset: file.dataset, relative_path: file.rel, parser_version: 1, structured } });
    counts.documents++;
    counts.by_document_type[documentType] = (counts.by_document_type[documentType] || 0) + 1;
    if (['analysis', 'fiscal_note', 'witness_list'].includes(documentType)) counts.structured++;
  }
  if (batch.length === batchSize) await flush();
}
await flush();
const manifest = { schema_version: 1, created_at: new Date().toISOString(), root, output, session, batch_size: batchSize, batch_count: batches.length, counts, batches };
await writeFile(resolve(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
await writeFile(resolve(output, 'checkpoint.json'), `${JSON.stringify({ schema_version: 1, session, next_batch_index: 0, completed_batches: [], totals: { imported: 0, updated: 0, skipped: 0, missing_bill: 0, errors: 0 } }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(manifest, null, 2));
