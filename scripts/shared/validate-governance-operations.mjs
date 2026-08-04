import fs from 'node:fs';

const required = [
  'src/shared/platform-core/governance-events.ts',
  'src/platform/governance-event-store.ts',
  'src/routes/api.publication-gate.ts',
  'src/routes/api.governance-health.ts',
  'src/routes/admin/governance-health.tsx',
  'src/lib/content-publication-guard.ts',
  'src/shared/platform-core/consumer.json',
  'src/shared/platform-core/upstream.json',
];
const errors = [];
for (const file of required) if (!fs.existsSync(file)) errors.push(`Missing governance file: ${file}`);
if (!errors.length) {
  const core = fs.readFileSync(required[0], 'utf8');
  const store = fs.readFileSync(required[1], 'utf8');
  const gate = fs.readFileSync(required[2], 'utf8');
  const health = fs.readFileSync(required[3], 'utf8');
  const dashboard = fs.readFileSync(required[4], 'utf8');
  const internalGuard = fs.readFileSync(required[5], 'utf8');
  const consumer = JSON.parse(fs.readFileSync(required[6], 'utf8'));
  const upstream = JSON.parse(fs.readFileSync(required[7], 'utf8'));

  for (const symbol of ['createGovernanceEvent','validateGovernanceEvent','summarizeGovernanceEvents','detectOwnershipDrift']) if (!core.includes(symbol)) errors.push(`Shared governance contract missing ${symbol}`);
  for (const symbol of ['MAX_EVENTS = 2_000','appendGovernanceEvent','recordGovernanceDecision','structuredClone','storesArticleBodies: false','storesCaptions: false','storesReaderIdentifiers: false','storesCredentials: false']) if (!store.includes(symbol)) errors.push(`Governance store safeguard missing ${symbol}`);
  for (const symbol of ['recordGovernanceDecision','governanceEventIds','writer: \'api/publication-gate\'']) if (!gate.includes(symbol)) errors.push(`Publication gate logging missing ${symbol}`);
  for (const symbol of ['recordGovernanceDecision','internal-publication-guard','governanceEventIds']) if (!internalGuard.includes(symbol)) errors.push(`Internal publication guard logging missing ${symbol}`);
  for (const symbol of ['governanceHealth','status: health.healthy ? 200 : 503','no-store','noindex, nofollow']) if (!health.includes(symbol)) errors.push(`Governance health API safeguard missing ${symbol}`);
  for (const symbol of ['Governance Health','Blocked rate','Override acceptance','Privacy controls','buffer resets']) if (!dashboard.includes(symbol)) errors.push(`Governance dashboard coverage missing ${symbol}`);
  for (const forbidden of ['articleBody','caption:', 'email:', 'ipAddress', 'accessToken', 'password']) if (core.includes(forbidden) || store.includes(forbidden)) errors.push(`Privacy-prohibited field found: ${forbidden}`);
  for (const capability of ['governance-events','governance-analytics','ownership-drift-detection']) if (!consumer.capabilities.includes(capability)) errors.push(`Consumer capability missing ${capability}`);
  if (consumer.packageVersion !== '0.5.0' || consumer.apiVersion !== '1.3') errors.push('Consumer must use core 0.5.0 / API 1.3.');
  if (upstream.version !== '0.5.0' || upstream.apiVersion !== '1.3') errors.push('Upstream pin must use core 0.5.0 / API 1.3.');
  if (!/^[0-9a-f]{40}$/.test(upstream.commit) || upstream.commit !== consumer.coreCommit) errors.push('Consumer and upstream core commits must match exactly.');
}
if (errors.length) {
  console.error(`KeepTXRed governance validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('KeepTXRed governance logging, analytics, drift detection, privacy, API, dashboard, and internal guard coverage are valid.');
