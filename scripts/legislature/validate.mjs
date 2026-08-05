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
  'supabase/migrations/20260805044500_bill_subject_authority_sync.sql',
  'supabase/migrations/20260805121500_bill_article_authority_sync.sql',
  'src/lib/authority-relationships.ts',
  'src/lib/bills.ts',
  'src/lib/legislative-sitemaps.ts',
  'src/components/authority/RelatedAuthorityContent.tsx',
  'src/components/bills/BillDocumentsPanel.tsx',
  'src/components/bills/BillEditorialExplanation.tsx',
  'src/routes/bills/index.tsx',
  'src/routes/bills/subject/$subjectSlug.tsx',
  'src/routes/bills/texas/$legislature/$billType/$billNumber.tsx',
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

const subjectAuthorityMigration = sources.get('supabase/migrations/20260805044500_bill_subject_authority_sync.sql') || '';
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
for (const name of ['bills', 'representatives', 'committees', 'districts', 'government', 'legislature']) {
  if (!sitemapIndex.includes(`sitemap-${name}.xml`)) errors.push(`Sitemap index missing ${name}`);
}

const legislativeSitemaps = sources.get('src/lib/legislative-sitemaps.ts') || '';
for (const token of ['bill_subjects', '/bills/subject/']) {
  if (!legislativeSitemaps.includes(token)) errors.push(`Legislative sitemap data missing ${token}`);
}

const billRoute = sources.get('src/routes/bills/texas/$legislature/$billType/$billNumber.tsx') || '';
for (const token of [
  'canonicalBillPath',
  'RelatedAuthorityContent',
  'BillDocumentsPanel',
  'BillEditorialExplanation',
  '/representatives/',
  '/texas-legislature/committees/',
]) {
  if (!billRoute.includes(token)) errors.push(`Bill page missing ${token}`);
}
if (billRoute.includes('href={`/article/${article.slug}`}')) {
  errors.push('Bill page still links related articles to legacy /article URLs instead of /news URLs');
}

const subjectRoute = sources.get('src/routes/bills/subject/$subjectSlug.tsx') || '';
for (const token of ['bill_subject_relationships', 'canonicalBillPath', 'CollectionPage', 'noindex']) {
  if (!subjectRoute.includes(token)) errors.push(`Bill subject page missing ${token}`);
}

const billsIndex = sources.get('src/routes/bills/index.tsx') || '';
for (const token of ['legislature', 'chamber', 'billType', 'status', 'Clear filters']) {
  if (!billsIndex.includes(token)) errors.push(`Bills index missing ${token} filter support`);
}

const billsLib = sources.get('src/lib/bills.ts') || '';
for (const token of ['review_status', 'approved', 'getBillFilterOptions', 'STATUS_GROUPS']) {
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
