import { readFile } from 'node:fs/promises';

const requiredFiles = [
  'scripts/legislature/run-sync.mjs',
  'scripts/legislature/sync-texas-legislation.mjs',
  'scripts/legislature/sync-bill-subjects.mjs',
  'scripts/legislature/link-bill-relationships.mjs',
  'supabase/migrations/20260731190000_legislative_authority_graph.sql',
  'supabase/migrations/20260803204500_bill_relationship_automation.sql',
  'supabase/migrations/20260803223000_bill_editorial_enrichments.sql',
  'supabase/migrations/20260803231500_legislative_content_opportunities.sql',
  'supabase/migrations/20260805050000_bill_subject_authority_edges.sql',
  'supabase/migrations/20260805121500_bill_article_authority_sync.sql',
  'src/lib/authority-relationships.ts',
  'src/lib/bills.ts',
  'src/lib/bill-subjects.ts',
  'src/lib/bill-hierarchy.ts',
  'src/lib/legislative-sitemaps.ts',
  'src/components/authority/RelatedAuthorityContent.tsx',
  'src/components/bills/BillDocumentsPanel.tsx',
  'src/components/bills/BillEditorialExplanation.tsx',
  'src/routes/bills/index.tsx',
  'src/components/bills/BillDetailPanel.tsx',
  'src/routes/api/public/bill-detail.ts',
  'src/lib/retired-bill-documents.ts',
  'src/start.ts',
  'src/routes/admin/bills/relationships.tsx',
  'src/routes/admin/bills/enrichment.tsx',
  'src/routes/admin/bills/opportunities.tsx',
  'src/routes/sitemap-bills[.]xml.ts',
  'src/routes/sitemap-representatives[.]xml.ts',
  'src/routes/sitemap-committees[.]xml.ts',
  'src/routes/sitemap-districts[.]xml.ts',
  'src/routes/sitemap-government[.]xml.ts',
  'src/routes/sitemap-legislature[.]xml.ts',
];

const errors = [];
const sources = new Map();
for (const file of requiredFiles) {
  try {
    sources.set(file, await readFile(file, 'utf8'));
  } catch {
    errors.push(`Missing ${file}`);
  }
}

const authorityMigration = sources.get('supabase/migrations/20260731190000_legislative_authority_graph.sql') || '';
for (const token of [
  'legislative_sync_runs',
  'legislative_source_records',
  'authority_relationships',
  'upsert_bidirectional_authority_relationship',
  'related_authority_content',
  'refresh_legislative_authority_graph',
]) {
  if (!authorityMigration.includes(token)) errors.push(`Authority migration missing ${token}`);
}

const relationshipMigration = sources.get('supabase/migrations/20260803204500_bill_relationship_automation.sql') || '';
for (const token of [
  'review_status',
  'confidence',
  'refresh_bill_relationships',
  'explicit-bill-identifier-v1',
]) {
  if (!relationshipMigration.includes(token)) errors.push(`Relationship migration missing ${token}`);
}

const subjectAuthorityMigration = sources.get('supabase/migrations/20260805050000_bill_subject_authority_edges.sql') || '';
for (const token of ['sync_bill_subject_authority_relationship', 'bill-subject', 'official-bill-subject-record']) {
  if (!subjectAuthorityMigration.includes(token)) errors.push(`Subject authority migration missing ${token}`);
}

const articleAuthorityMigration = sources.get('supabase/migrations/20260805121500_bill_article_authority_sync.sql') || '';
for (const token of [
  'preserve_official_bill_subject_relationship',
  'sync_bill_article_authority_relationship',
  'related-news',
  "new.review_status <> 'approved'",
]) {
  if (!articleAuthorityMigration.includes(token)) errors.push(`Article authority migration missing ${token}`);
}

const editorialMigration = sources.get('supabase/migrations/20260803223000_bill_editorial_enrichments.sql') || '';
for (const token of ['bill_editorial_enrichments', 'source_document_ids', 'review_status', 'approved']) {
  if (!editorialMigration.includes(token)) errors.push(`Editorial migration missing ${token}`);
}

const opportunityMigration = sources.get('supabase/migrations/20260803231500_legislative_content_opportunities.sql') || '';
for (const token of ['legislative_content_opportunities', 'dedupe_key', 'refresh_legislative_content_opportunities']) {
  if (!opportunityMigration.includes(token)) errors.push(`Opportunity migration missing ${token}`);
}

