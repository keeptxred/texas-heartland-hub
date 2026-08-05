#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const checks = [
  {
    file: 'src/lib/public-bill-relations.ts',
    required: [
      "from('bill_subject_relationships')",
      "from('bill_article_relationships')",
      ".eq('review_status', 'approved')",
    ],
  },
  {
    file: 'src/lib/related-bills.ts',
    required: [
      "from('bill_subject_relationships')",
      ".eq('review_status', 'approved')",
    ],
  },
  {
    file: 'src/routes/bills/texas/$legislature/$billType/$billNumber.tsx',
    required: [
      "getPublicBillRelations",
    ],
  },
];

const errors = [];
for (const check of checks) {
  const source = await readFile(check.file, 'utf8');
  for (const token of check.required) {
    if (!source.includes(token)) errors.push(`${check.file} missing ${token}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Public legislative relationship filters validated.');
