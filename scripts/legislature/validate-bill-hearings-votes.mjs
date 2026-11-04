#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const route = await readFile('src/components/bills/BillDetailPanel.tsx', 'utf8');
const component = await readFile('src/components/bills/BillHearingsAndVotes.tsx', 'utf8');

const errors = [];
for (const token of [
  "import { BillHearingsAndVotes }",
  '<BillHearingsAndVotes activities={committees} />',
]) {
  if (!route.includes(token)) errors.push(`In-page bill reader missing ${token}`);
}
for (const token of ['hearing_date', 'vote_date', 'vote margin']) {
  if (!component.includes(token)) errors.push(`Hearings/votes component missing ${token}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Bill hearings and votes presentation validated.');
