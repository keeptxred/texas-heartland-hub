#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const files = {
  parser: await readFile('scripts/legislature/parse-official-document.mjs', 'utf8'),
  impact: await readFile('src/lib/bill-fiscal-impact.ts', 'utf8'),
  panel: await readFile('src/components/bills/BillDocumentsPanel.tsx', 'utf8'),
};

const required = [
  [files.parser, 'source_agencies'],
  [files.parser, 'no_state_fiscal_implication'],
  [files.parser, 'no_local_fiscal_implication'],
  [files.impact, "document_type === 'fiscal_note'"],
  [files.impact, 'metadata?.structured'],
  [files.panel, 'Fiscal impact at a glance'],
  [files.panel, 'This summary is extracted from the official fiscal note'],
];

const errors = required
  .filter(([source, token]) => !source.includes(token))
  .map(([, token]) => `Missing required fiscal-impact token: ${token}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Bill fiscal impact presentation validated.');
