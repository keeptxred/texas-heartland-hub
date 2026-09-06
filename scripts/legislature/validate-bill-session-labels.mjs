import fs from 'node:fs';

const checks = [
  ['src/lib/bill-public-path.ts', ['publicBillSessionLabel', 'Regular Session', 'Called Session']],
  ['src/routes/bills/index.tsx', ['billSessionLabel', 'Regular Session', 'Called Session', 'item.label.replace(/\\s+·\\s+.+$/, \'\')']],
  ['src/routes/bills/texas/$legislature/index.tsx', ['billSessionLabel', 'Regular Session', 'Called Session', 'reused bill numbers remain distinguishable']],
  ['src/routes/bills/texas/$legislature/$billType/index.tsx', ['billSessionLabel', 'Regular Session', 'Called Session', 'remain distinct']],
  ['src/routes/bills/texas/$legislature/$billType/$billNumber.tsx', ['publicBillSessionLabel', 'bill.legislature_number', 'bill.session_code']],
  ['src/routes/bills/texas/$legislature/$session/$billType/$billNumber.tsx', ['publicBillSessionLabel', 'bill.legislature_number', 'bill.session_code']],
];

for (const [file, tokens] of checks) {
  const source = fs.readFileSync(file, 'utf8');
  for (const token of tokens) {
    if (!source.includes(token)) {
      throw new Error(`${file} is missing required session-label token: ${token}`);
    }
  }
}

const hb1056Migration = fs.readFileSync('supabase/migrations/20260906220000_add_hb1056_structured_effective_dates.sql', 'utf8');
for (const token of ["bill_number = 1056", "date '2026-09-01'", "date '2027-05-01'", 'Section 2116.101', 'electronic transactional currency framework']) {
  if (!hb1056Migration.includes(token)) throw new Error(`HB 1056 structured effective-date migration is missing: ${token}`);
}

console.log('Bill session labeling and HB 1056 closure validation passed.');
