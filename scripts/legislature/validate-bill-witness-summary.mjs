#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const files = {
  parser: await readFile('scripts/legislature/parse-official-document.mjs', 'utf8'),
  resolver: await readFile('src/lib/bill-witness-summary.ts', 'utf8'),
  panel: await readFile('src/components/bills/BillDocumentsPanel.tsx', 'utf8'),
};

const required = [
  [files.parser, 'parseWitnessList'],
  [files.parser, 'testimony_type'],
  [files.parser, 'position'],
  [files.resolver, "document_type === 'witness_list'"],
  [files.resolver, 'registeringCount'],
  [files.resolver, 'testifyingCount'],
  [files.panel, 'Committee witness record'],
  [files.panel, 'View official witness roster'],
  [files.panel, 'Registration does not establish the committee vote or final outcome'],
];

const errors = required
  .filter(([source, token]) => !source.includes(token))
  .map(([, token]) => `Missing required witness-summary token: ${token}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Bill witness summary validated.');
