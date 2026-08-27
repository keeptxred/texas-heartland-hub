import fs from 'node:fs';
import { CONTENT_OWNERSHIP_RULES, decideCrossSiteContent, validateContentOwnershipRules } from '../../src/shared/platform-core/content-intelligence.ts';
import { enforcePublicationDecision, createPublicationOverride } from '../../src/shared/platform-core/publication-gate.ts';
import { PLATFORM_CORE_CONTRACT, validateConsumerManifest } from '../../src/shared/platform-core/contract.ts';
import upstream from '../../src/shared/platform-core/upstream.json' with { type: 'json' };
import consumer from '../../src/shared/platform-core/consumer.json' with { type: 'json' };

const errors: string[] = [];
if (!/^[0-9a-f]{40}$/.test(upstream.commit)) errors.push('Upstream core pin must be a full 40-character commit SHA.');
if (upstream.version !== PLATFORM_CORE_CONTRACT.packageVersion || upstream.apiVersion !== PLATFORM_CORE_CONTRACT.apiVersion) errors.push('Upstream and contract versions differ.');
if (consumer.coreCommit !== upstream.commit || consumer.packageVersion !== upstream.version || consumer.apiVersion !== upstream.apiVersion) errors.push('Consumer and upstream release pins differ.');
errors.push(...validateConsumerManifest(consumer as Parameters<typeof validateConsumerManifest>[0]).errors);
for (const capability of ['content-ownership','duplicate-content-prevention','cross-site-disposition','publication-gates','reviewed-overrides']) if (!consumer.capabilities.includes(capability)) errors.push(`KeepTXRed capability missing: ${capability}`);
errors.push(...validateContentOwnershipRules().errors);
if (CONTENT_OWNERSHIP_RULES.some((rule) => rule.fullRepublicationAllowed)) errors.push('Full cross-site republication must remain disabled.');

const originalCandidate = { id: 'political-original', title: 'Texas election update', domain: 'elections' as const, sourceSite: 'KeepTXRed' as const, targetSite: 'KeepTXRed' as const, sourceCanonicalUrl: 'https://keeptxred.com/elections/2026' };
const originalDecision = decideCrossSiteContent(originalCandidate);
if (!enforcePublicationDecision(originalCandidate, originalDecision).publishable) errors.push('Canonical KeepTXRed originals are blocked.');
const lifestyleCandidate = { id: 'travel-copy', title: 'Texas state park guide', domain: 'travel' as const, sourceSite: 'TexasDefined' as const, targetSite: 'KeepTXRed' as const, sourceCanonicalUrl: 'https://texasdefined.com/explore/example' };
const lifestyleDecision = decideCrossSiteContent(lifestyleCandidate);
if (enforcePublicationDecision(lifestyleCandidate, lifestyleDecision).status !== 'blocked') errors.push('Cross-link-only lifestyle content is publishable.');
const duplicateCandidate = { ...lifestyleCandidate, id: 'duplicate', sourceFingerprint: 'fnv1a-12345678', contentFingerprint: 'fnv1a-12345678' };
const duplicateDecision = decideCrossSiteContent(duplicateCandidate);
if (enforcePublicationDecision(duplicateCandidate, duplicateDecision).status !== 'blocked') errors.push('Exact duplicate content is not permanently blocked.');
const manualCandidate = { id: 'manual', title: 'Imported election analysis', domain: 'elections' as const, sourceSite: 'TexasDefined' as const, targetSite: 'KeepTXRed' as const, sourceCanonicalUrl: 'https://texasdefined.com/example' };
const manualDecision = decideCrossSiteContent(manualCandidate);
const pending = enforcePublicationDecision(manualCandidate, manualDecision);
if (pending.status !== 'override-required') errors.push('Manual-review content does not require an override.');
const reviewedAt = new Date().toISOString();
const expiresAt = new Date(Date.now() + 86_400_000).toISOString();
const override = createPublicationOverride({ candidateId: manualCandidate.id, targetSite: 'KeepTXRed', decisionFingerprint: pending.decisionFingerprint, reviewer: 'editor@example.com', reason: 'Reviewed for distinct sourcing and editorial necessity.', reviewedAt, expiresAt });
if (!enforcePublicationDecision(manualCandidate, manualDecision, override).publishable) errors.push('Valid reviewed override is rejected.');

for (const routePath of ['src/routes/api.content-disposition.ts','src/routes/api.publication-gate.ts']) {
  if (!fs.existsSync(routePath)) errors.push(`Missing route: ${routePath}`);
}
const gateRoute = fs.readFileSync('src/routes/api.publication-gate.ts', 'utf8');
for (const symbol of ["createFileRoute('/api/publication-gate')","targetSite: 'KeepTXRed'",'enforcePublicationDecision','gate.publishable ? 200 : 409','100_000','no-store','noindex, nofollow']) if (!gateRoute.includes(symbol)) errors.push(`Publication gate API missing: ${symbol}`);
if (gateRoute.includes('writeFile') || gateRoute.includes('publish: true')) errors.push('Publication gate API must not write or publish directly.');

if (errors.length) { console.error(`KeepTXRed content ownership validation failed (${errors.length}):`); for (const error of errors) console.error(`  - ${error}`); process.exit(1); }
console.log(`KeepTXRed publication-gate validation passed (${CONTENT_OWNERSHIP_RULES.length} domains, core ${upstream.version}/${upstream.apiVersion}, ${upstream.commit.slice(0, 12)}).`);
