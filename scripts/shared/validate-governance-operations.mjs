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
  'src/shared/platform-core/contract.ts',
];
const errors = [];
for (const file of required) if (!fs.existsSync(file)) errors.push(`Missing governance file: ${file}`);
if (!errors.length) {
  const [core, store, gate, health, dashboard, internalGuard] = required.slice(0, 6).map((file) => fs.readFileSync(file, 'utf8'));
  const consumer = JSON.parse(fs.readFileSync(required[6], 'utf8'));
  const upstream = JSON.parse(fs.readFileSync(required[7], 'utf8'));
  const contract = fs.readFileSync(required[8], 'utf8');

  for (const symbol of ['createGovernanceEvent','validateGovernanceEvent','summarizeGovernanceEvents','detectOwnershipDrift']) if (!core.includes(symbol)) errors.push(`Shared governance contract missing ${symbol}`);
  for (const symbol of ['MAX_EVENTS = 2_000','appendGovernanceEvent','recordGovernanceDecision','structuredClone','site-local-bounded-memory','persistent: false','storesArticleBodies: false','storesCaptions: false','storesReaderIdentifiers: false','storesCredentials: false']) if (!store.includes(symbol)) errors.push(`Governance store safeguard missing ${symbol}`);
  for (const symbol of ['recordGovernanceDecision','governanceEventIds','writer: \'api/publication-gate\'']) if (!gate.includes(symbol)) errors.push(`Publication gate logging missing ${symbol}`);
  for (const symbol of ['recordGovernanceDecision','internal-publication-guard','governanceEventIds']) if (!internalGuard.includes(symbol)) errors.push(`Internal publication guard logging missing ${symbol}`);
  for (const symbol of ['await governanceHealth()','status: health.healthy ? 200 : 503','no-store','noindex, nofollow']) if (!health.includes(symbol)) errors.push(`Governance health API safeguard missing ${symbol}`);
  for (const symbol of ['Cross-Site Governance Health','Blocked rate','Override acceptance','Privacy controls','maxMemoryEvents','summary.bySite.TexasDefined','summary.bySite.KeepTXRed']) if (!dashboard.includes(symbol)) errors.push(`Governance dashboard coverage missing ${symbol}`);
  for (const forbidden of ['articleBody','caption:', 'email:', 'ipAddress', 'accessToken', 'password']) if (core.includes(forbidden) || store.includes(forbidden)) errors.push(`Privacy-prohibited field found: ${forbidden}`);
  for (const capability of ['governance-events','governance-analytics','ownership-drift-detection']) if (!consumer.capabilities.includes(capability)) errors.push(`Consumer capability missing ${capability}`);
  if (!contract.includes(`packageVersion: '${upstream.version}'`) || !contract.includes(`apiVersion: '${upstream.apiVersion}'`)) errors.push('Upstream and platform contract versions differ.');
  if (consumer.packageVersion !== upstream.version || consumer.apiVersion !== upstream.apiVersion) errors.push('Consumer and upstream versions must match exactly.');
  if (!/^[0-9a-f]{40}$/.test(upstream.commit) || upstream.commit !== consumer.coreCommit) errors.push('Consumer and upstream core commits must match exactly.');
}
if (errors.length) {
  console.error(`KeepTXRed governance validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('KeepTXRed bounded-memory cross-site governance logging, analytics, drift detection, privacy, API, dashboard, and internal guard coverage are valid.');
