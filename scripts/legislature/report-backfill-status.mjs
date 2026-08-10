#!/usr/bin/env node

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));
const session = String(args.session || args.sessions || process.env.TLO_SESSIONS || '89R').split(',')[0].trim();
const legislatureNumber = Number(session.match(/^\d+/)?.[0]);
const sessionCode = session.replace(/^\d+/, '').toUpperCase();
const requiredSubjectVersion = Number(args['subject-version'] || 2);
const requireComplete = Boolean(args['require-complete']);

if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}
if (!Number.isFinite(legislatureNumber) || !sessionCode) {
  throw new Error(`Invalid session: ${session}`);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  Prefer: 'count=exact',
};

async function exactCount(path) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'HEAD',
    headers,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${path}`);
  }
  const range = response.headers.get('content-range') || '';
  const total = Number(range.split('/')[1]);
  if (!Number.isFinite(total)) throw new Error(`Missing exact count for ${path}`);
  return total;
}

async function loadSourceRecords() {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const query = new URLSearchParams({
      source_key: 'eq.texas-legislature-online',
      source_record_key: `like.${session}:%`,
      select: 'source_record_key,metadata',
      order: 'source_record_key.asc',
      offset: String(offset),
      limit: '1000',
    });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/legislative_source_records?${query}`, {
      headers: { ...headers, Prefer: 'return=representation' },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: legislative_source_records`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return rows;
}

const sessionFilter = `legislature_number=eq.${legislatureNumber}&session_code=eq.${sessionCode}`;
const [
  bills,
  subjects,
  subjectRelationships,
  approvedSubjectRelationships,
  articleRelationships,
  approvedArticleRelationships,
  authorityRelationships,
  sourceRecords,
] = await Promise.all([
  exactCount(`bills?${sessionFilter}&select=id`),
  exactCount('bill_subjects?select=id'),
  exactCount('bill_subject_relationships?select=bill_id'),
  exactCount('bill_subject_relationships?review_status=eq.approved&select=bill_id'),
  exactCount('bill_article_relationships?select=bill_id'),
  exactCount('bill_article_relationships?review_status=eq.approved&select=bill_id'),
  exactCount('authority_relationships?source_type=eq.bill&select=id'),
  loadSourceRecords(),
]);

const pendingSubjectRecords = sourceRecords.filter(
  (record) => Number(record.metadata?.subjectsImportedVersion || 0) < requiredSubjectVersion,
).length;
const checkedSubjectRecords = sourceRecords.length - pendingSubjectRecords;

const report = {
  session,
  legislatureNumber,
  sessionCode,
  generatedAt: new Date().toISOString(),
  bills,
  subjects,
  subjectRelationships,
  approvedSubjectRelationships,
  articleRelationships,
  approvedArticleRelationships,
  billAuthorityRelationships: authorityRelationships,
  officialSourceRecords: sourceRecords.length,
  checkedSubjectRecords,
  pendingSubjectRecords,
  requiredSubjectVersion,
  subjectBackfillComplete: pendingSubjectRecords === 0,
};

console.log(JSON.stringify(report, null, 2));

if (requireComplete && pendingSubjectRecords > 0) {
  process.exitCode = 2;
}
