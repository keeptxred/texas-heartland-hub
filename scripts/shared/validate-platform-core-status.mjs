import fs from 'node:fs';

const errors = [];
const required = [
  'src/shared/platform-core/contract.ts',
  'src/shared/platform-core/upstream.json',
  'src/shared/platform-core/consumer.json',
  'src/routes/api.platform-core-status.ts',
];
for (const path of required) if (!fs.existsSync(path)) errors.push(`Missing platform core status file: ${path}`);
if (!errors.length) {
  const upstream = JSON.parse(fs.readFileSync(required[1], 'utf8'));
  const consumer = JSON.parse(fs.readFileSync(required[2], 'utf8'));
  const contract = fs.readFileSync(required[0], 'utf8');
  const route = fs.readFileSync(required[3], 'utf8');
  if (upstream.version !== consumer.packageVersion) errors.push('Consumer package version differs from upstream.');
  if (upstream.apiVersion !== consumer.apiVersion) errors.push('Consumer API version differs from upstream.');
  if (upstream.commit !== consumer.coreCommit) errors.push('Consumer commit differs from upstream.');
  if (!contract.includes(`packageVersion: '${upstream.version}'`)) errors.push('Contract package version differs from upstream.');
  if (!contract.includes(`apiVersion: '${upstream.apiVersion}'`)) errors.push('Contract API version differs from upstream.');
  for (const symbol of ["createFileRoute('/api/platform-core-status')", 'validateConsumerManifest', 'status: healthy ? 200 : 503', 'no-store', 'noindex, nofollow']) {
    if (!route.includes(symbol)) errors.push(`Platform core status API missing: ${symbol}`);
  }
}
if (errors.length) {
  console.error('KeepTXRed platform core status validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('KeepTXRed platform core compatibility status is synchronized and protected.');
