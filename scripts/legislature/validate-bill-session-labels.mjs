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

console.log('Bill session labeling validation passed.');
