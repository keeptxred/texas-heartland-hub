import { readFile } from 'node:fs/promises';

const files = [
  'src/services/legislativeBackfill.functions.ts',
  'src/services/billRelationshipReview.functions.ts',
  'src/services/legislativeOpportunity.functions.ts',
  'src/services/billEditorialEnrichment.functions.ts',
  'src/services/billEditorialReview.functions.ts',
  'src/routes/admin/bills/backfill.tsx',
  'src/routes/admin/bills/opportunities.tsx',
  'src/routes/admin/bills/relationships.tsx',
  'src/routes/admin/bills/enrichment.tsx',
];

const forbidden = [
  "ADMIN_PASSCODE ?? 'keeptxred'",
  "ADMIN_PASSCODE || 'keeptxred'",
  "VITE_ADMIN_PASSCODE as string) || 'keeptxred'",
  "VITE_ADMIN_PASSCODE as string) ?? 'keeptxred'",
];

const failures = [];
for (const file of files) {
  const source = await readFile(file, 'utf8');
  for (const token of forbidden) {
    if (source.includes(token)) failures.push(`${file} contains forbidden fallback: ${token}`);
  }

  if (file.startsWith('src/services/') && source.includes('ADMIN_PASSCODE')) {
    const hasFailClosedCheck = source.includes('Boolean(expected && token && token === expected)');
    if (!hasFailClosedCheck) failures.push(`${file} must fail closed when ADMIN_PASSCODE is unset.`);
  }

  if (file.startsWith('src/routes/admin/bills/') && source.includes('VITE_ADMIN_PASSCODE')) {
    if (!source.includes("?.trim() ?? ''")) failures.push(`${file} must use an empty passcode when VITE_ADMIN_PASSCODE is unset.`);
    if (!source.includes('PASSCODE &&')) failures.push(`${file} must refuse client-side unlock when no passcode is configured.`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated fail-closed admin authentication across ${files.length} legislative files.`);
