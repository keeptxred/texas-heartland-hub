import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const forbidden = [
  ['lova', 'ble'].join(''),
  ['__', 'l5e'].join(''),
  ['gpt', 'engineer'].join(''),
  ['gpt', '-engineer'].join(''),
  ['lova', 'ble-core-prod'].join(''),
  ['lova', 'ble.dev'].join(''),
  ['lova', 'ble.app'].join(''),
  ['lova', 'ble-api-key'].join(''),
  ['indexing', '.googleapis.com'].join(''),
  ['www.googleapis.com/auth/', 'indexing'].join(''),
  ['submit-google-', 'job-url'].join(''),
  ['google-job-', 'posting-urls'].join(''),
];

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

const violations = [];
for (const file of tracked) {
  const lowerPath = file.toLowerCase();
  for (const term of forbidden) {
    if (lowerPath.includes(term)) violations.push(`path:${file}:${term}`);
  }

  let buffer;
  try {
    buffer = fs.readFileSync(file);
  } catch {
    continue;
  }
  if (buffer.includes(0)) continue;

  const text = buffer.toString('utf8').toLowerCase();
  for (const term of forbidden) {
    if (text.includes(term)) violations.push(`content:${file}:${term}`);
  }
}

if (violations.length) {
  console.error('Retired integration trace validation failed:');
  for (const violation of [...new Set(violations)].sort()) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`Retired integration trace validation passed across ${tracked.length} tracked files.`);
