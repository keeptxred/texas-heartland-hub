import fs from 'node:fs';

const checks = [
  ['src/routes/bills/index.tsx', ['billSessionLabel', 'Regular Session', 'Called Session', 'item.label.replace(/\\s+·\\s+.+$/, \'\')']],
  ['src/routes/bills/texas/$legislature/index.tsx', ['billSessionLabel', 'Regular Session', 'Called Session', 'reused bill numbers remain distinguishable']],
  ['src/routes/bills/texas/$legislature/$billType/index.tsx', ['billSessionLabel', 'Regular Session', 'Called Session', 'remain distinct']],
];

for (const [file, tokens] of checks) {
  const source = fs.readFileSync(file, 'utf8');
  for (const token of tokens) {
    if (!source.includes(token)) {
      throw new Error(`${file} is missing required session-label token: ${token}`);
    }
  }
}

console.log('Bill directory session labeling validation passed.');
