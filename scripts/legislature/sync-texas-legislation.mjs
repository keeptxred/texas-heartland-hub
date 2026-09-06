#!/usr/bin/env node
/**
 * Incremental Texas Legislature Online importer.
 *
 * Official source: ftp://ftp.legis.state.tx.us/bills/<session>/billhistory/
 * TLO asks bulk consumers to use this feed instead of mining capitol.texas.gov.
 * Required env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Usage: node scripts/legislature/sync-texas-legislation.mjs --sessions=89R,88R
 */
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { hostname } from 'node:os';
import { promisify } from 'node:util';

const SOURCE_KEY = 'texas-legislature-online';
const TLO_BULK_ROOT = process.env.TLO_BULK_ROOT || 'ftp://ftp.legis.state.tx.us/bills';
const TRANSFER_TIMEOUT_SECONDS = String(Number(process.env.TLO_TRANSFER_TIMEOUT_SECONDS || 120));
const execFileAsync = promisify(execFile);
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('='); return [key, value.join('=') || true];
}));
const sessions = String(args.sessions || process.env.TLO_SESSIONS || '89R').split(',').map((v) => v.trim()).filter(Boolean);
const dryRun = Boolean(args['dry-run']);
const maxRecords = Number(args.limit || 0);
const freshRun = Boolean(args.fresh);
// A legacy builder/CI command has a hard execution ceiling; stop cleanly before it and checkpoint.
const maxSeconds = Number(args['max-seconds'] || process.env.TLO_MAX_SECONDS || 480);
// Already-imported source files are re-downloaded only after this many days, so restarts are cheap
// while later incremental runs still pick up upstream changes.
const recheckDays = Number(args['recheck-days'] || process.env.TLO_RECHECK_DAYS || 7);
// A run whose checkpoint is older than this has no live process behind it (sandbox reset or timeout).
const staleRunMinutes = Number(args['stale-minutes'] || 12);
const startedAtMs = Date.now();
const outOfTime = () => (Date.now() - startedAtMs) / 1000 >= maxSeconds;

if (!SUPABASE_URL || (!SERVICE_KEY && !dryRun)) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (service key is optional with --dry-run).');
}

const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
const decode = (value = '') => value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const values = (xml, names) => names.flatMap((name) => [...xml.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'gi'))].map((m) => decode(m[1].replace(/<[^>]+>/g, ' ')))).filter(Boolean);
const value = (xml, names) => values(xml, names)[0] || null;
const blocks = (xml, names) => names.flatMap((name) => [...xml.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'gi'))].map((m) => m[1]));
const slug = (text = '') => text.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isoDate = (text) => {
  if (!text) return null;
  const date = new Date(text); return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};
const hash = (text) => createHash('sha256').update(text).digest('hex');
const formatMdy = (iso) => {
  if (!iso) return null;
  const [year, month, day] = iso.split('-').map(Number);
  return `${month}/${day}/${year}`;
};
function normalizeActionText(part) {
  const description = value(part, ['actionDescription', 'description', 'actionText']);
  const comment = value(part, ['actionComment', 'comment', 'comments', 'actionRemarks', 'remarks', 'remark']);
  if (!description) return decode(part.replace(/<[^>]+>/g, ' '));
  if (comment && /^Effective on(?:\s*\.)+\s*$/i.test(description)) {
    const effectiveDate = formatMdy(isoDate(comment));
    if (effectiveDate) return `Effective on ${effectiveDate}`;
  }
  return description;
}