const orchestrator = sources.get('scripts/legislature/run-sync.mjs') || '';
for (const token of [
  'sync-texas-legislation.mjs',
  'sync-bill-subjects.mjs',
  'link-bill-relationships.mjs',
  '--skip-relationships',
]) {
  if (!orchestrator.includes(token)) errors.push(`Legislative sync orchestrator missing ${token}`);
}

const importer = sources.get('scripts/legislature/sync-texas-legislation.mjs') || '';
for (const token of ['ftp.legis.state.tx.us', 'history.xml', 'content_hash', 'SUPABASE_SERVICE_ROLE_KEY', 'refresh_legislative_authority_graph']) {
  if (!importer.includes(token)) errors.push(`Importer missing ${token}`);
}

const subjectImporter = sources.get('scripts/legislature/sync-bill-subjects.mjs') || '';
for (const token of [
  'official-tlo-subject-record-v1',
  'subjectsImportedVersion',
  'bill_subject_relationships',
  "is_manual: false",
  "review_status: 'approved'",
]) {
  if (!subjectImporter.includes(token)) errors.push(`Subject importer missing ${token}`);
}

const relationshipLinker = sources.get('scripts/legislature/link-bill-relationships.mjs') || '';
if (!relationshipLinker.includes("rpc('refresh_bill_relationships'")) {
  errors.push('Bill relationship linker does not call refresh_bill_relationships');
}

const sitemapIndex = await readFile('src/routes/sitemap[.]xml.ts', 'utf8');
for (const name of ['committees', 'government', 'legislature']) {
  if (!sitemapIndex.includes(`sitemap-${name}.xml`)) errors.push(`Sitemap index missing ${name}`);
}
// Bulk bill and district detail feeds remain unadvertised during crawl recovery.
// Unlike the former bulk representative feed, representative sitemap entries
// must now pass every source/evidence gate before individual publication.
for (const name of ['bills', 'districts']) {
  if (sitemapIndex.includes(`sitemap-${name}.xml`)) {
    errors.push(`Low-priority sitemap unexpectedly advertised: ${name}`);
  }
}
const representativeSitemap = await readFile('src/routes/sitemap-representatives[.]xml.ts', 'utf8');
if (!sitemapIndex.includes('sitemap-representatives.xml') ||
    !representativeSitemap.includes('certifyRepresentative(') ||
    !representativeSitemap.includes('state === "AUTHORITY_READY"')) {
  errors.push('Representative sitemap must advertise only quality-certified profiles, never a bulk inventory');
}

const legislativeSitemaps = sources.get('src/lib/legislative-sitemaps.ts') || '';
if (!legislativeSitemaps.includes("return [{ loc: absUrl('/bills') }]")) errors.push('Bill sitemap must contain only /bills');
if (legislativeSitemaps.includes('...hierarchyEntries') || legislativeSitemaps.includes('...sitemapBills')) errors.push('Legacy bill sitemap inventory still generated');

const detailApi = sources.get('src/routes/api/public/bill-detail.ts') || '';
for (const token of ['parseBillSearchKey', "getPublicBillRelations(bill.id)", "eq('session_code', identity.session_code)", "'X-Robots-Tag': 'noindex, follow'"]) {
  if (!detailApi.includes(token)) errors.push(`Bill detail API missing ${token}`);
}
const detailPanel = sources.get('src/components/bills/BillDetailPanel.tsx') || '';
for (const token of ['BillEditorialExplanation', 'BillDocumentsPanel', 'OfficialBillTextViewer', 'Sponsors and authors', 'Committee history', 'Legislative actions']) {
  if (!detailPanel.includes(token)) errors.push(`Bill reader missing ${token}`);
}
const retirement = sources.get('src/start.ts') || '';
if (!retirement.includes('isRetiredBillDocumentPath(url.pathname)') || !retirement.includes('status: 410')) errors.push('Legacy bill documents must return HTTP 410 before routing');
const retiredPathGuard = sources.get('src/lib/retired-bill-documents.ts') || '';
if (!retiredPathGuard.includes("normalized.startsWith('/bills/')")) errors.push('Retirement guard must cover all child bill paths');

