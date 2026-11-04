#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
const panel = await readFile('src/components/bills/BillDetailPanel.tsx', 'utf8');
const component = await readFile('src/components/bills/BillHearingsAndVotes.tsx', 'utf8');
const errors = [];
for (const token of ["import { BillHearingsAndVotes }", '<BillHearingsAndVotes activities={committees} />']) {
  if (!panel.includes(token)) errors.push(`Bill detail panel missing ${token}`);
}
for (const token of ['hearing_date', 'vote_date', 'vote margin']) {
  if (!component.includes(token)) errors.push(`Hearings/votes component missing ${token}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('In-page bill hearings and votes presentation validated.');