async function request(url, init = {}) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response;
}
async function transferText(url, listOnly = false) {
  if (!url.startsWith('ftp://')) return (await request(url)).text();
  const command = process.env.TLO_TRANSFER_COMMAND || (process.platform === 'win32' ? 'curl.exe' : 'curl');
  try {
    const transferArgs = [
      '--fail', '--silent', '--show-error', '--location', '--ftp-pasv',
      '--retry', '3', '--retry-all-errors', '--connect-timeout', '20',
      '--max-time', TRANSFER_TIMEOUT_SECONDS,
    ];
    if (listOnly) transferArgs.push('--list-only');
    transferArgs.push(url);
    const { stdout } = await execFileAsync(command, transferArgs, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    return stdout;
  } catch (error) {
    const detail = error.stderr?.trim() || error.message;
    throw new Error(`Official TLO FTP download failed for ${url}: ${detail}`);
  }
}

const BILL_HISTORY_FOLDERS = [
  'house_bills', 'house_concurrent_resolutions', 'house_joint_resolutions', 'house_resolutions',
  'senate_bills', 'senate_concurrent_resolutions', 'senate_joint_resolutions', 'senate_resolutions',
];

async function discoverFromDirectories(sessionRoot) {
  const urls = [];
  for (const billFolder of BILL_HISTORY_FOLDERS) {
    const folderUrl = `${sessionRoot}/${billFolder}/`;
    const groups = (await transferText(folderUrl, true)).split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean).sort();
    for (const group of groups) {
      const groupUrl = new URL(`${group}/`, folderUrl).href;
      const files = (await transferText(groupUrl, true)).split(/\r?\n/).map((entry) => entry.trim()).filter((entry) => /\.xml$/i.test(entry)).sort();
      for (const file of files) {
        urls.push(new URL(file, groupUrl).href);
        if (maxRecords && urls.length >= maxRecords) return urls;
      }
    }
  }
  return urls;
}
async function rest(path, init = {}) {
  return request(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });
}
async function upsert(table, rows, onConflict) {
  if (!rows.length || dryRun) return rows;
  const response = await rest(`${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: 'POST', body: JSON.stringify(rows), headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  });
  return response.json();
}
async function selectOne(table, query) {
  const response = await rest(`${table}?${query}&limit=1`, { headers: { Prefer: 'return=representation' } });
  return (await response.json())[0] || null;
}

async function linkAuthorities(sourceType, sourceKey, targetType, targetKey, relationshipType, score, evidence) {
  if (dryRun || !sourceKey || !targetKey) return;
  await rest('rpc/upsert_bidirectional_authority_relationship', { method: 'POST', body: JSON.stringify({
    p_source_type: sourceType, p_source_key: sourceKey, p_target_type: targetType,
    p_target_key: targetKey, p_relationship_type: relationshipType, p_score: score, p_evidence: evidence,
  }) });
}
function canonicalDistrictSlug(districtId) {
  const match = /^district-(texas-house|texas-senate|us-house)-(\d+)$/.exec(districtId || '');
  if (!match) return null;
  const prefix = { 'texas-house': 'texas-house-district', 'texas-senate': 'texas-senate-district', 'us-house': 'congressional-district' }[match[1]];
  return `${prefix}-${match[2]}`;
}
async function syncElectionRelationships() {
  const races = JSON.parse(await readFile(new URL('../../src/data/elections/2026/races.json', import.meta.url), 'utf8'));
  for (const race of races) {
    if (race.publicationStatus !== 'published' || race.verificationStatus !== 'verified') continue;
    const districtKey = canonicalDistrictSlug(race.districtId);
    if (districtKey) await linkAuthorities('district', districtKey, 'election', race.slug, 'district-election', 38, { source: 'verified-election-registry', electionDate: race.electionDate });
  }
}

function billIdentity(xml, sourceUrl, session) {
  const rootBill = xml.match(/<billhistory\b[^>]*\bbill=["'][^"']*\b(HB|SB|HJR|SJR|HCR|SCR|HR|SR)\s*(\d+)/i);
  const identifier = (rootBill ? `${rootBill[1]}${rootBill[2]}` : null)
    || value(xml, ['billNumber', 'billName', 'legislationNumber'])
    || decodeURIComponent(sourceUrl).match(/([HS](?:B|JR|CR|R))\s*(\d{1,5})/i)?.slice(1).join('');
  const match = identifier?.replace(/\s/g, '').match(/^(HB|SB|HJR|SJR|HCR|SCR|HR|SR)(\d+)$/i);
  if (!match) return null;
  const billType = match[1].toLowerCase();
  const legislature = Number(session.match(/^\d+/)?.[0]);
  const sessionCode = session.replace(/^\d+/, '').toUpperCase();
  return { legislature_number: legislature, session_code: sessionCode, bill_type: billType, bill_number: Number(match[2]) };
}
function normalizeStatus(actions) {
  const text = actions.map((a) => a.action_text).join(' | ').toLowerCase();
  const rules = [
    ['vetoed', 'Vetoed', /vetoed by the governor/], ['signed', 'Signed by governor', /signed by the governor|governor signed/],
    ['became-law', 'Became law', /effective|became law|filed without signature/], ['sent-to-governor', 'Sent to governor', /sent to the governor/],
    ['passed-senate', 'Passed Senate', /passed senate/], ['passed-house', 'Passed House', /passed house/],
    ['in-committee', 'In committee', /referred to|committee/],
  ];
  const hit = rules.find(([, , pattern]) => pattern.test(text)); return hit ? { code: hit[0], label: hit[1] } : { code: 'filed', label: 'Filed' };
}
function parseBill(xml, sourceUrl, session) {
  const identity = billIdentity(xml, sourceUrl, session); if (!identity) return null;
  const actionBlocks = blocks(xml, ['action', 'billAction', 'historyAction']);
  const actions = actionBlocks.map((part, index) => ({
    action_date: isoDate(value(part, ['actionDate', 'date'])), action_sequence: index,
    chamber: value(part, ['chamber', 'actionChamber'])?.toLowerCase() || null,
    action_code: value(part, ['actionCode', 'code']), action_text: normalizeActionText(part),
    source_url: sourceUrl,
  })).filter((a) => a.action_date && a.action_text);
  const status = normalizeStatus(actions);
  const caption = value(xml, ['caption', 'billCaption', 'description', 'title']) || `${identity.bill_type.toUpperCase()} ${identity.bill_number}`;
  const chamber = identity.bill_type.startsWith('h') ? 'house' : identity.bill_type.startsWith('s') ? 'senate' : 'joint';
  const structuredSponsors = blocks(xml, ['author', 'coauthor', 'sponsor', 'cosponsor', 'billAuthor', 'billSponsor']).map((part, index) => {
    const name = value(part, ['name', 'memberName', 'authorName', 'sponsorName']) || decode(part.replace(/<[^>]+>/g, ' '));
    const role = value(part, ['role', 'type']) || 'author';
    return { sponsor_name: name, sponsor_slug: slug(name), sponsor_role: role.toLowerCase(), chamber: value(part, ['chamber'])?.toLowerCase() || chamber,
      district: value(part, ['district', 'districtNumber']), party: value(part, ['party']), external_legislator_id: value(part, ['memberId', 'legislatorId']), sequence: index };
  }).filter((s) => s.sponsor_name);
  const listSponsors = [
    ['authors', 'author'], ['coauthors', 'coauthor'], ['sponsors', 'sponsor'], ['cosponsors', 'cosponsor'],
  ].flatMap(([element, role]) => (value(xml, [element]) || '').split('|').map((name) => name.trim()).filter(Boolean).map((name) => ({
    sponsor_name: name, sponsor_slug: slug(name), sponsor_role: role, chamber, sequence: 0,
  })));
  const sponsors = [...new Map([...structuredSponsors, ...listSponsors].map((record) => [`${record.sponsor_role}:${record.sponsor_name}`, record])).values()]
    .map((record, sequence) => ({ ...record, sequence }));
  const structuredCommittees = blocks(xml, ['committee', 'committeeAction']).map((part, index) => ({
    committee_name: value(part, ['committeeName', 'name']) || decode(part.replace(/<[^>]+>/g, ' ')),
    chamber: value(part, ['chamber'])?.toLowerCase() || chamber, action_type: value(part, ['actionType', 'type']),
    action_description: value(part, ['description', 'actionDescription']), referred_date: isoDate(value(part, ['referredDate', 'date'])), sequence: index, source_url: sourceUrl,
  })).filter((c) => c.committee_name);
  const listedCommittees = [...xml.matchAll(/<(house|senate)\b[^>]*\bname=["']([^"']+)["'][^>]*\bstatus=["']([^"']*)["'][^>]*\/?\s*>/gi)].map((match, index) => ({
    committee_name: decode(match[2]), chamber: match[1].toLowerCase(), action_type: match[3] || null,
    action_description: match[3] || null, referred_date: null, sequence: index, source_url: sourceUrl,
  })).filter((committee) => committee.committee_name);
  const committees = [...new Map([...structuredCommittees, ...listedCommittees].map((record) => [`${record.chamber}:${record.committee_name}`, record])).values()]
    .map((record, sequence) => ({ ...record, sequence }));
  return {
    bill: { ...identity, chamber, caption, description: value(xml, ['description', 'summary']), current_status_code: status.code, current_status_label: status.label,
      current_status_description: actions.at(-1)?.action_text || null, introduced_date: isoDate(value(xml, ['filedDate', 'introducedDate'])),
      last_action_date: actions.map((a) => a.action_date).sort().at(-1) || null, became_law: ['signed', 'became-law'].includes(status.code), is_active: true,
      source_url: value(xml, ['sourceUrl', 'billUrl']) || sourceUrl, bill_text_url: value(xml, ['billTextUrl', 'textUrl', 'WebPDFURL']), fiscal_note_url: value(xml, ['fiscalNoteUrl']), analysis_url: value(xml, ['analysisUrl']), last_synced_at: new Date().toISOString() },
    actions, sponsors, committees,
    agencies: [...new Map(values(xml, ['affectedAgency', 'agencyName', 'stateAgency']).map((name) => [slug(name), { name, slug: slug(name) }])).values()],
  };
}

async function discover(session) {
  const indexUrl = `${TLO_BULK_ROOT}/${session}/billhistory/history.xml`;
  const xml = await transferText(indexUrl);
  const paths = new Set([...xml.matchAll(/(?:href=["']|>)([^"'<]*?(?:HB|SB|HJR|SJR|HCR|SCR|HR|SR)\d{5}\.xml)/gi)].map((m) => new URL(m[1].replace(/^\.?\//, ''), `${indexUrl}/../`).href));
  const urls = paths.size ? [...paths].slice(0, maxRecords || undefined) : await discoverFromDirectories(`${TLO_BULK_ROOT}/${session}/billhistory`);
  return { indexUrl, indexHash: hash(xml), urls };
}

// The run table only allows running/completed/completed_with_warnings/failed, so an execution-ceiling
// stop is recorded as `failed` with an explicit reason while its cursor stays resumable.
const interruptedPatch = () => ({ status: 'failed', completed_at: new Date().toISOString() });
const HOST = hostname();
const processAlive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };

const sessionParts = (session) => ({ legislature_number: Number(session.match(/^\d+/)[0]), session_code: session.replace(/^\d+/, '').toUpperCase() });
const sourceRecordKeyFor = (session, sourceUrl) => `${session}:${sourceUrl.split('/').at(-1)}`;

/** Load every stored source record for the session so restarts never re-download unchanged files. */
async function loadSourceRecords(session) {
  const map = new Map();
  if (dryRun) return map;
  for (let offset = 0; ; offset += 1000) {
    const response = await rest(`legislative_source_records?source_key=eq.${SOURCE_KEY}&select=source_record_key,content_hash,last_imported_at&order=source_record_key.asc&offset=${offset}&limit=1000`);
    const rows = await response.json();
    for (const row of rows) if (row.source_record_key?.startsWith(`${session}:`)) map.set(row.source_record_key, row);
    if (rows.length < 1000) break;
  }
  return map;
}

/** Import the session row and reconcile committees up front so those tables never stay empty. */
async function importSessionAndCommittees(session) {
  if (dryRun) return null;
  const parts = sessionParts(session);
  const suffix = { R: 'Regular Session', '1': 'First Called Session', '2': 'Second Called Session', '3': 'Third Called Session' }[parts.session_code] || `Session ${parts.session_code}`;
  const [sessionRow] = await upsert('legislative_sessions', [{
    ...parts, session_name: `${parts.legislature_number}th Texas Legislature ${suffix}`,
    session_type: parts.session_code === 'R' ? 'regular' : 'special',
    source_url: `${TLO_BULK_ROOT}/${session}/billhistory/history.xml`,
  }], 'legislature_number,session_code');
  await reconcileCommitteesFromHistory(session, sessionRow);
  return sessionRow;
}

/** Promote committee names already stored on bill history rows into canonical committee records. */
async function reconcileCommitteesFromHistory(session, sessionRow) {
  const parts = sessionParts(session);
  const billIds = new Set();
  for (let offset = 0; ; offset += 1000) {
    const response = await rest(`bills?legislature_number=eq.${parts.legislature_number}&session_code=eq.${parts.session_code}&select=id&order=id.asc&offset=${offset}&limit=1000`);
    const rows = await response.json();
    rows.forEach((row) => billIds.add(row.id));
    if (rows.length < 1000) break;
  }
  if (!billIds.size) return;
  const pending = new Map();
  for (let offset = 0; ; offset += 1000) {
    const response = await rest(`bill_committee_history?select=id,bill_id,chamber,committee_name,committee_id&committee_id=is.null&order=id.asc&offset=${offset}&limit=1000`);
    const rows = await response.json();
    for (const row of rows) {
      if (!billIds.has(row.bill_id) || !row.committee_name) continue;
      const key = `${row.chamber}:${slug(row.committee_name)}`;
      if (!pending.has(key)) pending.set(key, { chamber: row.chamber, committee_name: row.committee_name, rows: [] });
      pending.get(key).rows.push(row.id);
    }
    if (rows.length < 1000) break;
  }
  if (!pending.size) return;
  const committeeRows = [...pending.values()].map((entry) => ({
    ...parts, chamber: ['house', 'senate', 'joint'].includes(entry.chamber) ? entry.chamber : 'joint',
    committee_name: entry.committee_name, committee_slug: slug(entry.committee_name),
    source_url: sessionRow?.source_url || null,
  }));
  const saved = await upsert('legislative_committees', committeeRows, 'legislature_number,session_code,chamber,committee_slug');
  const byKey = new Map((saved || []).map((row) => [`${row.chamber}:${row.committee_slug}`, row.id]));
  for (const entry of pending.values()) {
    const chamber = ['house', 'senate', 'joint'].includes(entry.chamber) ? entry.chamber : 'joint';
    const committeeId = byKey.get(`${chamber}:${slug(entry.committee_name)}`);
    if (!committeeId) continue;
    for (let index = 0; index < entry.rows.length; index += 100) {
      const batch = entry.rows.slice(index, index + 100);
      await rest(`bill_committee_history?id=in.(${batch.join(',')})`, { method: 'PATCH', body: JSON.stringify({ committee_id: committeeId }) });
    }
  }
}

async function ensureCommittee(session, sessionRow, chamber, committeeName, committeeCache) {
  const parts = sessionParts(session);
  const normalizedChamber = ['house', 'senate', 'joint'].includes(chamber) ? chamber : 'joint';
  const key = `${normalizedChamber}:${slug(committeeName)}`;
  if (committeeCache.has(key)) return committeeCache.get(key);
  const [row] = await upsert('legislative_committees', [{
    ...parts, chamber: normalizedChamber, committee_name: committeeName,
    committee_slug: slug(committeeName), source_url: sessionRow?.source_url || null,
  }], 'legislature_number,session_code,chamber,committee_slug');
  committeeCache.set(key, row?.id || null);
  return row?.id || null;
}

/**
 * Import one bill file. Children are written before the source record so an interrupted bill is
 * retried on the next run, and the persistent cursor only advances after this resolves.
 */
async function importBill(session, sourceUrl, context) {
  const { sessionRow, sourceRecords, committeeCache } = context;
  const sourceRecordKey = sourceRecordKeyFor(session, sourceUrl);
  const xml = await transferText(sourceUrl);
  const contentHash = hash(xml);
  const existing = sourceRecords.get(sourceRecordKey) || null;
  const nowIso = new Date().toISOString();
  if (existing?.content_hash === contentHash) {
    if (!dryRun) await upsert('legislative_source_records', [{ source_key: SOURCE_KEY, source_record_key: sourceRecordKey, source_url: sourceUrl, content_hash: contentHash, last_seen_at: nowIso, metadata: { session } }], 'source_key,source_record_key');
    sourceRecords.set(sourceRecordKey, { ...existing, last_imported_at: existing.last_imported_at || nowIso });
    return { result: 'unchanged' };
  }
  const parsed = parseBill(xml, sourceUrl, session); if (!parsed) throw new Error(`Could not identify bill in ${sourceUrl}`);
  if (sessionRow?.id) parsed.bill.legislative_session_id = sessionRow.id;
  const [bill] = await upsert('bills', [parsed.bill], 'legislature_number,session_code,bill_type,bill_number');
  if (!dryRun) {
    parsed.actions.forEach((row) => { row.bill_id = bill.id; });
    parsed.sponsors.forEach((row) => { row.bill_id = bill.id; });
    parsed.committees.forEach((row) => { row.bill_id = bill.id; });
    await upsert('bill_actions', parsed.actions, 'bill_id,action_date,action_sequence,action_text');
    await upsert('bill_sponsors', parsed.sponsors, 'bill_id,representative_id,external_legislator_id,sponsor_name,sponsor_role');
    for (const committee of parsed.committees) {
      committee.committee_id = await ensureCommittee(session, sessionRow, committee.chamber, committee.committee_name, committeeCache);
    }
    // Committee history lacks a natural unique constraint, so replace only automated rows from this source bill.
    await rest(`bill_committee_history?bill_id=eq.${bill.id}&source_url=eq.${encodeURIComponent(sourceUrl)}`, { method: 'DELETE' });
    if (parsed.committees.length) await rest('bill_committee_history', { method: 'POST', body: JSON.stringify(parsed.committees) });
    for (const agency of parsed.agencies) await linkAuthorities('bill', bill.id, 'government', agency.slug, 'affected-agency', 24, { source: 'official-bill-record', agencyName: agency.name });
    await upsert('legislative_source_records', [{ source_key: SOURCE_KEY, source_record_key: sourceRecordKey, source_url: sourceUrl, content_hash: contentHash, last_seen_at: nowIso, last_imported_at: nowIso, metadata: { session } }], 'source_key,source_record_key');
    sourceRecords.set(sourceRecordKey, { source_record_key: sourceRecordKey, content_hash: contentHash, last_imported_at: nowIso });
  }
  return { result: existing ? 'updated' : 'inserted' };
}

/**
 * Close out sync runs whose checkpoint proves no live process remains (sandbox reset or timeout),
 * and hand back the newest usable cursor so the next run continues instead of restarting.
 */
async function recoverAbandonedRuns(session) {
  const parts = sessionParts(session);
  const response = await rest(`legislative_sync_runs?legislature_number=eq.${parts.legislature_number}&session_code=eq.${parts.session_code}&order=started_at.desc&limit=25`);
  const runs = await response.json();
  const staleBefore = Date.now() - staleRunMinutes * 60 * 1000;
  let recovered = 0;
  for (const run of runs) {
    if (run.status !== 'running') continue;
    const heartbeat = new Date(run.cursor_after?.lastCheckpointAt || run.started_at).getTime();
    // Active means: a live pid on this host, or another host still checkpointing recently.
    const pid = Number(run.cursor_after?.pid || 0);
    const active = run.cursor_after?.host === HOST
      ? pid > 0 && processAlive(pid)
      : pid > 0 && heartbeat > staleBefore;
    if (active && !freshRun) {
      throw new Error(`A sync run for ${session} is still checkpointing (run ${run.id}); refusing to start a duplicate concurrent run.`);
    }
    await rest(`legislative_sync_runs?id=eq.${run.id}`, { method: 'PATCH', body: JSON.stringify({
      status: 'failed', completed_at: new Date().toISOString(),
      errors: [...(run.errors || []), { reason: 'sandbox_reset_or_timeout', detectedAt: new Date().toISOString() }],
    }) });
    recovered += 1;
  }
  const terminal = ['completed', 'completed_with_warnings'];
  const resumable = freshRun ? null : runs.find((run) => !terminal.includes(run.status) && Number(run.cursor_after?.position) > 0);
  return { recovered, cursor: resumable?.cursor_after || null };
}

await syncElectionRelationships();
let interrupted = false;

for (const session of sessions) {
  const parts = sessionParts(session);
  const recovery = dryRun ? { recovered: 0, cursor: null } : await recoverAbandonedRuns(session);
  if (recovery.recovered) console.log(`${session}: marked ${recovery.recovered} abandoned run(s) failed (sandbox_reset_or_timeout).`);

  const { urls, indexHash } = await discover(session);
  const manifestHash = hash(`${indexHash}:${urls.length}`);
  const resumeCursor = recovery.cursor?.manifestHash === manifestHash ? recovery.cursor : null;
  const totals = {
    processed: Number(resumeCursor?.processed || 0), inserted: Number(resumeCursor?.inserted || 0),
    updated: Number(resumeCursor?.updated || 0), unchanged: Number(resumeCursor?.unchanged || 0),
    skipped: Number(resumeCursor?.skipped || 0), errorCount: Number(resumeCursor?.errorCount || 0),
  };
  let position = Number(resumeCursor?.position || 0);
  const errors = [];
  const run = dryRun ? { id: null } : (await rest('legislative_sync_runs', { method: 'POST', body: JSON.stringify({
    ...parts, cursor_before: resumeCursor || {},
    cursor_after: { session, manifestHash, manifestSize: urls.length, position, ...totals, pid: process.pid, host: HOST, lastCheckpointAt: new Date().toISOString() },
  }) }).then((r) => r.json()))[0];
  console.log(`${session}: manifest ${urls.length} records, resuming at position ${position}${dryRun ? ' (dry run)' : ''}.`);

  const context = {
    sessionRow: await importSessionAndCommittees(session),
    sourceRecords: await loadSourceRecords(session),
    committeeCache: new Map(),
  };

  const checkpoint = async (extra = {}) => {
    if (dryRun || !run?.id) return;
    await rest(`legislative_sync_runs?id=eq.${run.id}`, { method: 'PATCH', body: JSON.stringify({
      records_seen: totals.processed, records_changed: totals.inserted + totals.updated,
      errors: errors.slice(-50),
      cursor_after: { session, manifestHash, manifestSize: urls.length, position, lastSourceUrl: urls[position - 1] || null, ...totals, pid: process.pid, host: HOST, lastCheckpointAt: new Date().toISOString() },
      ...extra,
    }) });
  };

  try {
    const recheckBefore = Date.now() - recheckDays * 24 * 60 * 60 * 1000;
    while (position < urls.length) {
      if (outOfTime()) { interrupted = true; break; }
      const url = urls[position];
      const stored = context.sourceRecords.get(sourceRecordKeyFor(session, url));
      const lastImported = stored?.last_imported_at ? new Date(stored.last_imported_at).getTime() : 0;
      if (stored?.content_hash && lastImported > recheckBefore) {
        // Proven already imported and recent: no download needed, but still refreshable on later runs.
        totals.skipped += 1; position += 1;
        if (position % 50 === 0) await checkpoint();
        continue;
      }
      try {
        const { result } = await importBill(session, url, context);
        totals[result] += 1; totals.processed += 1;
      } catch (error) {
        totals.errorCount += 1; errors.push({ url, message: error.message });
        console.error(`${session}: ${url} -> ${error.message}`);
      }
      position += 1;
      await checkpoint();
    }

    if (position >= urls.length) {
      await checkpoint({ status: errors.length ? 'completed_with_warnings' : 'completed', completed_at: new Date().toISOString() });
      if (!dryRun) {
        await reconcileCommitteesFromHistory(session, context.sessionRow);
        await rest('rpc/refresh_legislative_authority_graph', { method: 'POST', body: '{}' });
      }
      console.log(`${session}: COMPLETED — position ${position}/${urls.length}, inserted ${totals.inserted}, updated ${totals.updated}, unchanged ${totals.unchanged}, skipped ${totals.skipped}, errors ${totals.errorCount}${dryRun ? ' (dry run)' : ''}.`);
    } else {
      errors.push({ reason: 'execution_ceiling', position, at: new Date().toISOString() });
      await checkpoint(interruptedPatch());
      console.log(`${session}: INTERRUPTED at execution ceiling — checkpoint saved at position ${position}/${urls.length}. Re-run the same command to continue.`);
    }
  } catch (error) {
    console.error(`${session}: aborted — ${error.message}`);
    errors.push({ reason: 'aborted', message: error.message, at: new Date().toISOString() });
    await checkpoint(interruptedPatch()).catch((patchError) => console.error(`checkpoint write failed: ${patchError.message}`));
    throw error;
  }
}

if (interrupted) console.log('Execution ceiling reached: progress is checkpointed, re-run to continue.');
