#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const files = {
  parser: await readFile('scripts/legislature/parse-official-document.mjs', 'utf8'),
  summary: await readFile('src/lib/bill-analysis-summary.ts', 'utf8'),
  panel: await readFile('src/components/bills/BillDocumentsPanel.tsx', 'utf8'),
};

const required = [
  [files.parser, 'background_and_purpose'],
  [files.parser, 'rulemaking_authority'],
  [files.parser, 'criminal_justice_impact'],
  [files.summary, "document_type !== 'analysis'"],
  [files.summary, 'metadata?.structured'],
  [files.panel, 'Committee analysis at a glance'],
  [files.panel, 'does not replace the complete document'],
];

const errors = required
  .filter(([source, token]) => !source.includes(token))
  .map(([, token]) => `Missing required bill-analysis token: ${token}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Bill analysis summary presentation validated.');