const billsIndex = sources.get('src/routes/bills/index.tsx') || '';
const billsIndexContracts = [
  ["q: typeof search.q === 'string'", 'validated search query'],
  ["status: typeof search.status === 'string'", 'validated status query'],
  ['legislature: Math.max(0, Number(search.legislature) || 0)', 'validated legislature query'],
  ["chamber: typeof search.chamber === 'string'", 'validated chamber query'],
  ["billType: typeof search.billType === 'string'", 'validated bill-type query'],
  ['page: Math.max(1, Number(search.page) || 1)', 'validated page query'],
  ['status: deps.status', 'status query forwarding'],
  ['legislature: deps.legislature || undefined', 'legislature query forwarding'],
  ['chamber: deps.chamber', 'chamber query forwarding'],
  ['billType: deps.billType', 'bill-type query forwarding'],
  ['offset: (deps.page - 1) * 24', 'pagination offset'],
  ['name="legislature"', 'legislature control'],
  ['name="chamber"', 'chamber control'],
  ['name="billType"', 'bill-type control'],
  ['type="hidden" name="status"', 'status preservation during form submission'],
  ['status: value, page: 1', 'status links resetting pagination'],
  ['search={{ ...search, page: search.page - 1 }}', 'previous-page filter preservation'],
  ['search={{ ...search, page: search.page + 1 }}', 'next-page filter preservation'],
  ['BillDetailPanel', 'in-page detail viewer'],
  ['Clear filters', 'clear-filter control'],
];
for (const [token, label] of billsIndexContracts) {
  if (!billsIndex.includes(token)) errors.push(`Bills index missing ${label}`);
}

const billHierarchy = sources.get('src/lib/bill-hierarchy.ts') || '';
for (const [token, label] of [
  ['getLegislatureBillDirectory', 'Legislature hierarchy loader'],
  ['getBillTypePage', 'bill-type hierarchy loader'],
  ["rpc('get_legislature_bill_directory_summary'", 'compact Legislature directory summary RPC'],
  ['normalizeBillType', 'normalized bill-type hierarchy'],
  ['offset: (safePage - 1) * limit', 'bill-type hierarchy pagination'],
]) {
  if (!billHierarchy.includes(token)) errors.push(`Bill hierarchy data layer missing ${label}`);
}

const billsLib = sources.get('src/lib/bills.ts') || '';
const statusContracts = [
  ["filed: ['filed', 'introduced', 'received-by-secretary-of-senate']", 'Filed status group'],
  ["'in-committee': ['in-committee', 'referred-to-committee', 'scheduled-for-hearing', 'reported-from-committee']", 'In Committee status group'],
  ["passed: ['passed', 'passed-house', 'passed-senate', 'passed-both-chambers', 'enrolled']", 'Passed status group'],
  ["'sent-to-governor': ['sent-to-governor', 'presented-to-governor']", 'Sent to Governor status group'],
  ["signed: ['signed', 'became-law', 'effective']", 'Signed status group'],
  ["vetoed: ['vetoed']", 'Vetoed status group'],
  ["query.in('current_status_code', codes)", 'grouped-status database query'],
  ["query.eq('legislature_number', legislature)", 'legislature database query'],
  ["query.eq('chamber', chamber)", 'chamber database query'],
  ["query.eq('bill_type', normalizeBillType(billType))", 'bill-type database query'],
  ['getBillFilterOptions', 'filter-option loader'],
  ["rpc('list_active_bill_filter_options')", 'compact session-aware filter-option RPC'],
  ['new Map(rows.map', 'legislature/session option deduplication'],
];
for (const [token, label] of statusContracts) {
  if (!billsLib.includes(token)) errors.push(`Bills data layer missing ${label}`);
}

for (const token of ['review_status', 'approved']) {
  if (!billsLib.includes(token)) errors.push(`Bills data layer missing ${token}`);
}

const representativeRoute = await readFile('src/routes/representatives.$representativeSlug.tsx', 'utf8');
if (!representativeRoute.includes('RelatedAuthorityContent')) {
  errors.push('Representative authority page missing scored related content');
}

for (const adminRoute of [
  'src/routes/admin/bills/relationships.tsx',
  'src/routes/admin/bills/enrichment.tsx',
  'src/routes/admin/bills/opportunities.tsx',
]) {
  const source = sources.get(adminRoute) || '';
  if (!source.includes('ktr-admin-passcode')) errors.push(`${adminRoute} missing admin session gate`);
  if (!source.includes('noindex')) errors.push(`${adminRoute} missing noindex directive`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Legislative authority validation passed.');
