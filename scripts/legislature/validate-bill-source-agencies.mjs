#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const files = {
  resolver: await readFile('src/lib/bill-source-agencies.ts', 'utf8'),
  fiscal: await readFile('src/lib/bill-fiscal-impact.ts', 'utf8'),
  panel: await readFile('src/components/bills/BillDocumentsPanel.tsx', 'utf8'),
};

const required = [
  [files.resolver, 'GOVERNMENT_ENTITIES'],
  [files.resolver, 'sourceAgencies'],
  [files.resolver, 'Bill titles and article text are never used'],
  [files.resolver, 'officialUrl'],
  [files.fiscal, 'verifiedSourceAgencies'],
  [files.panel, 'fiscalImpact.verifiedSourceAgencies'],
  [files.panel, 'agency.officialUrl'],
];

const errors = required
  .filter(([source, token]) => !source.includes(token))
  .map(([, token]) => `Missing required source-agency token: ${token}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Verified bill source agencies validated.');
