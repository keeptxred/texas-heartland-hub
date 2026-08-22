import fs from 'node:fs';
import path from 'node:path';

const workflowDir = '.github/workflows';
const findings = [];

for (const name of fs.readdirSync(workflowDir).filter((value) => /\.ya?ml$/i.test(value)).sort()) {
  const file = path.join(workflowDir, name);
  const source = fs.readFileSync(file, 'utf8');
  const matches = [];
  for (const pattern of [
    /git\s+push(?:\s+--[a-z-]+(?:=[^\s]+)?)*\s+origin\s+["']?HEAD:main["']?/gi,
    /git\s+push(?:\s+--[a-z-]+(?:=[^\s]+)?)*\s+origin\s+["']?main["']?(?=\s|$)/gim,
  ]) {
    for (const match of source.matchAll(pattern)) matches.push(match[0].replace(/\s+/g, ' ').trim());
  }

  const checksOutMain = /\bref:\s*["']?main["']?\s*$/m.test(source);
  if (checksOutMain) {
    for (const line of source.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (/^git\s+push(?:\s+origin)?\s*$/.test(trimmed)) matches.push(trimmed);
    }
  }

  if (matches.length) findings.push({ file, matches: [...new Set(matches)] });
}

if (findings.length) {
  console.error('Protected-main write policy failed. Workflows must publish generated repository changes through same-repository PRs so the required verify check can gate the merge:');
  for (const finding of findings) {
    console.error(`- ${finding.file}`);
    for (const match of finding.matches) console.error(`    ${match}`);
  }
  process.exit(1);
}

console.log('Protected-main write policy passed: no GitHub Actions workflow writes generated repository changes directly to main.');
