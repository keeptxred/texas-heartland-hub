import { readFile } from 'node:fs/promises';

const requiredFiles = [
  'scripts/legislature/sync-texas-legislation.mjs',
  'supabase/migrations/20260731190000_legislative_authority_graph.sql',
  'supabase/migrations/20260803204500_bill_relationship_automation.sql',
  'supabase/migrations/20260803223000_bill_editorial_enrichments.sql',
  'supabase/migrations/20260803231500_legislative_content_opportunities.sql',
  'src/lib/authority-relationships.ts',
  'src/lib/bills.ts',
  'src/components/authority/RelatedAuthorityContent.tsx',
  'src/components/bills/BillDocumentsPanel.tsx',
  'src/components/bills/BillEditorialExplanation.tsx',
  'src/routes/bills/index.tsx',
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

const editorialMigration = sources.get('supabase/migrations/20260803223000_bill_editorial_enrichments.sql') || '';
for (const token of ['bill_editorial_enrichments', 'source_document_ids', 'review_status', 'approved']) {
  if (!editorialMigration.includes(token)) errors.push(`Editorial migration missing ${token}`);
}

const opportunityMigration = sources.get('supabase/migrations/20260803231500_legislative_content_opportunities.sql') || '';
for (const token of ['legislative_content_opportunities', 'dedupe_key', 'refresh_legislative_content_opportunities']) {
  if (!opportunityMigration.includes(token)) errors.push(`Opportunity migration missing ${token}`);
}

const importer = sources.get('scripts/legislature/sync-texas-legislation.mjs') || '';
for (const token of ['ftp.legis.state.tx.us', 'history.xml', 'content_hash', 'SUPABASE_SERVICE_ROLE_KEY', 'refresh_legislative_authority_graph']) {
  if (!importer.includes(token)) errors.push(`Importer missing ${token}`);
}

const sitemapIndex = await readFile('src/routes/sitemap[.]xml.ts', 'utf8');
for (const name of ['bills', 'representatives', 'committees', 'districts', 'government', 'legislature']) {
  if (!sitemapIndex.includes(`sitemap-${name}.xml`)) errors.push(`Sitemap index missing ${name}`);
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
