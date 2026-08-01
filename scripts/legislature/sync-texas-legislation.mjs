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
    ['vetoed', 'Vetoed', /veto/], ['signed', 'Signed by governor', /signed by the governor|governor signed/],
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
    action_code: value(part, ['actionCode', 'code']), action_text: value(part, ['actionDescription', 'description', 'actionText']) || decode(part.replace(/<[^>]+>/g, ' ')),
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

async function importBill(session, sourceUrl) {
  const xml = await transferText(sourceUrl);
  const sourceRecordKey = `${session}:${sourceUrl.split('/').at(-1)}`;
  const contentHash = hash(xml);
  const existing = dryRun ? null : await selectOne('legislative_source_records', `source_key=eq.${SOURCE_KEY}&source_record_key=eq.${encodeURIComponent(sourceRecordKey)}&select=content_hash`);
  if (existing?.content_hash === contentHash) return { changed: false };
  const parsed = parseBill(xml, sourceUrl, session); if (!parsed) throw new Error(`Could not identify bill in ${sourceUrl}`);
  const [bill] = await upsert('bills', [parsed.bill], 'legislature_number,session_code,bill_type,bill_number');
  if (!dryRun) {
    parsed.actions.forEach((row) => { row.bill_id = bill.id; });
    parsed.sponsors.forEach((row) => { row.bill_id = bill.id; });
    parsed.committees.forEach((row) => { row.bill_id = bill.id; });
    await upsert('bill_actions', parsed.actions, 'bill_id,action_date,action_sequence,action_text');
    await upsert('bill_sponsors', parsed.sponsors, 'bill_id,representative_id,external_legislator_id,sponsor_name,sponsor_role');
    // Committee history lacks a natural unique constraint, so replace only automated rows from this source bill.
    await rest(`bill_committee_history?bill_id=eq.${bill.id}&source_url=eq.${encodeURIComponent(sourceUrl)}`, { method: 'DELETE' });
    if (parsed.committees.length) await rest('bill_committee_history', { method: 'POST', body: JSON.stringify(parsed.committees) });
    for (const agency of parsed.agencies) await linkAuthorities('bill', bill.id, 'government', agency.slug, 'affected-agency', 24, { source: 'official-bill-record', agencyName: agency.name });
    await upsert('legislative_source_records', [{ source_key: SOURCE_KEY, source_record_key: sourceRecordKey, source_url: sourceUrl, content_hash: contentHash, last_seen_at: new Date().toISOString(), last_imported_at: new Date().toISOString(), metadata: { session } }], 'source_key,source_record_key');
  }
  return { changed: true };
}

await syncElectionRelationships();

for (const session of sessions) {
  const run = dryRun ? { id: null } : (await rest('legislative_sync_runs', { method: 'POST', body: JSON.stringify({ legislature_number: Number(session.match(/^\d+/)[0]), session_code: session.replace(/^\d+/, '').toUpperCase() }) }).then((r) => r.json()))[0];
  let seen = 0, changed = 0; const errors = [];
  try {
    const { urls } = await discover(session);
    for (const url of urls) {
      seen += 1;
      try { if ((await importBill(session, url)).changed) changed += 1; }
      catch (error) { errors.push({ url, message: error.message }); }
    }
    if (!dryRun) {
      await rest(`legislative_sync_runs?id=eq.${run.id}`, { method: 'PATCH', body: JSON.stringify({ completed_at: new Date().toISOString(), status: errors.length ? 'completed_with_warnings' : 'completed', records_seen: seen, records_changed: changed, cursor_after: { completedAt: new Date().toISOString() }, errors }) });
      await rest('rpc/refresh_legislative_authority_graph', { method: 'POST', body: '{}' });
    }
    if (errors.length) console.error(JSON.stringify(errors.slice(0, 10), null, 2));
    console.log(`${session}: ${seen} official records checked, ${changed} changed, ${errors.length} errors${dryRun ? ' (dry run)' : ''}.`);
  } catch (error) {
    if (!dryRun && run?.id) await rest(`legislative_sync_runs?id=eq.${run.id}`, { method: 'PATCH', body: JSON.stringify({ completed_at: new Date().toISOString(), status: 'failed', records_seen: seen, records_changed: changed, errors: [...errors, { message: error.message }] }) });
    throw error;
  }
}
