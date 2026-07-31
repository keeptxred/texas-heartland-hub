import { readFile } from 'node:fs/promises';

const requiredFiles = [
  'scripts/legislature/sync-texas-legislation.mjs',
  'supabase/migrations/20260731190000_legislative_authority_graph.sql',
  'src/lib/authority-relationships.ts',
  'src/components/authority/RelatedAuthorityContent.tsx',
  'src/routes/sitemap-bills[.]xml.ts',
  'src/routes/sitemap-representatives[.]xml.ts',
  'src/routes/sitemap-committees[.]xml.ts',
  'src/routes/sitemap-districts[.]xml.ts',
  'src/routes/sitemap-government[.]xml.ts',
  'src/routes/sitemap-legislature[.]xml.ts',
];
const errors = [];
const sources = new Map();
for (const file of requiredFiles) { try { sources.set(file, await readFile(file, 'utf8')); } catch { errors.push(`Missing ${file}`); } }
const migration = sources.get(requiredFiles[1]) || '';
for (const token of ['legislative_sync_runs', 'legislative_source_records', 'authority_relationships', 'upsert_bidirectional_authority_relationship', 'related_authority_content', 'refresh_legislative_authority_graph']) if (!migration.includes(token)) errors.push(`Migration missing ${token}`);
const importer = sources.get(requiredFiles[0]) || '';
for (const token of ['ftp.legis.state.tx.us', 'history.xml', 'content_hash', 'SUPABASE_SERVICE_ROLE_KEY', 'refresh_legislative_authority_graph']) if (!importer.includes(token)) errors.push(`Importer missing ${token}`);
const index = await readFile('src/routes/sitemap[.]xml.ts', 'utf8');
for (const name of ['bills','representatives','committees','districts','government','legislature']) if (!index.includes(`sitemap-${name}.xml`)) errors.push(`Sitemap index missing ${name}`);
const billRoute = await readFile('src/routes/bills/texas/$legislature/$billType/$billNumber.tsx', 'utf8');
const representativeRoute = await readFile('src/routes/representatives.$representativeSlug.tsx', 'utf8');
for (const [name, source] of [['bill', billRoute], ['representative', representativeRoute]]) if (!source.includes('RelatedAuthorityContent')) errors.push(`${name} authority page missing scored related content`);
if (errors.length) { console.error(errors.map((error) => `- ${error}`).join('\n')); process.exit(1); }
console.log('Legislative authority validation passed.');
