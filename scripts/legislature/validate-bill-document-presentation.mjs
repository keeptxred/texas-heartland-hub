#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const files = {
  documents: await readFile('src/lib/bill-documents.ts', 'utf8'),
  panel: await readFile('src/components/bills/BillDocumentsPanel.tsx', 'utf8'),
};

const required = [
  [files.documents, 'isLegislativeAmendmentPrinting'],
  [files.documents, 'AMENDMENT_PRINTING_PATTERN'],
  [files.panel, 'Earlier versions and amendment printings'],
  [files.panel, 'amendmentCount'],
  [files.panel, 'legislativeDocumentLabel(document)'],
];

const errors = required
  .filter(([source, token]) => !source.includes(token))
  .map(([, token]) => `Missing required bill-document presentation token: ${token}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Bill document presentation validated.');
